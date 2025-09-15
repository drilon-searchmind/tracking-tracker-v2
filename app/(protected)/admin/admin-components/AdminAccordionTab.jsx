"use client";

import { useState } from 'react';
import UsersContent from './admin-panels/UsersContent';
import CustomersContent from './admin-panels/CustomersContent';
import SettingsContent from './admin-panels/SettingsContent';
import LogsContent from './admin-panels/LogsContent';
import GA4Analytics from './admin-sections/GA4Analytics';

const AdminAccordionTab = () => {
    const [activeTab, setActiveTab] = useState("users");

    const tabs = [
        { id: "users", label: "Users" },
        { id: "customers", label: "Customers" },
        { id: "settings", label: "Settings (wip)" },
        { id: "logs", label: "Activity Logs (wip)" }
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
        <div>
            <div className="bg-white border border-zinc-200 rounded-lg shadow-solid-l overflow-hidden">
                <div className="flex h-[calc(100vh-220px)]">
                    {/* Left Menu */}
                    <div className="w-64 border-r border-zinc-200 bg-gray-50">
                        <ul>
                            {tabs.map((tab) => (
                                <li key={tab.id}>
                                    <button
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left px-6 py-4 border-l-2 ${activeTab === tab.id
                                            ? "border-l-zinc-700 bg-white font-medium"
                                            : "border-l-transparent hover:bg-gray-100"
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {renderTabContent()}
                    </div>
                </div>

            </div>

            <div className='mt-10'>
                <GA4Analytics />
            </div>
        </div>
    );
};

export default AdminAccordionTab;