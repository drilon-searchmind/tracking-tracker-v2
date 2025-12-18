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
 * Fetch Shopify P&L metrics with detailed billing breakdown
 * @param {Object} config - Configuration object
 * @param {string} config.shopUrl - Shopify store URL
 * @param {string} config.accessToken - Shopify Admin API access token
 * @param {string} config.startDate - Start date in YYYY-MM-DD format
 * @param {string} config.endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of daily P&L metrics
 */
export async function fetchShopifyPnLMetrics({ shopUrl, accessToken, startDate, endDate }) {
    const apiUrl = `https://${shopUrl}/admin/api/2025-10/graphql.json`;

    const startDateTime = `${startDate}T00:00:00+01:00`; // Copenhagen timezone
    const endDateTime = `${endDate}T23:59:59+01:00`; // Copenhagen timezone

    // Fetch orders with detailed billing information
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
                        subtotalLineItemsQuantity
                        totalDiscountsSet {
                            shopMoney {
                                amount
                            }
                        }
                        totalTaxSet {
                            shopMoney {
                                amount
                            }
                        }
                        totalShippingPriceSet {
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

    // Fetch refunds
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
        // Fetch orders
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

            console.log(`Fetched P&L orders page ${pageCount}, orders: ${orders.length}, total: ${allOrders.length}`);

            if (orders.length === 0) break;
        }

        // Fetch refunds
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
                        // Only include refunds created within our date range
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

            console.log(`Fetched P&L refunds page ${pageCount}, orders checked: ${orders.length}, total refunds: ${allRefunds.length}`);

            if (orders.length === 0) break;
        }

        console.log(`Total P&L orders fetched: ${allOrders.length}, total refunds: ${allRefunds.length}`);

        // Process into daily metrics for P&L
        return processOrdersToPnLMetrics(allOrders, allRefunds, startDate, endDate);

    } catch (error) {
        console.error('Error fetching Shopify P&L data:', error);
        throw error;
    }
}

/**
 * Process orders and refunds into P&L daily metrics
 */
