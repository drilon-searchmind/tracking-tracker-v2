"use client";

export default function ConfigForm({ customerId, baseUrl }) {
    async function handleSubmitConfigRevenue(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const newConfig = {
            month: formData.get("month"),
            year: formData.get("year"),
            revenue: formData.get("revenue"),
            budget: formData.get("budget"),
        };

        const response = await fetch(`${baseUrl}/api/config-revenue-budget/${customerId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newConfig),
        });

        if (response.ok) {
            window.location.reload();
        } else {
            console.log("::: Failed to add configuration.");
        }
    }

    return (
        <>
            <h3 className="font-semibold text-lg mb-2 text-zinc-800">Add New Objective</h3>
            <div className="mt-0 shadow-solid-l bg-white rounded-md px-10 py-10 border border-zinc-200 z-10">
                <form onSubmit={handleSubmitConfigRevenue} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        name="month"
                        placeholder="Month"
                        required
                        className="col-span-2 border border-gray-300 rounded px-4 py-2 text-sm"
                    />
                    <input
                        type="number"
                        name="year"
                        placeholder="Year"
                        required
                        className="col-span-2 border border-gray-300 rounded px-4 py-2 text-sm"
                    />
                    <input
                        type="number"
                        name="revenue"
                        placeholder="Revenue"
                        required
                        className="col-span-4 border border-gray-300 rounded px-4 py-2 text-sm"
                    />
                    <input
                        type="number"
                        name="budget"
                        placeholder="Budget"
                        required
                        className="col-span-4 border border-gray-300 rounded px-4 py-2 text-sm"
                    />
                    <button
                        type="submit"
                        className="col-span-4 w-full text-center bg-zinc-700 py-2 px-4 rounded-full text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm"
                    >
                        Add New Objective
                    </button>
                </form>
            </div>
        </>
    );
}