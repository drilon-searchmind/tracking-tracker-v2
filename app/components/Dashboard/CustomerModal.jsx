"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";

export default function CustomerModal({ closeModal }) {
    const [search, setSearch] = useState("");
    const router = useRouter();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectCustomer = (customerId) => {
        closeModal();
        router.push(`/dashboard/${customerId}`);
    };

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const response = await fetch("/api/customers");
                if (!response.ok) {
                    throw new Error("::: Failed to fetch customers");
                }

                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                console.error("::: Error fetching customers:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCustomers();
    }, []);

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
                    {loading ? (
                        <li className="flex justify-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
                        </li>
                    ) : filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                            <li
                                key={customer._id}
                                onClick={() => handleSelectCustomer(customer._id)}
                                className="cursor-pointer px-4 py-2 hover:bg-gray-100 rounded"
                            >
                                {customer.name}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-400 px-4 py-2">No customers found</li>
                    )}
                </ul>
            </div>
        </div>
    );
}