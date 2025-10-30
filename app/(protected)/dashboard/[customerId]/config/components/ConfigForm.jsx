"use client";

import { useState } from "react";

export default function ConfigForm({ customerId, baseUrl }) {
    const [formData, setFormData] = useState({
        month: "",
        year: new Date().getFullYear().toString(),
        revenue: "",
        budget: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log("Submitting config form for customer ID:", customerId);
        console.log("Form data:", formData);
        
        if (!formData.month || !formData.year || !formData.revenue || !formData.budget) {
            alert("Please fill in all fields");
            return;
        }

        setIsSubmitting(true);

        try {
            // Use relative URL for API calls
            const apiUrl = `/api/config-revenue-budget/${customerId}`;
            console.log("Making POST request to:", apiUrl);

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            console.log("Submit response status:", response.status);

            if (response.ok) {
                console.log("Configuration added successfully!");
                alert("Revenue objective added successfully!");
                setFormData({
                    month: "",
                    year: new Date().getFullYear().toString(),
                    revenue: "",
                    budget: "",
                });
                window.location.reload();
            } else {
                const errorText = await response.text();
                console.error("Failed to add configuration:", errorText);
                alert("Failed to add revenue objective.");
            }
        } catch (error) {
            console.error("Error submitting configuration:", error);
            alert("An error occurred while adding the revenue objective.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Updating ${name} to:`, value);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear + i - 2);

    return (
        <div className="bg-[var(--color-natural)] rounded-lg p-4 md:p-6">
            <h3 className="font-semibold text-base text-[var(--color-dark-green)] mb-4">Add Revenue Objective</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Month</label>
                        <select
                            name="month"
                            value={formData.month}
                            onChange={handleChange}
                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            required
                        >
                            <option value="">Select Month</option>
                            {months.map(month => (
                                <option key={month} value={month}>{month}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Year</label>
                        <select
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                            required
                        >
                            {years.map(year => (
                                <option key={year} value={year.toString()}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Revenue Target</label>
                    <input
                        type="number"
                        name="revenue"
                        value={formData.revenue}
                        onChange={handleChange}
                        className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                        placeholder="Enter revenue target"
                        required
                        min="0"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-[var(--color-dark-green)] mb-2">Marketing Budget</label>
                    <input
                        type="number"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                        placeholder="Enter marketing budget"
                        required
                        min="0"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[var(--color-dark-green)] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[var(--color-green)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Adding..." : "Add Objective"}
                </button>
            </form>
        </div>
    );
}