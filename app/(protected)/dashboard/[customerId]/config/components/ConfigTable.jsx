"use client";

export default function ConfigTable({ revenueBudget, customerId, baseUrl }) {
    async function handleDelete(configId) {
        const confirmed = confirm("Are you sure you want to delete this configuration?");
        if (!confirmed) return;

        const response = await fetch(`${baseUrl}/api/config-revenue-budget/${customerId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ configId }),
        });

        if (response.ok) {
            console.log("Configuration deleted successfully!");
            window.location.reload();
        } else {
            console.log("Failed to delete configuration.");
        }
    }

    return (
        <div className="overflow-auto border border-zinc-200 rounded bg-white">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                    <tr className="text-zinc-600">
                        <th className="px-4 py-3">
                            <input type="checkbox" />
                        </th>
                        <th className="px-4 py-3 font-medium">Objective ↓</th>
                        <th className="px-4 py-3 font-medium">Revenue</th>
                        <th className="px-4 py-3 font-medium">Budget</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-zinc-700">
                    {revenueBudget?.configs?.map((row, i) => (
                        <tr key={row._id} className="border-b border-zinc-100">
                            <td className="px-4 py-3">
                                <input type="checkbox" />
                            </td>
                            <td className="px-4 py-3">
                                <span className="block font-medium">{row.month}</span>
                                <span className="text-xs text-zinc-400">{row.year}</span>
                            </td>
                            <td className="px-4 py-3">{row.revenue}</td>
                            <td className="px-4 py-3">{row.budget}</td>
                            <td className="px-4 py-3">
                                <button
                                    onClick={() => handleDelete(row._id)}
                                    className="text-red-700 hover:text-red-800 text-xs"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}