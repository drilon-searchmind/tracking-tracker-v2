"use client";

export default function ConfigTable({ revenueBudget, customerId, baseUrl }) {
    async function handleDelete(configId) {
        console.log("Attempting to delete config with ID:", configId);
        console.log("Customer ID:", customerId);
        
        const confirmed = confirm("Are you sure you want to delete this configuration?");
        if (!confirmed) return;

        try {
            // Use relative URL for API calls
            const apiUrl = `/api/config-revenue-budget/${customerId}`;
            console.log("Making DELETE request to:", apiUrl);
            
            const response = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ configId }),
            });

            console.log("Delete response status:", response.status);

            if (response.ok) {
                console.log("Configuration deleted successfully!");
                window.location.reload();
            } else {
                const errorText = await response.text();
                console.error("Failed to delete configuration:", errorText);
                alert("Failed to delete configuration.");
            }
        } catch (error) {
            console.error("Error deleting configuration:", error);
            alert("An error occurred while deleting the configuration.");
        }
    }

    console.log("ConfigTable - revenueBudget data:", revenueBudget);

    if (!revenueBudget?.configs?.length) {
        return (
            <div className="bg-white border border-[var(--color-light-natural)] rounded-lg p-6 text-center">
                <p className="text-[var(--color-green)] text-sm">No objectives configured yet. Add your first revenue objective using the form.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-[var(--color-light-natural)] rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-[var(--color-natural)] border-b border-[var(--color-light-natural)]">
                        <tr className="text-[var(--color-dark-green)]">
                            <th className="px-4 py-3 text-left">
                                <input type="checkbox" className="rounded border-[var(--color-dark-natural)] text-[var(--color-lime)] focus:ring-[var(--color-lime)]" />
                            </th>
                            <th className="px-4 py-3 text-left font-medium">Period</th>
                            <th className="px-4 py-3 text-left font-medium">Revenue Target</th>
                            <th className="px-4 py-3 text-left font-medium">Marketing Budget</th>
                            <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-[var(--color-dark-green)] divide-y divide-[var(--color-light-natural)]">
                        {revenueBudget.configs.map((row, i) => (
                            <tr key={row._id} className="hover:bg-[var(--color-natural)] transition-colors">
                                <td className="px-4 py-3">
                                    <input type="checkbox" className="rounded border-[var(--color-dark-natural)] text-[var(--color-lime)] focus:ring-[var(--color-lime)]" />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-[var(--color-dark-green)]">{row.month}</span>
                                        <span className="text-xs text-[var(--color-green)]">{row.year}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-medium">kr {parseInt(row.revenue).toLocaleString('en-US')}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-medium">kr {parseInt(row.budget).toLocaleString('en-US')}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => handleDelete(row._id)}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded px-2 py-1"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}