/**
 * Shopify Admin GraphQL API Integration
 * API Version: 2025-10
 */

/**
 * Convert a date from UTC to Copenhagen timezone and return YYYY-MM-DD
 * @param {string} isoString - ISO date string
 * @returns {string} Date in YYYY-MM-DD format in Copenhagen timezone
 */
function toCopenhagenDate(isoString) {
    const date = new Date(isoString);
    // Convert to Copenhagen timezone (Europe/Copenhagen)
    const copenhagenDate = new Date(date.toLocaleString('en-US', { timeZone: 'Europe/Copenhagen' }));
    const year = copenhagenDate.getFullYear();
    const month = String(copenhagenDate.getMonth() + 1).padStart(2, '0');
    const day = String(copenhagenDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Fetch orders data from Shopify for a given date range
 * @param {Object} config - Configuration object
 * @param {string} config.shopUrl - Shopify store URL (e.g., 'pompdelux-da.myshopify.com')
 * @param {string} config.accessToken - Shopify Admin API access token
 * @param {string} config.startDate - Start date in YYYY-MM-DD format (Copenhagen timezone)
 * @param {string} config.endDate - End date in YYYY-MM-DD format (Copenhagen timezone)
 * @returns {Promise<Array>} Array of daily metrics
 */
export async function fetchShopifyOrderMetrics({ shopUrl, accessToken, startDate, endDate }) {
    const apiUrl = `https://${shopUrl}/admin/api/2025-10/graphql.json`;

    // Convert Copenhagen dates to UTC for the query
    // Start: beginning of day in Copenhagen = subtract 1-2 hours for UTC
    // End: end of day in Copenhagen = subtract 1-2 hours for UTC
    // To be safe, we'll query from start-1day to end+1day and filter in processing
    const startDateTime = `${startDate}T00:00:00+01:00`; // Copenhagen timezone
    const endDateTime = `${endDate}T23:59:59+01:00`; // Copenhagen timezone

    // Fetch orders
    const ordersQuery = `
        query getOrders($query: String!, $cursor: String) {
            orders(first: 250, query: $query, after: $cursor) {
                edges {
                    node {
                        id
                        name
                        createdAt
                        totalPriceSet {
                            shopMoney {
                                amount
                                currencyCode
                            }
                        }
                        totalTaxSet {
                            shopMoney {
                                amount
                            }
                        }
                    }
                    cursor
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    `;

    // Fetch refunds separately by updated_at date
    const refundsQuery = `
        query getRefunds($query: String!, $cursor: String) {
            orders(first: 250, query: $query, after: $cursor) {
                edges {
                    node {
                        id
                        refunds {
                            id
                            createdAt
                            totalRefundedSet {
                                shopMoney {
                                    amount
                                }
                            }
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    `;

    const allOrders = [];
    const allRefunds = [];
    
    try {
        // Fetch orders created in the date range
        let hasNextPage = true;
        let cursor = null;
        let pageCount = 0;
        const maxPages = 50;

        while (hasNextPage && pageCount < maxPages) {
            pageCount++;
            
            const queryString = `created_at:>='${startDateTime}' AND created_at:<='${endDateTime}'`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': accessToken,
                },
                body: JSON.stringify({
                    query: ordersQuery,
                    variables: {
                        query: queryString,
                        cursor: cursor
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            if (data.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
            }

            const orders = data.data?.orders?.edges || [];
            allOrders.push(...orders);

            hasNextPage = data.data?.orders?.pageInfo?.hasNextPage || false;
            cursor = data.data?.orders?.pageInfo?.endCursor || null;

            console.log(`Fetched orders page ${pageCount}, orders: ${orders.length}, total: ${allOrders.length}`);

            if (orders.length === 0) break;
        }

        // Fetch refunds that occurred in the date range
        hasNextPage = true;
        cursor = null;
        pageCount = 0;

        while (hasNextPage && pageCount < maxPages) {
            pageCount++;
            
            const queryString = `updated_at:>='${startDateTime}' AND updated_at:<='${endDateTime}'`;
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': accessToken,
                },
                body: JSON.stringify({
                    query: refundsQuery,
                    variables: {
                        query: queryString,
                        cursor: cursor
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            if (data.errors) {
                throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
            }

            const orders = data.data?.orders?.edges || [];
            
            // Extract refunds from orders
            orders.forEach(({ node: order }) => {
                if (order.refunds && order.refunds.length > 0) {
                    order.refunds.forEach(refund => {
                        const refundDate = toCopenhagenDate(refund.createdAt);
                        // Only include refunds created within our date range (Copenhagen time)
                        if (refundDate >= startDate && refundDate <= endDate) {
                            allRefunds.push({
                                createdAt: refund.createdAt,
                                amount: parseFloat(refund.totalRefundedSet?.shopMoney?.amount || 0)
                            });
                        }
                    });
                }
            });

            hasNextPage = data.data?.orders?.pageInfo?.hasNextPage || false;
            cursor = data.data?.orders?.pageInfo?.endCursor || null;

            console.log(`Fetched refunds page ${pageCount}, orders checked: ${orders.length}, total refunds: ${allRefunds.length}`);

            if (orders.length === 0) break;
        }

        console.log(`Total orders fetched: ${allOrders.length}, total refunds: ${allRefunds.length} for period ${startDate} to ${endDate}`);

        // Process orders and refunds into daily metrics
        return processOrdersToMetrics(allOrders, allRefunds, startDate, endDate);

    } catch (error) {
        console.error('Error fetching Shopify orders:', error);
        throw error;
    }
}

/**
 * Process raw orders and refunds into daily aggregated metrics
 * @param {Array} orders - Array of order edges from GraphQL
 * @param {Array} refunds - Array of refund objects with createdAt and amount
 * @param {string} startDate - Start date filter (Copenhagen timezone)
 * @param {string} endDate - End date filter (Copenhagen timezone)
 * @returns {Array} Array of daily metrics
 */
function processOrdersToMetrics(orders, refunds, startDate, endDate) {
    const dailyMetrics = {};

    // Process orders by creation date in Copenhagen timezone
    orders.forEach(({ node: order }) => {
        const date = toCopenhagenDate(order.createdAt);
        
        // Filter to only include orders within the date range (Copenhagen time)
        if (date < startDate || date > endDate) {
            return;
        }

        if (!dailyMetrics[date]) {
            dailyMetrics[date] = {
                date,
                orders: 0,
                revenue: 0,
                revenue_ex_tax: 0,
                total_tax: 0,
                total_refunds: 0,
                ppc_cost: 0,
                ps_cost: 0,
            };
        }

        const totalPrice = parseFloat(order.totalPriceSet?.shopMoney?.amount || 0);
        const totalTax = parseFloat(order.totalTaxSet?.shopMoney?.amount || 0);

        dailyMetrics[date].orders += 1;
        dailyMetrics[date].revenue += totalPrice;
        dailyMetrics[date].revenue_ex_tax += (totalPrice - totalTax);
        dailyMetrics[date].total_tax += totalTax;
    });

    // Process refunds by refund creation date in Copenhagen timezone
    refunds.forEach(refund => {
        const date = toCopenhagenDate(refund.createdAt);

        if (!dailyMetrics[date]) {
            dailyMetrics[date] = {
                date,
                orders: 0,
                revenue: 0,
                revenue_ex_tax: 0,
                total_tax: 0,
                total_refunds: 0,
                ppc_cost: 0,
                ps_cost: 0,
            };
        }

        // Subtract refund amount from revenue
        dailyMetrics[date].revenue -= refund.amount;
        dailyMetrics[date].revenue_ex_tax -= refund.amount; // Refunds include tax, so subtract from ex_tax too
        dailyMetrics[date].total_refunds += refund.amount;
    });

    // Convert to array and sort by date (ascending)
    return Object.values(dailyMetrics).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Fetch Shopify metrics with calculations for ROAS, POAS, etc.
 * @param {Object} config - Configuration object
 * @returns {Promise<Object>} Object containing metrics and totals
 */
export async function fetchShopifyDashboardMetrics(config) {
    const metrics = await fetchShopifyOrderMetrics(config);

    // Calculate derived metrics for each day
    const COGS = 0.7; // 70% Cost of Goods Sold
    const TAX_RATE = 0.25; // 25% Danish VAT

    const overview_metrics = metrics.map(row => ({
        ...row,
        spendshare: row.revenue_ex_tax > 0 ? (row.ppc_cost + row.ps_cost) / row.revenue_ex_tax : 0,
        spendshare_db: row.revenue_ex_tax > 0 ? (row.ppc_cost + row.ps_cost) / (COGS * row.revenue_ex_tax) : 0,
        roas: (row.ppc_cost + row.ps_cost) > 0 ? row.revenue / (row.ppc_cost + row.ps_cost) : 0,
        poas: (row.ppc_cost + row.ps_cost) > 0 ? (row.revenue * (1 - TAX_RATE) - row.revenue * COGS) / (row.ppc_cost + row.ps_cost) : 0,
        gp: row.revenue * (1 - TAX_RATE) - row.revenue * COGS,
        aov: row.orders > 0 ? row.revenue / row.orders : 0,
    }));

    // Calculate totals
    const totals = overview_metrics.reduce(
        (acc, row) => ({
            date: "Total",
            orders: acc.orders + row.orders,
            revenue: acc.revenue + row.revenue,
            revenue_ex_tax: acc.revenue_ex_tax + row.revenue_ex_tax,
            ppc_cost: acc.ppc_cost + row.ppc_cost,
            ps_cost: acc.ps_cost + row.ps_cost,
            gp: acc.gp + row.gp,
        }),
        {
            orders: 0,
            revenue: 0,
            revenue_ex_tax: 0,
            ppc_cost: 0,
            ps_cost: 0,
            gp: 0,
        }
    );

    // Calculate aggregate metrics for totals
    totals.roas = (totals.ppc_cost + totals.ps_cost) > 0 ? totals.revenue / (totals.ppc_cost + totals.ps_cost) : 0;
    totals.poas = (totals.ppc_cost + totals.ps_cost) > 0 ? (totals.revenue * (1 - TAX_RATE) - totals.revenue * COGS) / (totals.ppc_cost + totals.ps_cost) : 0;
    totals.spendshare = totals.revenue_ex_tax > 0 ? (totals.ppc_cost + totals.ps_cost) / totals.revenue_ex_tax : 0;
    totals.spendshare_db = totals.revenue_ex_tax > 0 ? (totals.ppc_cost + totals.ps_cost) / (COGS * totals.revenue_ex_tax) : 0;
    totals.aov = totals.orders > 0 ? totals.revenue / totals.orders : 0;

    // Dummy last year totals for now
    const last_year_totals = {
        date: "Last Year Total",
        orders: 0,
        revenue: 0,
        revenue_ex_tax: 0,
        ppc_cost: 0,
        ps_cost: 0,
        roas: 0,
        poas: 0,
        spendshare: 0,
        spendshare_db: 0,
        gp: 0,
        aov: 0,
    };

    return {
        overview_metrics,
        totals,
        last_year_totals,
    };
}
