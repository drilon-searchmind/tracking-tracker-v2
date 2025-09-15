import React from 'react'

const CustomersContent = () => (
    <div>
        <h2 className="text-2xl font-semibold mb-6">Customer Management</h2>
        <div className="mb-6 flex justify-between items-center">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search customers..."
                    className="w-64 px-4 py-2 border border-gray-300 rounded text-sm"
                />
            </div>
            <button className="text-center bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm">
                Add New Customer
            </button>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                    <tr className="text-zinc-600">
                        <th className="px-4 py-3 font-medium">Customer Name</th>
                        <th className="px-4 py-3 font-medium">BigQuery ID</th>
                        <th className="px-4 py-3 font-medium">Project ID</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-zinc-700 divide-y divide-zinc-100">
                    <tr>
                        <td className="px-4 py-3">Acme Corporation</td>
                        <td className="px-4 py-3">acme-123</td>
                        <td className="px-4 py-3">project-acme</td>
                        <td className="px-4 py-3 space-x-2">
                            <button className="text-zinc-600 hover:text-zinc-900 text-sm">Edit</button>
                            <button className="text-zinc-600 hover:text-zinc-900 text-sm">View</button>
                            <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
);

export default CustomersContent