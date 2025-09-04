"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useSession } from "next-auth/react";

export default function CustomerModal({ closeModal }) {
    const [search, setSearch] = useState("");
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: "",
        bigQueryCustomerId: "",
        bigQueryProjectId: "",
    });
    const [addingCustomer, setAddingCustomer] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const userEmail = session?.user?.email || "";
                const isAdmin = userEmail === "admin@example.com";

                const allCustomersResponse = await fetch("/api/customers");
                const allCustomers = await allCustomersResponse.json();

                if (isAdmin) {
                    setCustomers(allCustomers || []);
                    setFilteredCustomers(allCustomers || []);
                    return;
                }

                const sharingsResponse = await fetch(`/api/customer-sharings?email=${encodeURIComponent(userEmail)}`);
                const sharingsResult = await sharingsResponse.json();

                if (sharingsResult?.data?.length > 0) {
                    const customerIds = sharingsResult.data.map(sharing => sharing.customer);

                    const accessibleCustomers = allCustomers.filter(customer => {
                        const customerId = customer._id ? customer._id.toString() : customer._id;
                        return customerIds.some(id => id === customerId);
                    });

                    setCustomers(accessibleCustomers || []);
                    setFilteredCustomers(accessibleCustomers || []);
                } else {
                    console.log("No sharings found for this user");
                    setCustomers([]);
                    setFilteredCustomers([]);
                }
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setLoading(false);
            }
        }

        if (session) {
            fetchCustomers();
        }
    }, [session]);

    useEffect(() => {
        const filtered = customers.filter((customer) =>
            customer.name.toLowerCase().includes(search.toLowerCase())
        );
        console.log("Filtered customers:", filtered);
        setFilteredCustomers(filtered);
    }, [search, customers]);

    const handleAddCustomer = async () => {
        if (!newCustomer.name || !newCustomer.bigQueryCustomerId || !newCustomer.bigQueryProjectId) {
            alert("Please fill in all fields.");
            return;
        }

        setAddingCustomer(true);

        try {
            const response = await fetch("/api/customers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCustomer),
            });

            if (response.ok) {
                const result = await response.json();
                alert("Customer added successfully!");
                setCustomers((prev) => [...prev, result.customer]);
                setShowAddCustomerForm(false); 
                setNewCustomer({ name: "", bigQueryCustomerId: "", bigQueryProjectId: "" });
            } else {
                const errorData = await response.json();
                alert(`Failed to add customer: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error adding customer:", error);
            alert("An error occurred while adding the customer.");
        } finally {
            setAddingCustomer(false);
        }
    };

    return (
        <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-100">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <span className="flex justify-between mb-5">
                    <h4 className="text-xl font-semibold">Select a customer</h4>
                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-lg">
                        <IoMdClose className="text-2xl" />
                    </button>
                </span>
                {showAddCustomerForm ? (
                    <div>
                        <input
                            type="text"
                            placeholder="Customer Name"
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
                        />
                        <input
                            type="text"
                            placeholder="BigQuery Customer ID"
                            value={newCustomer.bigQueryCustomerId}
                            onChange={(e) => setNewCustomer({ ...newCustomer, bigQueryCustomerId: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-2"
                        />
                        <input
                            type="text"
                            placeholder="BigQuery Project ID"
                            value={newCustomer.bigQueryProjectId}
                            onChange={(e) => setNewCustomer({ ...newCustomer, bigQueryProjectId: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
                        />
                        <button
                            onClick={handleAddCustomer}
                            disabled={addingCustomer}
                            className={`mt-5 w-full text-center bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm ${addingCustomer ? "opacity-50 cursor-not-allowed" : "hover:bg-zinc-800"
                                }`}
                        >
                            {addingCustomer ? "Adding..." : "Add Customer"}
                        </button>

                        <button
                            onClick={() => setShowAddCustomerForm(false)}
                            className="mt-2 text-zinc-700 w-full text-center border border-zinc-700 py-2 px-4 rounded text-white gap-2 hover:cursor-pointer text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div>
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
                                    <div className="animate-spin rounded h-8 w-8 border-t-2 border-b-2 border-gray-500"></div>
                                </li>
                            ) : filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <li
                                        key={customer._id}
                                        className="cursor-pointer px-2 py-2 mt-1 text-sm border-gray-300 text-base hover:bg-gray-100 text-black"
                                        onClick={() => {
                                            closeModal();
                                            router.push(`/dashboard/${customer._id}`);
                                        }}
                                    >
                                        {customer.name}
                                    </li>
                                ))
                            ) : (
                                <li className="text-gray-400 px-4 py-2">
                                    No customers found
                                    <pre>{JSON.stringify(filteredCustomers, null, 2)}</pre>
                                </li>
                            )}
                        </ul>
                        <button
                            onClick={() => setShowAddCustomerForm(true)}
                            className="mt-5 w-full text-center bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm"
                        >
                            Add New Customer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}