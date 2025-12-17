export async function fetchCustomerDetails(customerId) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

        const customerApiUrl = baseUrl ? `${baseUrl}/api/customers/${customerId}` : `/api/customers/${customerId}`;
        const settingsApiUrl = baseUrl ? `${baseUrl}/api/customer-settings/${customerId}` : `/api/customer-settings/${customerId}`;

        console.log("::: Using base URL:", baseUrl || '<relative>');
        console.log("::: Fetching customer details for ID:", customerId);

        // Fetch both customer and customer settings in parallel
        const [customerResponse, settingsResponse] = await Promise.all([
            fetch(customerApiUrl),
            fetch(settingsApiUrl)
        ]);

        if (!customerResponse.ok) {
            const errorText = await customerResponse.text();
            console.error(`::: API Error: ${customerResponse.status} ${customerResponse.statusText}`, errorText);
            throw new Error(`::: Failed to fetch customer details: ${customerResponse.status} ${customerResponse.statusText}`);
        }

        const customerData = await customerResponse.json();
        
        // Settings might not exist yet, so handle gracefully
        let settingsData = {};
        if (settingsResponse.ok) {
            settingsData = await settingsResponse.json();
        } else {
            console.warn("::: Customer settings not found, using defaults");
        }

        console.log("::: Customer details fetched successfully");

        return {
            bigQueryCustomerId: customerData.bigQueryCustomerId,
            bigQueryProjectId: customerData.bigQueryProjectId,
            customerName: customerData.name,
            customerValutaCode: settingsData.customerValutaCode || "DKK",
            customerMetaID: settingsData.customerMetaID || "",
            customerMetaIDExclude: settingsData.customerMetaIDExclude || "",
            customerType: customerData.customerType || "Shopify",
            shopifyUrl: settingsData.shopifyUrl || "",
            shopifyApiPassword: settingsData.shopifyApiPassword || "",
            facebookAdAccountId: settingsData.facebookAdAccountId || "",
            googleAdsCustomerId: settingsData.googleAdsCustomerId || "",
        };
    } catch (error) {
        console.error("::: Error fetching customer details:", error);
        throw new Error("::: Failed to fetch customer details");
    }
}