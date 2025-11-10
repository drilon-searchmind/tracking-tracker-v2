import { BigQuery } from '@google-cloud/bigquery';
import currencyExchangeData from '@/lib/static-data/currencyApiValues.json';

let bigQueryClient = null;

// Currency conversion utility
const convertCurrency = (amount, fromCurrency, toCurrency = "DKK") => {
    if (!amount || fromCurrency === toCurrency) return amount;
    
    const exchangeData = currencyExchangeData.data;
    
    if (!exchangeData[fromCurrency] || !exchangeData[toCurrency]) {
        console.warn(`Currency conversion failed: ${fromCurrency} to ${toCurrency}`);
        return amount;
    }
    
    // Convert from source currency to USD, then to target currency
    const amountInUSD = amount / exchangeData[fromCurrency].value;
    const convertedAmount = amountInUSD * exchangeData[toCurrency].value;
    
    return convertedAmount;
};

// *** BigQuery client init
export function getBigQueryClient() {
    if (bigQueryClient) {
        console.log("::: Using existing BigQuery client");
        return bigQueryClient;
    }

    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);

    if (!projectId || !credentials) {
        throw new Error("::: Please define the GOOGLE_CLOUD_PROJECT_ID and GOOGLE_CLOUD_CREDENTIALS environment variables");
    }

    console.log("::: Creating new BigQuery client...");

    bigQueryClient = new BigQuery({
        projectId,
        credentials,
    });

    return bigQueryClient;
}

