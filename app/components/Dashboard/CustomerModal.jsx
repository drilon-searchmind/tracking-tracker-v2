"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useSession } from "next-auth/react";
import currencyData from '@/lib/static-data/commonCurrency.json';
import Select from "react-select";

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
        metricPreference: "ROAS/POAS",
        customerValuta: "DKK",
        customerValutaCode: "DKK",
        customerClickupID: "",
    });
    const [addingCustomer, setAddingCustomer] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const currencyOptions = Object.entries(currencyData)
        .map(([code, data]) => ({
            value: data.symbol_native,
            label: `${code} - ${data.name} (${data.symbol_native})`,
            code: code
        }))
        .sort((a, b) => a.code.localeCompare(b.code));

    const frequentCurrencies = [
        { value: "kr", label: "DKK - Danish Krone (kr)", code: "DKK" },
        { value: "€", label: "EUR - Euro (€)", code: "EUR" },
        { value: "$", label: "USD - US Dollar ($)", code: "USD" },
        { value: "£", label: "GBP - British Pound Sterling (£)", code: "GBP" },
        { value: "kr", label: "SEK - Swedish Krona (kr)", code: "SEK" },
        { value: "kr", label: "NOK - Norwegian Krone (kr)", code: "NOK" },
        { value: "", label: "───────────────" },
    ];

    const allCurrencyOptions = [...frequentCurrencies, ...currencyOptions];
    const selectedCurrencyOption = allCurrencyOptions.find(option =>
        option.value === newCustomer?.customerValuta
    ) || null;

    const handleCurrencyChange = (selectedOption) => {
        if (!selectedOption) {
            setNewCustomer({
                ...newCustomer,
                customerValuta: 'kr',
                customerValutaCode: 'DKK'
            });
            return;
        }

        setNewCustomer({
            ...newCustomer,
            customerValuta: selectedOption ? selectedOption.value : 'kr',
            customerValutaCode: selectedOption.code
        });
    };

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const userEmail = session?.user?.email || "";
                const isAdmin = session?.user?.isAdmin || false

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
        if (!newCustomer.name ||
            !newCustomer.bigQueryCustomerId ||
            !newCustomer.bigQueryProjectId ||
            !newCustomer.metricPreference ||
            !newCustomer.customerValuta ||
            !newCustomer.customerClickupID) {
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
                setNewCustomer({
                    name: "",
                    bigQueryCustomerId: "",
                    bigQueryProjectId: "",
                    metricPreference: "ROAS/POAS",
                    customerValuta: "DKK",
                    customerClickupID: ""
                });
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
            <div className="bg-white rounded-xl shadow-solid-l p-8 w-full max-w-md relative border border-gray-200">
                <span className="flex justify-between mb-6">
                    <h4 className="text-xl font-bold text-[var(--color-dark-green)]">Select a customer</h4>
                    <button onClick={closeModal} className="text-[var(--color-green)] hover:text-[var(--color-dark-green)] text-lg transition-colors">
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="BigQuery Customer ID"
                            value={newCustomer.bigQueryCustomerId}
                            onChange={(e) => setNewCustomer({ ...newCustomer, bigQueryCustomerId: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="BigQuery Project ID"
                            value={newCustomer.bigQueryProjectId}
                            onChange={(e) => setNewCustomer({ ...newCustomer, bigQueryProjectId: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                        />
                        <div className="mb-3">
                            <select
                                value={newCustomer.metricPreference}
                                onChange={(e) => setNewCustomer({ ...newCustomer, metricPreference: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                            >
                                <option value="ROAS/POAS">ROAS/POAS</option>
                                <option value="Spendshare">Spendshare</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <Select
                                value={selectedCurrencyOption}
                                onChange={handleCurrencyChange}
                                options={allCurrencyOptions}
                                className="w-full"
                                placeholder="Select currency..."
                                isClearable
                                styles={{
                                    control: (provided, state) => ({
                                        ...provided,
                                        padding: '4px',
                                        borderRadius: '8px',
                                        borderColor: state.isFocused ? 'var(--color-lime)' : '#d1d5db',
                                        boxShadow: 'none',
                                        '&:hover': {
                                            borderColor: 'var(--color-lime)'
                                        }
                                    })
                                }}
                            />
                        </div>

                        <input
                            type="text"
                            placeholder="Customer ClickUp ID"
                            value={newCustomer.customerClickupID}
                            onChange={(e) => setNewCustomer({ ...newCustomer, customerClickupID: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-6 focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                        />
                        <button
                            onClick={handleAddCustomer}
                            disabled={addingCustomer}
                            className={`w-full bg-[var(--color-dark-green)] text-white py-3 px-6 rounded-lg font-semibold transition-colors ${addingCustomer ? "opacity-50 cursor-not-allowed" : "hover:bg-[var(--color-green)]"
                                }`}
                        >
                            {addingCustomer ? "Adding..." : "Add Customer"}
                        </button>

                        <button
                            onClick={() => setShowAddCustomerForm(false)}
                            className="mt-3 w-full border-2 border-[var(--color-dark-green)] text-[var(--color-dark-green)] py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-natural)] transition-colors"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                        />
                        <ul className="max-h-60 overflow-y-auto mb-6">
                            {loading ? (
                                <li className="flex justify-center py-4">
                                    <div className="animate-spin rounded h-8 w-8 border-t-2 border-b-2 border-[var(--color-lime)]"></div>
                                </li>
                            ) : filteredCustomers.length > 0 ? (
                                filteredCustomers.map((customer) => (
                                    <li
                                        key={customer._id}
                                        className="cursor-pointer px-4 py-3 mt-2 text-sm rounded-lg hover:bg-[var(--color-natural)] text-[var(--color-dark-green)] border border-gray-100 transition-colors"
                                        onClick={() => {
                                            closeModal();
                                            router.push(`/dashboard/${customer._id}`);
                                        }}
                                    >
                                        {customer.name}
                                    </li>
                                ))
                            ) : (
                                <li className="text-[var(--color-green)] px-4 py-3 text-center">
                                    No customers found
                                </li>
                            )}
                        </ul>
                        <button
                            onClick={() => setShowAddCustomerForm(true)}
                            className="w-full bg-[var(--color-dark-green)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--color-green)] transition-colors"
                        >
                            Add New Customer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}