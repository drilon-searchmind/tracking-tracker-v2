"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

const mockCustomers = [
    { id: "customer-1", name: "Humdakin DK" },
    // { id: "customer-2", name: "Pompdeulx DE" },
    // { id: "customer-3", name: "Soylent Ltd." },
    // { id: "customer-4", name: "Initech" },
    // { id: "customer-5", name: "Umbrella Corp." }
];

export default function CustomerModal({ closeModal }) {
    const [search, setSearch] = useState("");
    const router = useRouter();

    const filteredCustomers = mockCustomers.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectCustomer = (customerId) => {
        closeModal();
        router.push(`/dashboard/${customerId}`);
    }

    return (
        <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-100">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <span className="flex justify-between mb-5">
                    <h4 className="text-xl font-semibold">Select a Customer</h4>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-lg">
                        <IoMdClose className="text-2xl" />
                    </button>
                </span>
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                />
                <ul className="max-h-60 overflow-y-auto">
                    {filteredCustomers.map((customer) => (
                        <li
                            key={customer.id}
                            onClick={() => handleSelectCustomer(customer.id)}
                            className="cursor-pointer px-4 py-2 hover:bg-gray-100 rounded"
                        >
                            {customer.name}
                        </li>
                    ))}
                    {filteredCustomers.length === 0 && (
                        <li className="text-gray-400 px-4 py-2">No customers found</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
