"use client"

export default function CustomerDashboard({ params }) {
    const { customerId } = params;

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>
            <p className="text-lg">You are viewing the dashboard for customer: {customerId}</p>
        </div>
    );
}