export async function queryBigQueryCampaign({ tableId, customerId, queryParams = {}, limit = 1000 }) {
    console.log(`::: Querying BigQuery for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("", "");
        const formattedTableId = `${tableId}.${cleanCustomerId}.campaign`;

        console.log(`::: Constructed BigQuery table ID: ${formattedTableId}`);

        let query = `SELECT * FROM \`${formattedTableId}\``;
        const params = {};
        let paramCounter = 1;

        if (queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        query += ` LIMIT ${limit}`;

        const options = {
            query,
            params,
            location: "EU",
        };

        console.log("::: Executing BigQuery query:", query);
        const [rows] = await bigQuery.query(options);

        console.log(`::: Fetched ${rows.length} rows from BigQuery table: ${formattedTableId}`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery:", error);
        throw new Error(`Failed to query BigQuery: ${error.message}`);
    }
}

export async function queryBigQueryOrders({ tableId, customerId, queryParams = {}, limit = 1000 }) {
    console.log(`::: Querying BigQuery for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("", "");
        const formattedTableId = `${tableId}.${cleanCustomerId}.orders`;

        console.log(`::: Constructed BigQuery table ID: ${formattedTableId}`);

        let query = `SELECT * FROM \`${formattedTableId}\``;
        const params = {};
        let paramCounter = 1;

        if (queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        query += ` LIMIT ${limit}`;

        const options = {
            query,
            params,
            location: "EU",
        };

        console.log("::: Executing BigQuery query:", query);
        const [rows] = await bigQuery.query(options);

        console.log(`::: Fetched ${rows.length} rows from BigQuery table: ${formattedTableId}`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery:", error);
        throw new Error(`Failed to query BigQuery: ${error.message}`);
    }
}

export async function queryBigQuerySearchAnalyticsAllFields({ tableId, customerId, queryParams = {}, limit = 1000 }) {
    console.log(`::: Querying BigQuery for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("", "");
        const formattedTableId = `${tableId}.${cleanCustomerId}.search_analytics_all_fields`;

        console.log(`::: Constructed BigQuery table ID: ${formattedTableId}`);

        let query = `SELECT * FROM \`${formattedTableId}\``;
        const params = {};
        let paramCounter = 1;

        if (queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        query += ` LIMIT ${limit}`;

        const options = {
            query,
            params,
            location: "EU",
        };

        console.log("::: Executing BigQuery query:", query);
        const [rows] = await bigQuery.query(options);

        console.log(`::: Fetched ${rows.length} rows from BigQuery table: ${formattedTableId}`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery:", error);
        throw new Error(`Failed to query BigQuery: ${error.message}`);
    }
}

export async function queryBigQuerySearchAnalyticsKeywordPageReport({ tableId, customerId, queryParams = {}, limit = 1000 }) {
    console.log(`::: Querying BigQuery for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("", "");
        const formattedTableId = `${tableId}.${cleanCustomerId}.search_analytics_keyword_page_report`;

        console.log(`::: Constructed BigQuery table ID: ${formattedTableId}`);

        let query = `SELECT * FROM \`${formattedTableId}\``;
        const params = {};
        let paramCounter = 1;

        if (queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        query += ` LIMIT ${limit}`;

        const options = {
            query,
            params,
            location: "EU",
        };

        console.log("::: Executing BigQuery query:", query);
        const [rows] = await bigQuery.query(options);

        console.log(`::: Fetched ${rows.length} rows from BigQuery table: ${formattedTableId}`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery:", error);
        throw new Error(`Failed to query BigQuery: ${error.message}`);
    }
}

export async function queryBigQueryTrafficAcquisitionSessionDefaultChannelGroupingReport({ tableId, customerId, queryParams = {}, limit = 1000 }) {
    console.log(`::: Querying BigQuery for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("", "");
        const formattedTableId = `${tableId}.${cleanCustomerId}.traffic_acquisition_session_default_channel_grouping_report`;

        console.log(`::: Constructed BigQuery table ID: ${formattedTableId}`);

        let query = `SELECT * FROM \`${formattedTableId}\``;
        const params = {};
        let paramCounter = 1;

        if (queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        query += ` LIMIT ${limit}`;

        const options = {
            query,
            params,
            location: "EU",
        };

        console.log("::: Executing BigQuery query:", query);
        const [rows] = await bigQuery.query(options);

        console.log(`::: Fetched ${rows.length} rows from BigQuery table: ${formattedTableId}`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery:", error);
        throw new Error(`Failed to query BigQuery: ${error.message}`);
    }
}

export async function queryBigQueryAdsInsights({ tableId, customerId, queryParams = {}, limit = 1000 }) {
    console.log(`::: Querying BigQuery for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("", "");
        const formattedTableId = `${tableId}.${cleanCustomerId}.ads_insights`;

        console.log(`::: Constructed BigQuery table ID: ${formattedTableId}`);

        let query = `SELECT * FROM \`${formattedTableId}\``;
        const params = {};
        let paramCounter = 1;

        if (queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        query += ` LIMIT ${limit}`;

        const options = {
            query,
            params,
            location: "EU",
        };

        console.log("::: Executing BigQuery query:", query);
        const [rows] = await bigQuery.query(options);

        console.log(`::: Fetched ${rows.length} rows from BigQuery table: ${formattedTableId}`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery:", error);
        throw new Error(`Failed to query BigQuery: ${error.message}`);
    }
}

// *** Dashboard Metrics
export async function queryBigQueryDashboardMetrics({ tableId, customerId, queryParams = {}, customQuery = null }) {
    console.log(`::: Querying BigQuery queryBigQueryDashboardMetrics for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("airbyte_", "airbyte_");
        const baseTableId = `${tableId}.${cleanCustomerId}`;

        let query = customQuery || `SELECT * FROM \`${baseTableId}.campaign\``;
        const params = {};
        let paramCounter = 1;

        if (!customQuery && queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        if (!customQuery) {
            query += ` LIMIT 1000000`;
        }

        const options = {
            query,
            params,
            location: "EU",
        };

        // console.log("::: Executing BigQuery query:", query);
        const [rows] = await bigQuery.query(options);

        console.log(`::: Fetched ${rows.length} rows from BigQuery`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery:", error);
        throw new Error(`Failed to query BigQuery: ${error.message}`);
    }
}

export async function queryBigQuerySEODashboardMetrics({ tableId, customerId, queryParams = {}, customQuery = null }) {
    console.log(`::: Querying BigQuery queryBigQuerySEODashboardMetrics for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("airbyte_", "airbyte_");
        const baseTableId = `${tableId}.airbyte_${cleanCustomerId}`;

        let query = customQuery || `SELECT * FROM \`${baseTableId}.search_analytics_all_fields\``;
        const params = {};
        let paramCounter = 1;

        if (!customQuery && queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        if (!customQuery) {
            query += ` LIMIT 1000000`;
        }

        const options = {
            query,
            params,
            location: "EU",
        };

        // console.log("::: Executing BigQuery query:", query);
        const [rows] = await bigQuery.query(options);

        console.log(`::: Fetched ${rows.length} rows from BigQuery`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery:", error);
        throw new Error(`Failed to query BigQuery: ${error.message}`);
    }
}

export async function queryBigQueryGoogleAdsDashboardMetrics({ tableId, customerId, queryParams = {}, customQuery = null }) {
    console.log(`::: Querying BigQuery queryBigQuerySEODashboardMetrics for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("airbyte_", "airbyte_");
        const baseTableId = `${tableId}.airbyte_${cleanCustomerId}`;

        let query = customQuery || `SELECT * FROM \`${baseTableId}.campaign\``;
        const params = {};
        let paramCounter = 1;

        if (!customQuery && queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        if (!customQuery) {
            query += ` LIMIT 1000000`;
        }

        const options = {
            query,
            params,
            location: "EU",
        };

        // console.log("::: Executing BigQuery query:", query);
        const [rows] = await bigQuery.query(options);

        console.log(`::: Fetched ${rows.length} rows from BigQuery`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery:", error);
        throw new Error(`Failed to query BigQuery: ${error.message}`);
    }
}

export async function queryBigQueryPaidSocialDashboardMetrics({ tableId, customerId, queryParams = {}, customQuery = null }) {
    console.log(`::: Querying BigQuery queryBigQuerySEODashboardMetrics for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("airbyte_", "airbyte_");
        const baseTableId = `${tableId}.airbyte_${cleanCustomerId}`;

        let query = customQuery || `SELECT * FROM \`${baseTableId}.ads_insights\``;
        const params = {};
        let paramCounter = 1;

        if (!customQuery && queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        if (!customQuery) {
            query += ` LIMIT 1000000`;
        }

        const options = {
            query,
            params,
            location: "EU",
        };

        // console.log("::: Executing BigQuery query:", query);
        const [rows] = await bigQuery.query(options);

        console.log(`::: Fetched ${rows.length} rows from BigQuery`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery:", error);
        throw new Error(`Failed to query BigQuery: ${error.message}`);
    }
}

export async function queryBigQueryEmailActiveCampaignMetrics({ tableId, customerId, queryParams = {}, customQuery = null }) {
    console.log(`::: Querying BigQuery queryBigQuerySEODashboardMetrics for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("airbyte_", "airbyte_");
        const baseTableId = `${tableId}.airbyte_${cleanCustomerId}`;

        let query = customQuery || `SELECT * FROM \`${baseTableId}.campaign\``;
        const params = {};
        let paramCounter = 1;

        if (!customQuery && queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        if (!customQuery) {
            query += ` LIMIT 1000000`;
        }

        const options = {
            query,
            params,
            location: "EU",
        };

        // console.log("::: Executing BigQuery query:", query);
        const [rows] = await bigQuery.query(options);

        console.log(`::: Fetched ${rows.length} rows from BigQuery`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery:", error);
        throw new Error(`Failed to query BigQuery: ${error.message}`);
    }
}

export async function queryBigQueryPNLMetrics({ tableId, customerId, queryParams = {}, customQuery = null }) {
    console.log(`::: Querying BigQuery queryBigQuerySEODashboardMetrics for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("airbyte_", "airbyte_");
        const baseTableId = `${tableId}.airbyte_${cleanCustomerId}`;

        let query = customQuery || `SELECT * FROM \`${baseTableId}.campaign\``;
        const params = {};
        let paramCounter = 1;

        if (!customQuery && queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        if (!customQuery) {
            query += ` LIMIT 1000000`;
        }

        const options = {
            query,
            params,
            location: "EU",
        };

        // console.log("::: Executing BigQuery query:", query);
        const [rows] = await bigQuery.query(options);

        console.log(`::: Fetched ${rows.length} rows from BigQuery`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery:", error);
        throw new Error(`Failed to query BigQuery: ${error.message}`);
    }
}

export async function queryBigQueryEmailKlaviyoMetrics({ tableId, customerId, queryParams = {}, customQuery = null }) {
    console.log(`::: Querying BigQuery Klaviyo metrics for customer: ${customerId} on table: ${tableId}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        const cleanCustomerId = customerId.replace("airbyte_", "airbyte_");
        const baseTableId = `${tableId}.airbyte_${cleanCustomerId}`;

        let query = customQuery || `SELECT * FROM \`${baseTableId}.klaviyo_campaigns\``;
        const params = {};
        let paramCounter = 1;

        if (!customQuery && queryParams && Object.keys(queryParams).length > 0) {
            query += " WHERE ";
            const conditions = [];
            for (const [key, value] of Object.entries(queryParams)) {
                conditions.push(`${key} = @param${paramCounter}`);
                params[`param${paramCounter}`] = value;
                paramCounter++;
            }
            query += conditions.join(" AND ");
        }

        if (!customQuery) {
            query += ` LIMIT 1000000`;
        }

        const options = {
            query,
            params,
            location: "EU",
        };

        const [rows] = await bigQuery.query(options);
        console.log(`::: Fetched ${rows.length} rows from BigQuery Klaviyo`);
        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery Klaviyo:", error);
        throw new Error(`Failed to query BigQuery Klaviyo: ${error.message}`);
    }
}

// *** Roll-up Dashboard Metrics for Parent Customers
export async function queryBigQueryRollUpMetrics({ childCustomers, startDate = null, endDate = null }) {
    console.log(`::: Querying BigQuery Roll-up metrics for ${childCustomers.length} child customers`);
    if (startDate && endDate) {
        console.log(`::: Date range filter: ${startDate} to ${endDate}`);
    }

    try {
        const bigQuery = getBigQueryClient();

        if (!childCustomers || childCustomers.length === 0) {
            throw new Error('No child customers provided');
        }

        // Build date filter clause
        const dateFilter = startDate && endDate 
            ? `AND COALESCE(s.date, f.date, g.date) BETWEEN '${startDate}' AND '${endDate}'`
            : '';

        // Build individual customer data queries and collect them for UNION
        const customerDataSelects = childCustomers.map((customer, index) => {
            const cleanCustomerId = customer.bigQueryCustomerId.replace("airbyte_", "airbyte_");
            const projectId = customer.bigQueryProjectId;

            // Build Facebook WHERE clause for each customer
            const buildFacebookWhereClause = (customerMetaID, customerMetaIDExclude) => {
                const conditions = [];
                
                if (customerMetaID?.trim()) {
                    conditions.push(`country = "${customerMetaID}"`);
                }
                
                if (customerMetaIDExclude?.trim()) {
                    const excludeList = customerMetaIDExclude
                        .split(',')
                        .map(c => `"${c.trim()}"`)
                        .filter(c => c !== '""')
                        .join(', ');
                    
                    if (excludeList) {
                        conditions.push(`country NOT IN (${excludeList})`);
                    }
                }
                
                return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
            };

            const facebookWhereClause = buildFacebookWhereClause(customer.customerMetaID, customer.customerMetaIDExclude);

            return `
                -- Customer ${index + 1}: ${customer.name}
                SELECT
                    '${customer._id}' AS customer_id,
                    '${customer.name}' AS customer_name,
                    COALESCE(s.date, f.date, g.date) AS date,
                    COALESCE(s.orders, 0) AS orders,
                    COALESCE(s.revenue, 0) AS revenue,
                    COALESCE(s.revenue * (1 - 0.25), 0) AS revenue_ex_tax,
                    COALESCE(f.ps_cost, 0) AS ps_cost,
                    COALESCE(g.ppc_cost, 0) AS ppc_cost,
                    COALESCE(f.ps_cost, 0) + COALESCE(g.ppc_cost, 0) AS total_ad_spend
                FROM (
                    SELECT
                        o.date,
                        o.order_count AS orders,
                        o.gross_sales AS gross_revenue,
                        o.gross_sales - COALESCE(r.total_refunds, 0) AS revenue,
                        o.currency AS presentment_currency
                    FROM (
                        SELECT
                            DATE(created_at) AS date,
                            SUM(CAST(total_price AS FLOAT64)) AS gross_sales,
                            COUNT(*) AS order_count,
                            presentment_currency AS currency
                        FROM \`${projectId}.${cleanCustomerId}.shopify_orders\`
                        WHERE presentment_currency = "${customer.customerValutaCode || 'DKK'}"
                        GROUP BY DATE(created_at), presentment_currency
                    ) o
                    LEFT JOIN (
                        SELECT
                            DATE(created_at) AS date,
                            SUM(
                                (SELECT SUM(CAST(JSON_EXTRACT_SCALAR(transaction, '$.amount') AS FLOAT64))
                                FROM UNNEST(JSON_EXTRACT_ARRAY(transactions)) AS transaction
                                WHERE JSON_EXTRACT_SCALAR(transaction, '$.kind') = 'refund'
                                )
                            ) AS total_refunds
                        FROM \`${projectId}.${cleanCustomerId}.shopify_order_refunds\`
                        GROUP BY DATE(created_at)
                    ) r ON o.date = r.date
                ) s
                FULL OUTER JOIN (
                    SELECT
                        date_start AS date,
                        SUM(spend) AS ps_cost
                    FROM \`${projectId}.${cleanCustomerId}.meta_ads_insights_demographics_country\`
                    ${facebookWhereClause}
                    GROUP BY date_start
                ) f ON s.date = f.date
                FULL OUTER JOIN (
                    SELECT
                        segments_date AS date,
                        SUM(metrics_cost_micros / 1000000.0) AS ppc_cost
                    FROM \`${projectId}.${cleanCustomerId}.google_ads_campaign\`
                    GROUP BY segments_date
                ) g ON COALESCE(s.date, f.date) = g.date
                WHERE COALESCE(s.date, f.date, g.date) IS NOT NULL ${dateFilter}
            `;
        });

        // Create the main query with proper UNION ALL syntax
        const mainQuery = `
            WITH all_customer_data AS (
                ${customerDataSelects.join(' UNION ALL ')}
            ),
            aggregated_totals AS (
                SELECT
                    SUM(orders) AS total_orders,
                    SUM(revenue) AS total_revenue,
                    SUM(revenue_ex_tax) AS total_revenue_ex_tax,
                    SUM(total_ad_spend) AS total_ad_spend,
                    CASE
                        WHEN SUM(total_ad_spend) > 0 THEN SUM(revenue) / SUM(total_ad_spend)
                        ELSE 0
                    END AS overall_roas,
                    CASE
                        WHEN SUM(orders) > 0 THEN SUM(revenue) / SUM(orders)
                        ELSE 0
                    END AS overall_aov
                FROM all_customer_data
            ),
            customer_totals AS (
                SELECT
                    customer_id,
                    customer_name,
                    SUM(orders) AS orders,
                    SUM(revenue) AS revenue,
                    SUM(revenue_ex_tax) AS revenue_ex_tax,
                    SUM(total_ad_spend) AS total_ad_spend,
                    CASE
                        WHEN SUM(total_ad_spend) > 0 THEN SUM(revenue) / SUM(total_ad_spend)
                        ELSE 0
                    END AS roas,
                    CASE
                        WHEN SUM(orders) > 0 THEN SUM(revenue) / SUM(orders)
                        ELSE 0
                    END AS aov
                FROM all_customer_data
                GROUP BY customer_id, customer_name
            )
            SELECT
                (SELECT AS STRUCT * FROM aggregated_totals) AS totals,
                ARRAY_AGG(STRUCT(
                    customer_id,
                    customer_name,
                    orders,
                    revenue,
                    revenue_ex_tax,
                    total_ad_spend,
                    roas,
                    aov
                )) AS customer_metrics
            FROM customer_totals
        `;

        const options = {
            query: mainQuery,
            location: "EU",
        };

        console.log("::: Executing Roll-up BigQuery query for multiple customers");
        const [rows] = await bigQuery.query(options);

        const result = rows[0] || { totals: {}, customer_metrics: [] };

        // Apply currency conversion to the results
        if (result.totals && Object.keys(result.totals).length > 0) {
            // Convert totals - we need to recalculate after individual conversions
            let convertedTotalRevenue = 0;
            let convertedTotalRevenueExTax = 0;
            let totalOrders = 0;
            let totalAdSpend = 0;

            // Convert individual customer metrics and recalculate totals
            if (result.customer_metrics && result.customer_metrics.length > 0) {
                result.customer_metrics = result.customer_metrics.map(customerMetric => {
                    // Find the customer to get their currency
                    const customer = childCustomers.find(c => c._id === customerMetric.customer_id);
                    const customerCurrency = customer?.customerValutaCode || 'DKK';

                    console.log(`::: Converting ${customer?.name} revenue from ${customerCurrency} to DKK`);

                    // Convert revenue values from customer's currency to DKK
                    const convertedRevenue = convertCurrency(customerMetric.revenue, customerCurrency, 'DKK');
                    const convertedRevenueExTax = convertCurrency(customerMetric.revenue_ex_tax, customerCurrency, 'DKK');

                    // Add to totals for recalculation
                    convertedTotalRevenue += convertedRevenue;
                    convertedTotalRevenueExTax += convertedRevenueExTax;
                    totalOrders += customerMetric.orders;
                    totalAdSpend += customerMetric.total_ad_spend;

                    return {
                        ...customerMetric,
                        revenue: convertedRevenue,
                        revenue_ex_tax: convertedRevenueExTax,
                        // Recalculate ROAS and AOV with converted values
                        roas: customerMetric.total_ad_spend > 0 ? convertedRevenue / customerMetric.total_ad_spend : 0,
                        aov: customerMetric.orders > 0 ? convertedRevenue / customerMetric.orders : 0
                    };
                });
            }

            // Update totals with converted values
            result.totals = {
                ...result.totals,
                total_revenue: convertedTotalRevenue,
                total_revenue_ex_tax: convertedTotalRevenueExTax,
                total_orders: totalOrders,
                total_ad_spend: totalAdSpend,
                overall_roas: totalAdSpend > 0 ? convertedTotalRevenue / totalAdSpend : 0,
                overall_aov: totalOrders > 0 ? convertedTotalRevenue / totalOrders : 0
            };

            console.log(`::: Applied currency conversion - Total revenue in DKK: ${convertedTotalRevenue}`);
        }

        console.log(`::: Fetched roll-up data for ${childCustomers.length} customers`);
        return result;
    } catch (error) {
        console.error("::: Error querying BigQuery roll-up metrics:", error);
        throw new Error(`Failed to query BigQuery roll-up metrics: ${error.message}`);
    }
}