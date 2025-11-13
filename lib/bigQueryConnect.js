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
export async function queryBigQueryRollUpMetrics({ childCustomers, startDate, endDate }) {
    console.log(`::: Querying BigQuery Roll-up metrics for ${childCustomers.length} child customers`);
    console.log(`::: startDate: ${startDate}, endDate: ${endDate}`);

    // Validate startDate and endDate
    if (!startDate || !endDate) {
        throw new Error("Both startDate and endDate must be provided.");
    }

    console.log(`::: Date range filter: ${startDate} to ${endDate}`);

    try {
        const bigQuery = getBigQueryClient();

        if (!childCustomers || childCustomers.length === 0) {
            throw new Error('No child customers provided');
        }

        // Build date filter clause
        const dateFilter = `AND COALESCE(s.date, f.date, g.date) BETWEEN '${startDate}' AND '${endDate}'`;

        // Build individual customer data queries and collect them for UNION
        const customerDataSelects = childCustomers.map((customer, index) => {
            const cleanCustomerId = customer.bigQueryCustomerId.replace("airbyte_", "airbyte_");
            const projectId = customer.bigQueryProjectId;

            console.log(`::: Building query segment for customer: ${customer.name} (ID: ${customer._id})`);
            console.log(`::: dateFilter applied: ${dateFilter}`);

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
                    WITH date_range AS (
                        SELECT
                            DATE('${startDate}') + INTERVAL n DAY AS date
                        FROM
                            UNNEST(GENERATE_ARRAY(0, DATE_DIFF('${endDate}', '${startDate}', DAY))) AS n
                    ),
                    orders AS (
                        SELECT
                            DATE(created_at) AS date,
                            SUM(CAST(total_price AS FLOAT64)) AS gross_sales,
                            COUNT(*) AS order_count,
                            presentment_currency AS currency
                        FROM \`${projectId}.${cleanCustomerId}.shopify_orders\`
                        WHERE presentment_currency = "${customer.customerValutaCode || 'DKK'}"
                        GROUP BY DATE(created_at), presentment_currency
                    ),
                    refunds AS (
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
                    )
                    SELECT
                        d.date,
                        COALESCE(o.order_count, 0) AS orders,
                        COALESCE(o.gross_sales, 0) AS gross_revenue,
                        COALESCE(o.gross_sales, 0) - COALESCE(r.total_refunds, 0) AS revenue,
                        COALESCE(o.currency, 'N/A') AS presentment_currency
                    FROM
                        date_range d
                    LEFT JOIN
                        orders o
                    ON
                        d.date = o.date
                    LEFT JOIN
                        refunds r
                    ON
                        d.date = r.date
                ) s
                FULL OUTER JOIN (
                    SELECT
                        date_start AS date,
                        SUM(spend) AS ps_cost
                    FROM \`${projectId}.${cleanCustomerId}.meta_ads_insights_demographics_country\`
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
            )
            SELECT * FROM all_customer_data
        `;

        const options = {
            query: mainQuery,
            location: "EU",
        };

        console.log("::: Executing Roll-up BigQuery query for multiple customers");
        const [rows] = await bigQuery.query(options);

        return rows;
    } catch (error) {
        console.error("::: Error querying BigQuery roll-up metrics:", error);
        throw new Error(`Failed to query BigQuery roll-up metrics: ${error.message}`);
    }
}