function processOrdersToPnLMetrics(orders, refunds, startDate, endDate) {
    const dailyMetrics = {};

    // Process orders
    orders.forEach(({ node: order }) => {
        const date = toCopenhagenDate(order.createdAt);
        
        if (date < startDate || date > endDate) {
            return;
        }

        if (!dailyMetrics[date]) {
            dailyMetrics[date] = {
                date,
                orders: 0,
                gross_sales: 0,
                total_discounts: 0,
                total_refunds: 0,
                shipping_fees: 0,
                total_taxes: 0,
                net_sales: 0,
            };
        }

        const totalPrice = parseFloat(order.totalPriceSet?.shopMoney?.amount || 0);
        const totalDiscounts = parseFloat(order.totalDiscountsSet?.shopMoney?.amount || 0);
        const totalTax = parseFloat(order.totalTaxSet?.shopMoney?.amount || 0);
        const shippingFees = parseFloat(order.totalShippingPriceSet?.shopMoney?.amount || 0);

        dailyMetrics[date].orders += 1;
        dailyMetrics[date].gross_sales += totalPrice + totalDiscounts; // Gross sales before discounts
        dailyMetrics[date].total_discounts += totalDiscounts;
        dailyMetrics[date].total_taxes += totalTax;
        dailyMetrics[date].shipping_fees += shippingFees;
        dailyMetrics[date].net_sales += totalPrice; // Net sales after discounts
    });

    // Process refunds
    refunds.forEach(refund => {
        const date = toCopenhagenDate(refund.createdAt);

        if (!dailyMetrics[date]) {
            dailyMetrics[date] = {
                date,
                orders: 0,
                gross_sales: 0,
                total_discounts: 0,
                total_refunds: 0,
                shipping_fees: 0,
                total_taxes: 0,
                net_sales: 0,
            };
        }

        dailyMetrics[date].total_refunds += refund.amount;
        dailyMetrics[date].net_sales -= refund.amount;
    });

    return Object.values(dailyMetrics).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Fetch Shopify metrics with calculations for ROAS, POAS, etc.
 * Also merges Facebook Ads and Google Ads data if provided
 * @param {Object} config - Configuration object
 * @param {Array} facebookAdsData - Optional Facebook Ads data to merge (PS Cost) for current period
 * @param {Array} googleAdsData - Optional Google Ads data to merge (PPC Cost) for current period
 * @param {Array} lastYearFacebookAdsData - Optional Facebook Ads data for last year period
 * @param {Array} lastYearGoogleAdsData - Optional Google Ads data for last year period
 * @param {Array} twoYearsAgoFacebookAdsData - Optional Facebook Ads data for 2 years ago period
 * @param {Array} twoYearsAgoGoogleAdsData - Optional Google Ads data for 2 years ago period
 * @returns {Promise<Object>} Object containing metrics and totals
 */
export async function fetchShopifyDashboardMetrics(
    config, 
    facebookAdsData = [], 
    googleAdsData = [],
    lastYearFacebookAdsData = [],
    lastYearGoogleAdsData = [],
    twoYearsAgoFacebookAdsData = [],
    twoYearsAgoGoogleAdsData = []
) {
    const COGS = 0.7; // 70% Cost of Goods Sold
    const TAX_RATE = 0.25; // 25% Danish VAT

    // Helper function to calculate derived metrics
    const calculateDerivedMetrics = (metrics) => metrics.map(row => ({
        ...row,
        spendshare: row.revenue_ex_tax > 0 ? (row.ppc_cost + row.ps_cost) / row.revenue_ex_tax : 0,
        spendshare_db: row.revenue_ex_tax > 0 ? (row.ppc_cost + row.ps_cost) / (COGS * row.revenue_ex_tax) : 0,
        roas: (row.ppc_cost + row.ps_cost) > 0 ? row.revenue / (row.ppc_cost + row.ps_cost) : 0,
        poas: (row.ppc_cost + row.ps_cost) > 0 ? (row.revenue * (1 - TAX_RATE) - row.revenue * COGS) / (row.ppc_cost + row.ps_cost) : 0,
        gp: row.revenue * (1 - TAX_RATE) - row.revenue * COGS,
        aov: row.orders > 0 ? row.revenue / row.orders : 0,
    }));

    // Helper function to calculate totals
    const calculateTotals = (metricsArray) => {
        const totals = metricsArray.reduce(
            (acc, row) => ({
                date: "Total",
                orders: acc.orders + row.orders,
                revenue: acc.revenue + row.revenue,
                revenue_ex_tax: acc.revenue_ex_tax + row.revenue_ex_tax,
                ppc_cost: acc.ppc_cost + row.ppc_cost,
                ps_cost: acc.ps_cost + row.ps_cost,
                gp: acc.gp + row.gp,
            }),
            { orders: 0, revenue: 0, revenue_ex_tax: 0, ppc_cost: 0, ps_cost: 0, gp: 0 }
        );

        // Calculate aggregate metrics for totals
        totals.roas = (totals.ppc_cost + totals.ps_cost) > 0 ? totals.revenue / (totals.ppc_cost + totals.ps_cost) : 0;
        totals.poas = (totals.ppc_cost + totals.ps_cost) > 0 ? (totals.revenue * (1 - TAX_RATE) - totals.revenue * COGS) / (totals.ppc_cost + totals.ps_cost) : 0;
        totals.spendshare = totals.revenue_ex_tax > 0 ? (totals.ppc_cost + totals.ps_cost) / totals.revenue_ex_tax : 0;
        totals.spendshare_db = totals.revenue_ex_tax > 0 ? (totals.ppc_cost + totals.ps_cost) / (COGS * totals.revenue_ex_tax) : 0;
        totals.aov = totals.orders > 0 ? totals.revenue / totals.orders : 0;

        return totals;
    };

    // Current period
    const metrics = await fetchShopifyOrderMetrics(config);
    const mergedMetrics = mergeWithAdsData(metrics, facebookAdsData, googleAdsData);
    const overview_metrics = calculateDerivedMetrics(mergedMetrics);
    const totals = calculateTotals(overview_metrics);

    // Last year period
    const lastYearConfig = {
        ...config,
        startDate: getLastYearDate(config.startDate),
        endDate: getLastYearDate(config.endDate)
    };
    const lastYearMetrics = await fetchShopifyOrderMetrics(lastYearConfig);
    const lastYearMerged = mergeWithAdsData(lastYearMetrics, lastYearFacebookAdsData, lastYearGoogleAdsData);
    const last_year_metrics = calculateDerivedMetrics(lastYearMerged);
    const last_year_totals = calculateTotals(last_year_metrics);

    // 2 years ago period
    const twoYearsAgoConfig = {
        ...config,
        startDate: getTwoYearsAgoDate(config.startDate),
        endDate: getTwoYearsAgoDate(config.endDate)
    };
    const twoYearsAgoMetrics = await fetchShopifyOrderMetrics(twoYearsAgoConfig);
    const twoYearsAgoMerged = mergeWithAdsData(twoYearsAgoMetrics, twoYearsAgoFacebookAdsData, twoYearsAgoGoogleAdsData);
    const two_years_ago_metrics = calculateDerivedMetrics(twoYearsAgoMerged);
    const two_years_ago_totals = calculateTotals(two_years_ago_metrics);

    return {
        overview_metrics,
        totals,
        last_year_totals,
        last_year_metrics,
        two_years_ago_totals,
    };
}

/**
 * Helper function to get last year's date
 */
function getLastYearDate(dateString) {
    const date = new Date(dateString);
    date.setFullYear(date.getFullYear() - 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Helper function to get 2 years ago date
 */
function getTwoYearsAgoDate(dateString) {
    const date = new Date(dateString);
    date.setFullYear(date.getFullYear() - 2);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Fetch product performance data from Shopify
 * @param {Object} config - Configuration object
 * @param {string} config.shopUrl - Shopify store URL
 * @param {string} config.accessToken - Shopify Admin API access token
 * @param {string} config.startDate - Start date in YYYY-MM-DD format (Copenhagen timezone)
 * @param {string} config.endDate - End date in YYYY-MM-DD format (Copenhagen timezone)
 * @returns {Promise<Object>} Object containing dashboard_data, top_products, and product_daily_metrics
 */
export async function fetchShopifyProductMetrics({ shopUrl, accessToken, startDate, endDate }) {
    const apiUrl = `https://${shopUrl}/admin/api/2025-10/graphql.json`;
    
    const startDateTime = `${startDate}T00:00:00+01:00`;
    const endDateTime = `${endDate}T23:59:59+01:00`;

    // Query for orders with line items
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
                        lineItems(first: 100) {
                            edges {
                                node {
                                    id
                                    name
                                    title
                                    quantity
                                    originalUnitPriceSet {
                                        shopMoney {
                                            amount
                                        }
                                    }
                                    discountedTotalSet {
                                        shopMoney {
                                            amount
                                        }
                                    }
                                    product {
                                        id
                                        title
                                        vendor
                                        productType
                                        status
                                        totalInventory
                                        handle
                                        featuredImage {
                                            url
                                        }
                                    }
                                }
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

    const allOrders = [];
    
    try {
        // Fetch orders with line items
        let hasNextPage = true;
        let cursor = null;
        const queryString = `created_at:>='${startDateTime}' AND created_at:<='${endDateTime}'`;

        while (hasNextPage) {
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
                        cursor: cursor,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            if (result.errors) {
                console.error('GraphQL Errors:', result.errors);
                throw new Error('GraphQL query failed');
            }

            const orders = result.data?.orders?.edges || [];
            allOrders.push(...orders);

            hasNextPage = result.data?.orders?.pageInfo?.hasNextPage || false;
            cursor = result.data?.orders?.pageInfo?.endCursor || null;

            console.log(`Fetched ${allOrders.length} orders so far...`);
        }

        console.log(`Total orders fetched: ${allOrders.length}`);
        console.log(`Date range filter: ${startDate} to ${endDate}`);

        // Process data into the required structure
        const dashboardDataMap = {};
        const productMetricsMap = {};
        const productDailyMetricsMap = {};
        let ordersInDateRange = 0;
        let ordersOutsideDateRange = 0;

        allOrders.forEach(({ node: order }) => {
            const orderDate = toCopenhagenDate(order.createdAt);
            
            // Filter to only include orders within the date range (Copenhagen time)
            if (orderDate < startDate || orderDate > endDate) {
                ordersOutsideDateRange++;
                return;
            }
            
            ordersInDateRange++;
            const revenue = parseFloat(order.totalPriceSet?.shopMoney?.amount || 0);

            // Dashboard data (date-level metrics)
            if (!dashboardDataMap[orderDate]) {
                dashboardDataMap[orderDate] = {
                    date: orderDate,
                    revenue: 0,
                    orders: 0,
                    cost: 0,
                    impressions: 0,
                };
            }
            dashboardDataMap[orderDate].revenue += revenue;
            dashboardDataMap[orderDate].orders += 1;

            // Process line items
            order.lineItems?.edges?.forEach(({ node: lineItem }) => {
                if (!lineItem.product) return;

                const productId = lineItem.product.id.split('/').pop();
                const productName = lineItem.product.title;
                const quantity = lineItem.quantity;
                const unitPrice = parseFloat(lineItem.originalUnitPriceSet?.shopMoney?.amount || 0);
                const lineTotal = parseFloat(lineItem.discountedTotalSet?.shopMoney?.amount || 0);

                // Product metrics (aggregate)
                if (!productMetricsMap[productId]) {
                    productMetricsMap[productId] = {
                        product_id: productId,
                        product_name: productName,
                        product_title: lineItem.title,
                        vendor: lineItem.product.vendor || '',
                        product_type: lineItem.product.productType || '',
                        status: lineItem.product.status,
                        total_quantity_sold: 0,
                        total_orders: new Set(),
                        total_revenue: 0,
                        unit_prices: [],
                        featured_image_url: lineItem.product.featuredImage?.url || null,
                        total_inventory: lineItem.product.totalInventory || 0,
                        handle: lineItem.product.handle || '',
                        first_sold_date: orderDate,
                        last_sold_date: orderDate,
                    };
                }

                productMetricsMap[productId].total_quantity_sold += quantity;
                productMetricsMap[productId].total_orders.add(order.id);
                productMetricsMap[productId].total_revenue += lineTotal;
                productMetricsMap[productId].unit_prices.push(unitPrice);
                
                if (orderDate < productMetricsMap[productId].first_sold_date) {
                    productMetricsMap[productId].first_sold_date = orderDate;
                }
                if (orderDate > productMetricsMap[productId].last_sold_date) {
                    productMetricsMap[productId].last_sold_date = orderDate;
                }

                // Product daily metrics
                const dailyKey = `${orderDate}_${productId}`;
                if (!productDailyMetricsMap[dailyKey]) {
                    productDailyMetricsMap[dailyKey] = {
                        order_date: orderDate,
                        product_id: productId,
                        product_name: productName,
                        daily_quantity: 0,
                        daily_revenue: 0,
                        daily_orders: new Set(),
                    };
                }

                productDailyMetricsMap[dailyKey].daily_quantity += quantity;
                productDailyMetricsMap[dailyKey].daily_revenue += lineTotal;
                productDailyMetricsMap[dailyKey].daily_orders.add(order.id);
            });
        });

        // Convert maps to arrays
        const dashboard_data = Object.values(dashboardDataMap).sort((a, b) => 
            a.date.localeCompare(b.date)
        );

        const top_products = Object.values(productMetricsMap)
            .map(product => ({
                ...product,
                total_orders: product.total_orders.size,
                avg_unit_price: product.unit_prices.length > 0 
                    ? product.unit_prices.reduce((a, b) => a + b, 0) / product.unit_prices.length 
                    : 0,
                revenue_per_unit: product.total_quantity_sold > 0 
                    ? product.total_revenue / product.total_quantity_sold 
                    : 0,
            }))
            .filter(product => product.total_quantity_sold > 0)
            .sort((a, b) => b.total_revenue - a.total_revenue)
            .slice(0, 100);

        // Remove temporary fields
        top_products.forEach(product => {
            delete product.unit_prices;
        });

        const product_daily_metrics = Object.values(productDailyMetricsMap)
            .map(metric => ({
                ...metric,
                daily_orders: metric.daily_orders.size,
            }))
            .sort((a, b) => a.order_date.localeCompare(b.order_date));

        console.log(`Processed ${dashboard_data.length} days, ${top_products.length} products, ${product_daily_metrics.length} daily metrics`);
        console.log(`Orders in date range: ${ordersInDateRange}, Orders outside date range: ${ordersOutsideDateRange}`);

        return {
            dashboard_data,
            top_products,
            product_daily_metrics,
        };

    } catch (error) {
        console.error('Error fetching Shopify product metrics:', error);
        throw error;
    }
}

/**
 * Merge Facebook Ads and Google Ads data with Shopify metrics by date
 * @param {Array} shopifyMetrics - Shopify metrics array
 * @param {Array} facebookAdsData - Facebook Ads data array (PS Cost)
 * @param {Array} googleAdsData - Google Ads data array (PPC Cost)
 * @returns {Array} Merged metrics
 */
function mergeWithAdsData(shopifyMetrics, facebookAdsData, googleAdsData) {
    // Create maps for both ad platforms by date
    const facebookMap = {};
    facebookAdsData.forEach(row => {
        facebookMap[row.date] = row.ps_cost;
    });

    const googleMap = {};
    googleAdsData.forEach(row => {
        googleMap[row.date] = row.ppc_cost;
    });

    // Create a set of all dates from all sources
    const allDates = new Set([
        ...shopifyMetrics.map(m => m.date),
        ...facebookAdsData.map(m => m.date),
        ...googleAdsData.map(m => m.date)
    ]);

    // Merge data by date
    const mergedMetrics = Array.from(allDates).map(date => {
        const shopifyData = shopifyMetrics.find(m => m.date === date) || {
            date,
            orders: 0,
            revenue: 0,
            revenue_ex_tax: 0,
            total_tax: 0,
            total_refunds: 0,
        };

        const ps_cost = facebookMap[date] || 0;
        const ppc_cost = googleMap[date] || 0;

        return {
            ...shopifyData,
            ps_cost,
            ppc_cost,
        };
    });

    // Sort by date
    return mergedMetrics.sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchShopifySalesAnalytics({ shopUrl, accessToken, startDate, endDate }) {
    const apiUrl = `https://${shopUrl}/admin/api/2025-10/graphql.json`;

    // ShopifyQL requires GROUP BY when using ORDER BY
    // We need to group by day to get daily breakdowns
    const salesQuery = `
        query {
            shopifyqlQuery(query: "FROM sales SHOW orders, gross_sales, discounts, returns, net_sales, shipping_charges, duties, additional_fees, taxes, total_sales GROUP BY day SINCE ${startDate} UNTIL ${endDate} ORDER BY day ASC") {
                tableData {
                    columns {
                        name
                        dataType
                        displayName
                    }
                    rows
                }
                parseErrors
            }
        }
    `;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': accessToken,
            },
            body: JSON.stringify({
                query: salesQuery,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Shopify API error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        if (result.errors) {
            console.error('GraphQL Errors:', result.errors);
            throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
        }

        const queryData = result.data?.shopifyqlQuery;

        // Check for parse errors
        if (queryData?.parseErrors && queryData.parseErrors.length > 0) {
            console.error('ShopifyQL Parse Errors:', queryData.parseErrors);
            throw new Error(`ShopifyQL parse errors: ${JSON.stringify(queryData.parseErrors)}`);
        }

        // Check if we have table data
        if (!queryData?.tableData) {
            throw new Error('No table data returned from Shopify');
        }

        const { columns, rows } = queryData.tableData;

        // The rows in Shopify's response are objects, not arrays
        // Map them directly
        const salesData = rows.map(row => {
            const dataRow = {};
            columns.forEach(col => {
                const value = row[col.name];
                // Parse numeric values
                dataRow[col.name] = (col.dataType === 'MONEY' || col.dataType === 'NUMBER') 
                    ? parseFloat(value || 0) 
                    : value;
            });
            return dataRow;
        });

        // Calculate totals
        const totals = salesData.reduce(
            (acc, row) => {
                columns.forEach(col => {
                    if (col.dataType === 'MONEY' || col.dataType === 'NUMBER') {
                        acc[col.name] = (acc[col.name] || 0) + (row[col.name] || 0);
                    }
                });
                return acc;
            },
            {}
        );

        console.log('=== SHOPIFY SALES ANALYTICS ===');
        console.log(`Period: ${startDate} to ${endDate}`);
        console.log('Columns:', columns.map(c => `${c.displayName} (${c.name})`));
        console.log('Daily data:', salesData);
        console.log('\n--- TOTALS ---');
        console.log('Bruttoomsætning (gross_sales):', Math.round(totals.gross_sales || 0).toLocaleString(), 'kr');
        console.log('Rabatter (discounts):', Math.round(totals.discounts || 0).toLocaleString(), 'kr');
        console.log('Returneringer (returns):', Math.round(totals.returns || 0).toLocaleString(), 'kr');
        console.log('Nettoomsætning (net_sales):', Math.round(totals.net_sales || 0).toLocaleString(), 'kr');
        console.log('Leveringsgebyrer (shipping_charges):', Math.round(totals.shipping_charges || 0).toLocaleString(), 'kr');
        console.log('Skatter (taxes):', Math.round(totals.taxes || 0).toLocaleString(), 'kr');
        console.log('Salg i alt (total_sales):', Math.round(totals.total_sales || 0).toLocaleString(), 'kr');
        console.log('================================');

        return {
            salesData,
            totals,
            columns,
        };
    } catch (error) {
        console.error('Error fetching Shopify sales analytics:', error);
        throw error;
    }
}