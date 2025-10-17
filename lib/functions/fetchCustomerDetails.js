export async function fetchCustomerDetails(customerId) {
    try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");

    const apiUrl = baseUrl ? `${baseUrl}/api/customers/${customerId}` : `/api/customers/${customerId}`;

    console.log("::: Using base URL:", baseUrl || '<relative>');
    console.log("::: Fetching customer details for ID:", customerId, "from", apiUrl);

    const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`::: API Error: ${response.status} ${response.statusText}`, errorText);
            throw new Error(`::: Failed to fetch customer details: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("::: Customer details fetched successfully:", data);

        return {
            bigQueryCustomerId: data.bigQueryCustomerId,
            bigQueryProjectId: data.bigQueryProjectId,
            customerName: data.name,
            customerValutaCode: data.customerValutaCode || "DKK",
            customerMetaID: data.customerMetaID || "",
            customerMetaIDExclude: data.customerMetaIDExclude || ""
        };
    } catch (error) {
        console.error("::: Error fetching customer details:", error);
        throw new Error("::: Failed to fetch customer details");
    }
}