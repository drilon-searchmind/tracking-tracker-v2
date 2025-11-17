import { queryBigQueryRollUpMetrics } from "../../../lib/bigQueryConnect";
import currencyExchangeData from "../../../lib/static-data/currencyApiValues.json";
import { dbConnect } from "@/lib/dbConnect";
import CustomerSettings from "../../../models/CustomerSettings";

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

// Apply currency conversion to a data row
const convertDataRow = (row, fromCurrency, shouldConvertCurrency) => {
    if (fromCurrency === "DKK" || !shouldConvertCurrency) return row;
    
    const revenueFields = ['revenue', 'revenue_ex_tax'];
    const convertedRow = { ...row };
    
    revenueFields.forEach(field => {
        if (convertedRow[field] !== undefined && convertedRow[field] !== null) {
            convertedRow[field] = convertCurrency(convertedRow[field], fromCurrency);
        }
    });
    
    return convertedRow;
};

export async function POST(req) {
    try {
        const { childCustomers, startDate, endDate } = await req.json();

        if (!childCustomers || childCustomers.length === 0) {
            return new Response(JSON.stringify({ error: "No child customers provided" }), { status: 400 });
        }

        if (!startDate || !endDate) {
            return new Response(JSON.stringify({ error: "Both startDate and endDate must be provided" }), { status: 400 });
        }

        // Connect to database
        await dbConnect();
        
        // Create a map of customer ID to currency code and changeCurrency setting
        const customerSettingsMap = {};
        for (const customer of childCustomers) {
            try {
                const customerSettings = await CustomerSettings.findOne({ 
                    customer: customer._id 
                });
                customerSettingsMap[customer._id] = {
                    currencyCode: customerSettings?.customerValutaCode || "DKK",
                    changeCurrency: customerSettings?.changeCurrency ?? true
                };
            } catch (error) {
                console.warn(`Could not fetch settings for customer ${customer._id}:`, error);
                customerSettingsMap[customer._id] = {
                    currencyCode: "DKK",
                    changeCurrency: true
                };
            }
        }

        const rollUpMetrics = await queryBigQueryRollUpMetrics({ childCustomers, startDate, endDate, customerSettingsMap });

        // Aggregate the daily data by customer with currency conversion
        const customerAggregations = {};
        
        rollUpMetrics.forEach(row => {
            const customerId = row.customer_id;
            const customerSettings = customerSettingsMap[customerId] || { currencyCode: "DKK", changeCurrency: true };
            
            // Convert the row data if needed
            const convertedRow = convertDataRow(row, customerSettings.currencyCode, customerSettings.changeCurrency);
            
            if (!customerAggregations[customerId]) {
                customerAggregations[customerId] = {
                    customer_id: customerId,
                    customer_name: row.customer_name,
                    revenue: 0,
                    revenue_ex_tax: 0,
                    orders: 0,
                    total_ad_spend: 0,
                    ps_cost: 0,
                    ppc_cost: 0,
                    days_with_data: 0
                };
            }
            
            // Aggregate the metrics using converted values
            customerAggregations[customerId].revenue += parseFloat(convertedRow.revenue) || 0;
            customerAggregations[customerId].revenue_ex_tax += parseFloat(convertedRow.revenue_ex_tax) || 0;
            customerAggregations[customerId].orders += parseInt(convertedRow.orders) || 0;
            customerAggregations[customerId].ps_cost += parseFloat(convertedRow.ps_cost) || 0;
            customerAggregations[customerId].ppc_cost += parseFloat(convertedRow.ppc_cost) || 0;
            customerAggregations[customerId].total_ad_spend += parseFloat(convertedRow.total_ad_spend) || 0;
            
            // Count days with data (for potential averaging)
            if (convertedRow.revenue > 0 || convertedRow.orders > 0 || convertedRow.total_ad_spend > 0) {
                customerAggregations[customerId].days_with_data++;
            }
        });

        // Calculate derived metrics (ROAS, AOV)
        const aggregatedMetrics = Object.values(customerAggregations).map(customer => {
            const roas = customer.total_ad_spend > 0 ? customer.revenue / customer.total_ad_spend : 0;
            const aov = customer.orders > 0 ? customer.revenue / customer.orders : 0;
            
            return {
                ...customer,
                roas: roas,
                aov: aov
            };
        });

        return new Response(JSON.stringify({ customer_metrics: aggregatedMetrics }), { status: 200 });
    } catch (error) {
        console.error("Error fetching roll-up metrics:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch roll-up metrics" }), { status: 500 });
    }
}