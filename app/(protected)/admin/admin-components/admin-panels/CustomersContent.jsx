"use client";

import { useState, useEffect } from 'react';
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

            // Initialize editing state for all customers
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

            // Update local state
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
        // Confirmation before deleting
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

            // Update local state by removing the deleted customer
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
        <div>
            <h2 className="text-2xl font-semibold mb-6">Customer Management</h2>
            <div className="mb-6 flex justify-between items-center">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="w-64 px-4 py-2 border border-gray-300 rounded text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className="opacity-5 text-center bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm">
                    Add New Customer
                </button>
            </div>

            {loading ? (
                <div className="text-center py-8">Loading customers...</div>
            ) : (
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
                            {filteredCustomers.length > 0 ? (
                                filteredCustomers.map(customer => (
                                    <tr key={customer._id}>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={editingCustomers[customer._id]?.name || ''}
                                                onChange={(e) => handleInputChange(customer._id, 'name', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={editingCustomers[customer._id]?.bigQueryCustomerId || ''}
                                                onChange={(e) => handleInputChange(customer._id, 'bigQueryCustomerId', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={editingCustomers[customer._id]?.bigQueryProjectId || ''}
                                                onChange={(e) => handleInputChange(customer._id, 'bigQueryProjectId', e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                        </td>
                                        <td className="px-4 py-3 space-x-2">
                                            <button
                                                onClick={() => handleSaveCustomer(customer._id)}
                                                disabled={updatingId === customer._id}
                                                className="bg-zinc-700 py-1 px-3 rounded text-white hover:bg-zinc-800 text-sm disabled:bg-gray-400"
                                            >
                                                {updatingId === customer._id ? "Saving..." : "Save"}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCustomer(customer._id)}
                                                disabled={deletingId === customer._id}
                                                className="text-red-600 hover:text-red-800 py-1 px-3 rounded text-sm"
                                            >
                                                {deletingId === customer._id ? "Deleting..." : "Delete"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                                        {searchQuery ? "No customers match your search" : "No customers found"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CustomersContent;