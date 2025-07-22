import { BigQuery } from '@google-cloud/bigquery';

let bigQueryClient = null;

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
            location: "EU", // Adjust based on your dataset location
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

        // Validate inputs
        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        // Construct table IDs for multi-tenancy
        const cleanCustomerId = customerId.replace("airbyte_", "");
        const baseTableId = `${tableId}.airbyte_${cleanCustomerId}`;

        // Use custom query if provided, otherwise build a default query
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

        // Validate inputs
        if (!tableId || !customerId) {
            throw new Error(`Invalid tableId (${tableId}) or customerId (${customerId})`);
        }

        // Construct table IDs for multi-tenancy
        const cleanCustomerId = customerId.replace("airbyte_", "");
        const baseTableId = `${tableId}.airbyte_${cleanCustomerId}`;

        // Use custom query if provided, otherwise build a default query
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

        const cleanCustomerId = customerId.replace("airbyte_", "");
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

        const cleanCustomerId = customerId.replace("airbyte_", "");
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