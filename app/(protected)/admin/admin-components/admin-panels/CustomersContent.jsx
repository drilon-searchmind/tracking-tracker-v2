"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaBuilding, FaEdit, FaTrash, FaDatabase, FaCog } from 'react-icons/fa';
import { useToast } from '@/app/contexts/ToastContext';

const CustomersContent = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingCustomers, setEditingCustomers] = useState({});
    const [updatingId, setUpdatingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/customers');

            if (!response.ok) {
                throw new Error(`Error fetching customers: ${response.status}`);
            }

            const data = await response.json();
            console.log("Fetched customers:", data);
            setCustomers(data);

            const initialEditState = {};
            data.forEach(customer => {
                initialEditState[customer._id] = {
                    name: customer.name || '',
                    bigQueryCustomerId: customer.bigQueryCustomerId || '',
                    bigQueryProjectId: customer.bigQueryProjectId || ''
                };
            });
            setEditingCustomers(initialEditState);
        } catch (error) {
            console.error("Failed to fetch customers:", error);
            showToast("Failed to load customers", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (customerId, field, value) => {
        setEditingCustomers(prev => ({
            ...prev,
            [customerId]: {
                ...prev[customerId],
                [field]: value
            }
        }));
    };

    const handleSaveCustomer = async (customerId) => {
        try {
            setUpdatingId(customerId);
            const customerData = editingCustomers[customerId];

            const response = await fetch(`/api/customers/${customerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            });

            if (!response.ok) {
                throw new Error(`Error updating customer: ${response.status}`);
            }

            const updatedCustomer = await response.json();

            setCustomers(customers.map(customer =>
                customer._id === customerId ? updatedCustomer : customer
            ));

            showToast("Customer updated successfully", "success");
        } catch (error) {
            console.error("Failed to update customer:", error);
            showToast("Failed to update customer", "error");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteCustomer = async (customerId) => {
        if (!window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
            return;
        }

        try {
            setDeletingId(customerId);

            const response = await fetch(`/api/customers/${customerId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error deleting customer: ${response.status}`);
            }

            setCustomers(customers.filter(customer => customer._id !== customerId));

            showToast("Customer deleted successfully", "success");
        } catch (error) {
            console.error("Failed to delete customer:", error);
            showToast("Failed to delete customer", "error");
        } finally {
            setDeletingId(null);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.bigQueryCustomerId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.bigQueryProjectId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] mb-2">Customer Management</h2>
                    <p className="text-[var(--color-green)]">Manage customer accounts and BigQuery configurations</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-[var(--color-green)] text-sm" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="w-full md:w-80 pl-10 pr-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button 
                    disabled
                    className="bg-[var(--color-dark-natural)] text-[var(--color-green)] px-6 py-3 rounded-lg font-medium cursor-not-allowed flex items-center gap-2 opacity-50"
                >
                    <FaPlus />
                    Add New Customer
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-lime)] mx-auto mb-4"></div>
                    <p className="text-[var(--color-green)]">Loading customers...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">
                            All Customers
                            <span className="ml-2 text-sm font-normal text-[var(--color-green)]">
                                ({filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'})
                            </span>
                        </h3>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg border border-[var(--color-dark-natural)]">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[var(--color-natural)] border-b border-[var(--color-dark-natural)]">
                                <tr className="text-[var(--color-dark-green)]">
                                    <th className="px-4 py-4 text-left font-semibold">
                                        <span className="flex items-center gap-2">
                                            <FaBuilding className="text-[var(--color-light-green)]" />
                                            Customer Name
                                        </span>
                                    </th>
                                    <th className="px-4 py-4 text-left font-semibold">
                                        <span className="flex items-center gap-2">
                                            <FaDatabase className="text-[var(--color-light-green)]" />
                                            BigQuery Customer ID
                                        </span>
                                    </th>
                                    <th className="px-4 py-4 text-left font-semibold">
                                        <span className="flex items-center gap-2">
                                            <FaCog className="text-[var(--color-light-green)]" />
                                            BigQuery Project ID
                                        </span>
                                    </th>
                                    <th className="px-4 py-4 text-left font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-[var(--color-green)] divide-y divide-[var(--color-light-natural)]">
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map(customer => (
                                        <tr key={customer._id} className="hover:bg-[var(--color-natural)]/50 transition-colors">
                                            <td className="px-4 py-4">
                                                <input
                                                    type="text"
                                                    value={editingCustomers[customer._id]?.name || ''}
                                                    onChange={(e) => handleInputChange(customer._id, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                                    placeholder="Customer name"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="text"
                                                    value={editingCustomers[customer._id]?.bigQueryCustomerId || ''}
                                                    onChange={(e) => handleInputChange(customer._id, 'bigQueryCustomerId', e.target.value)}
                                                    className="w-full px-3 py-2 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                                    placeholder="BigQuery Customer ID"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="text"
                                                    value={editingCustomers[customer._id]?.bigQueryProjectId || ''}
                                                    onChange={(e) => handleInputChange(customer._id, 'bigQueryProjectId', e.target.value)}
                                                    className="w-full px-3 py-2 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                                    placeholder="BigQuery Project ID"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleSaveCustomer(customer._id)}
                                                        disabled={updatingId === customer._id}
                                                        className="bg-[var(--color-dark-green)] hover:bg-[var(--color-green)] text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:bg-[var(--color-dark-natural)] disabled:cursor-not-allowed flex items-center gap-1"
                                                    >
                                                        <FaEdit className="text-xs" />
                                                        {updatingId === customer._id ? "Saving..." : "Save"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCustomer(customer._id)}
                                                        disabled={deletingId === customer._id}
                                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                                    >
                                                        <FaTrash className="text-xs" />
                                                        {deletingId === customer._id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-12 text-center text-[var(--color-green)]">
                                            <div className="flex flex-col items-center gap-2">
                                                <FaBuilding className="text-2xl text-[var(--color-light-green)]" />
                                                <p>{searchQuery ? "No customers match your search" : "No customers found"}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomersContent;