export async function fetchCustomerDetails(customerId) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
            ? process.env.NEXT_PUBLIC_BASE_URL
            : process.env.NODE_ENV === "development"
                ? "http://localhost:3000"
                : "http://localhost:3000";

        console.log("::: Using base URL:", baseUrl);
        console.log("::: Fetching customer details for ID:", customerId);

        const response = await fetch(`${baseUrl}/api/customers/${customerId}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`::: API Error: ${response.status} ${response.statusText}`, errorText);
            throw new Error(`::: Failed to fetch customer details: ${response.status} ${response.statusText}`);
        }

        const data = await response.json()
        console.log("::: Customer details fetched successfully:", data);

        return {
            bigQueryCustomerId: data.bigQueryCustomerId,
            bigQueryProjectId: data.bigQueryProjectId,
            customerName: data.name,
        }
    } catch (error) {
        console.error("::: Error fetching customer details:", error);
        throw new Error("::: Failed to fetch customer details");
    }
}