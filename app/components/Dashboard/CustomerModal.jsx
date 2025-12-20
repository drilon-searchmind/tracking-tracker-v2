"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoMdClose } from "react-icons/io";
import { useSession } from "next-auth/react";
import currencyData from '@/lib/static-data/commonCurrency.json';
import Select from "react-select";
import { FaShopify, FaWordpress, FaQuestionCircle } from "react-icons/fa";

export default function CustomerModal({ closeModal }) {
    const [search, setSearch] = useState("");
    const [customers, setCustomers] = useState([]);
    const [parentCustomers, setParentCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [filteredParentCustomers, setFilteredParentCustomers] = useState([]);
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

    const getCustomerIcon = (customerType) => {
        switch (customerType) {
            case "Shopify":
                return <FaShopify className="text-[var(--color-green)] mr-2" />;
            case "WooCommerce":
                return <FaWordpress className="text-[var(--color-green)] mr-2" />;
            default:
                return <FaQuestionCircle className="text-[var(--color-green)] mr-2" />;
        }
    };

    useEffect(() => {
        async function fetchCustomers() {
            try {
                const userEmail = session?.user?.email || "";
                const isAdmin = session?.user?.isAdmin || false
                const isExternal = session?.user?.isExternal || false

                // Fetch all customers with parent customer data
                const allCustomersResponse = await fetch("/api/customers");
                const allCustomers = await allCustomersResponse.json();

                // Fetch all parent customers
                const parentCustomersResponse = await fetch("/api/parent-customers");
                const allParentCustomers = await parentCustomersResponse.json();

                // Filter out archived customers
                const activeCustomers = allCustomers.filter(customer => !customer.isArchived);

                if (isAdmin || !isExternal) {
                    setCustomers(activeCustomers || []);
                    setParentCustomers(allParentCustomers || []);
                    setFilteredCustomers(activeCustomers || []);
                    setFilteredParentCustomers(allParentCustomers || []);
                    return;
                }

                const sharingsResponse = await fetch(`/api/customer-sharings?email=${encodeURIComponent(userEmail)}`);
                const sharingsResult = await sharingsResponse.json();

                if (sharingsResult?.data?.length > 0) {
                    const customerIds = sharingsResult.data.map(sharing => sharing.customer);

                    const accessibleCustomers = activeCustomers.filter(customer => {
                        const customerId = customer._id ? customer._id.toString() : customer._id;
                        return customerIds.some(id => id === customerId);
                    });

                    // Filter parent customers that have accessible child customers
                    const accessibleParentIds = new Set();
                    accessibleCustomers.forEach(customer => {
                        if (customer.parentCustomer) {
                            accessibleParentIds.add(customer.parentCustomer._id || customer.parentCustomer);
                        }
                    });

                    const accessibleParentCustomers = allParentCustomers.filter(parent =>
                        accessibleParentIds.has(parent._id)
                    );

                    setCustomers(accessibleCustomers || []);
                    setParentCustomers(accessibleParentCustomers || []);
                    setFilteredCustomers(accessibleCustomers || []);
                    setFilteredParentCustomers(accessibleParentCustomers || []);
                } else {
                    console.log("No sharings found for this user");
                    setCustomers([]);
                    setParentCustomers([]);
                    setFilteredCustomers([]);
                    setFilteredParentCustomers([]);
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
        const searchLower = search.toLowerCase();

        // Sort customers by name
        const sortedCustomers = [...customers].sort((a, b) => a.name.localeCompare(b.name));
        const sortedParentCustomers = [...parentCustomers].sort((a, b) => a.name.localeCompare(b.name));

        // Filter customers
        const filteredCusts = sortedCustomers.filter((customer) =>
            customer.name.toLowerCase().includes(searchLower)
        );

        // Filter parent customers (by name or if any of their children match)
        const filteredParents = sortedParentCustomers.filter((parent) => {
            const parentNameMatches = parent.name.toLowerCase().includes(searchLower);
            const hasMatchingChildren = sortedCustomers.some((customer) =>
                customer.parentCustomer &&
                (customer.parentCustomer._id === parent._id || customer.parentCustomer === parent._id) &&
                customer.name.toLowerCase().includes(searchLower)
            );
            return parentNameMatches || hasMatchingChildren;
        });

        setFilteredCustomers(filteredCusts);
        setFilteredParentCustomers(filteredParents);
    }, [search, customers, parentCustomers]);

    // Group customers by parent
    const getCustomersByParent = (parentId) => {
        return filteredCustomers.filter(customer =>
            customer.parentCustomer &&
            (customer.parentCustomer._id === parentId || customer.parentCustomer === parentId)
        );
    };

    // Get customers without parents
    const getCustomersWithoutParent = () => {
        return filteredCustomers.filter(customer => !customer.parentCustomer);
    };

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
            <div className="bg-white rounded-xl shadow-solid-l p-8 w-full max-w-md relative border border-gray-200 min-h-[90vh]">
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                        />
                        <div className="mb-10">
                            <select
                                id="customerType"
                                value={newCustomer.customerType || "Shopify"}
                                onChange={(e) => setNewCustomer({ ...newCustomer, customerType: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[var(--color-lime)] focus:outline-none transition-colors"
                            >
                                <option value="Shopify">Shopify</option>
                                <option value="WooCommerce">WooCommerce</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
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
                        <ul className="max-h-[60vh] overflow-y-auto mb-6">
                            {loading ? (
                                <li className="flex justify-center py-4">
                                    <div className="animate-spin rounded h-8 w-8 border-t-2 border-b-2 border-[var(--color-lime)]"></div>
                                </li>
                            ) : filteredParentCustomers.length > 0 || getCustomersWithoutParent().length > 0 ? (
                                <>
                                    {filteredParentCustomers
                                        .filter(parent => getCustomersByParent(parent._id).length > 0)
                                        .map((parent) => (
                                        <li key={parent._id} className="mb-4">
                                            <Link
                                                href={`/roll-up/${parent._id}`}
                                                className="font-bold text-[var(--color-dark-green)] mb-2 cursor-pointer hover:text-[var(--color-green)] transition-colors flex items-center"
                                                onClick={closeModal}
                                            >
                                                {parent.name}
                                                <span className="ml-2 text-xs text-gray-500 font-normal">
                                                    ({getCustomersByParent(parent._id).length} customers)
                                                    view all
                                                </span>
                                            </Link>
                                            <ul className="ml-4">
                                                {getCustomersByParent(parent._id).map((customer) => (
                                                    <li key={customer._id}>
                                                        <Link
                                                            href={`/dashboard/${customer._id}`}
                                                            className="flex items-center gap-2 cursor-pointer px-3 py-2 mt-1 text-sm rounded-lg hover:bg-[var(--color-natural)] text-[var(--color-dark-green)] border border-gray-100 transition-colors"
                                                            onClick={closeModal}
                                                        >
                                                            <span className="mr-2">↳</span>
                                                            {customer.name}
                                                            {getCustomerIcon(customer.customerType)}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}

                                    {getCustomersWithoutParent().length > 0 && (
                                        <li className="mb-4">
                                            {filteredParentCustomers.length > 0 && (
                                                <div className="font-bold text-[var(--color-dark-green)] mb-2">
                                                    Independent Customers
                                                </div>
                                            )}
                                            <ul className={filteredParentCustomers.length > 0 ? "ml-4" : ""}>
                                                {getCustomersWithoutParent().map((customer) => (
                                                    <li key={customer._id}>
                                                        <Link
                                                            href={`/dashboard/${customer._id}`}
                                                            className="flex items-center gap-2 cursor-pointer px-3 py-2 mt-1 text-sm rounded-lg hover:bg-[var(--color-natural)] text-[var(--color-dark-green)] border border-gray-100 transition-colors"
                                                            onClick={closeModal}
                                                        >
                                                            <span className="mr-2">↳</span>
                                                            {customer.name}
                                                            {getCustomerIcon(customer.customerType)}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    )}
                                </>
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