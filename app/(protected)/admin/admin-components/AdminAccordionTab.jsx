"use client";

import { useState } from 'react';
import { FaUsers, FaBuilding, FaCog, FaClipboardList } from 'react-icons/fa';
import UsersContent from './admin-panels/UsersContent';
import CustomersContent from './admin-panels/CustomersContent';
import SettingsContent from './admin-panels/SettingsContent';
import LogsContent from './admin-panels/LogsContent';
import GA4Analytics from './admin-sections/GA4Analytics';

const AdminAccordionTab = () => {
    const [activeTab, setActiveTab] = useState("users");

    const tabs = [
        { 
            id: "users", 
            label: "Users", 
            icon: <FaUsers className="text-lg" />,
            description: "Manage user accounts and permissions"
        },
        { 
            id: "customers", 
            label: "Customers", 
            icon: <FaBuilding className="text-lg" />,
            description: "Manage customer accounts and data"
        },
        { 
            id: "settings", 
            label: "Settings", 
            icon: <FaCog className="text-lg" />,
            description: "System configuration and preferences",
            isWip: true
        },
        { 
            id: "logs", 
            label: "Activity Logs", 
            icon: <FaClipboardList className="text-lg" />,
            description: "Monitor system activity and events",
            isWip: true
        }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case "users":
                return <UsersContent />;
            case "customers":
                return <CustomersContent />;
            case "settings":
                return <SettingsContent />;
            case "logs":
                return <LogsContent />;
            default:
                return <UsersContent />;
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Tab Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`p-4 md:p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                            activeTab === tab.id
                                ? "bg-[var(--color-lime)]/10 border-[var(--color-lime)] shadow-solid-l"
                                : "bg-white border-[var(--color-dark-natural)] hover:border-[var(--color-light-green)] hover:shadow-solid-11"
                        }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`${
                                activeTab === tab.id 
                                    ? "text-[var(--color-dark-green)]" 
                                    : "text-[var(--color-light-green)]"
                            }`}>
                                {tab.icon}
                            </div>
                            <h3 className={`font-semibold ${
                                activeTab === tab.id 
                                    ? "text-[var(--color-dark-green)]" 
                                    : "text-[var(--color-green)]"
                            }`}>
                                {tab.label}
                                {tab.isWip && (
                                    <span className="ml-2 text-xs bg-[var(--color-dark-natural)] text-[var(--color-green)] px-2 py-0.5 rounded-full">
                                        WIP
                                    </span>
                                )}
                            </h3>
                        </div>
                        <p className="text-sm text-[var(--color-green)] leading-relaxed">
                            {tab.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white border border-[var(--color-dark-natural)] rounded-xl shadow-solid-l overflow-hidden">
                <div className="p-6 md:p-8">
                    {renderTabContent()}
                </div>
            </div>

            {/* GA4 Analytics Section */}
            <div className="opacity-60">
                <GA4Analytics />
            </div>
        </div>
    );
};

export default AdminAccordionTab;