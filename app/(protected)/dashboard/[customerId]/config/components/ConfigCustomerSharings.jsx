"use client"

import { useState, useEffect } from "react";

export default function ConfigCustomerSharings({ customerId, baseUrl }) {
    // Mock data for sharings
    const sharingsData = [
        { id: 1, sharedWith: "User A", email: "test@email.dk" },
        { id: 2, sharedWith: "User B", email: "testuser@email.dk" }, 
    ]

    return (
        <div className="overflow-auto border border-zinc-200 rounded bg-white shadow-solid-l">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-zinc-200 text-left">
                    <tr className="text-zinc-600">
                        <th className="px-4 py-3 font-medium">Shared With</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sharingsData.map((sharing) => (
                        <tr key={sharing.id} className="border-b border-zinc-200">
                            <td className="px-4 py-3">{sharing.sharedWith}</td>
                            <td className="px-4 py-3">{sharing.email}</td>
                            <td className="px-4 py-3"><button class="text-red-700 hover:text-red-800 text-xs">Remove</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}