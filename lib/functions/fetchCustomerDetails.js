export async function fetchCustomerDetails(customerId) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
            ? process.env.NEXT_PUBLIC_BASE_URL
            : process.env.NODE_ENV === "development"
                ? "http://192.168.1.253:3000"
                : "http://localhost:3000";
        const response = await fetch(`${baseUrl}/api/customers/${customerId}`);

        if (!response.ok) {
            throw new Error("::: Failed to fetch customer details");
        }

        const data = await response.json()
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