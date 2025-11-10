"use client";

import { useEffect, useState } from 'react';
import { FaUser, FaCog, FaTasks } from 'react-icons/fa';
import UserSettingsContent from './my-profile-panels/UserSettingsContent';
import IntegrationsContent from './my-profile-panels/IntegrationsContent';
import UserCampaignsContent from './my-profile-panels/UserCampaignsContent';

export default function ProfileAccordionTab({ defaultActiveTab = 'settings' }) {
    const [activeTab, setActiveTab] = useState("settings");

    const tabs = [
        { 
            id: "settings", 
            label: "User Settings", 
            icon: <FaUser className="text-lg" />,
            description: "Manage your account settings"
        },
        { 
            id: "integrations", 
            label: "Integrations", 
            icon: <FaCog className="text-lg" />,
            description: "Configure third-party integrations",
            badge: "WIP"
        },
        { 
            id: "campaigns", 
            label: "My Campaigns", 
            icon: <FaTasks className="text-lg" />,
            description: "View and manage your campaigns"
        },
    ];

    useEffect(() => {
        setActiveTab(defaultActiveTab);
    }, [defaultActiveTab]);

    const renderContent = () => {
        switch (activeTab) {
            case "settings":
                return <UserSettingsContent />;
            case "integrations":
                return <IntegrationsContent />;
            case "campaigns":
                return <UserCampaignsContent />;
            default:
                return <UserSettingsContent />;
        }
    };

    return (
        <div>
            <div className="bg-white border border-[var(--color-dark-natural)] rounded-xl shadow-solid-11 overflow-hidden">
                <div className="flex flex-col lg:flex-row min-h-[calc(100vh-220px)]">
                    {/* Left Menu */}
                    <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-[var(--color-dark-natural)] bg-[var(--color-natural)]">
                        <div className="p-4 lg:p-6 border-b border-[var(--color-dark-natural)]">
                            <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">Profile Menu</h3>
                            <p className="text-sm text-[var(--color-green)] mt-1">Choose a section to manage</p>
                        </div>
                        <ul className="p-2">
                            {tabs.map((tab) => (
                                <li key={tab.id} className="mb-1">
                                    <button
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left px-4 py-4 rounded-lg border-l-4 transition-all duration-200 group ${
                                            activeTab === tab.id
                                                ? "border-l-[var(--color-lime)] bg-white shadow-sm font-medium"
                                                : "border-l-transparent hover:bg-white/50 hover:border-l-[var(--color-light-green)]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`${
                                                activeTab === tab.id 
                                                    ? "text-[var(--color-dark-green)]" 
                                                    : "text-[var(--color-green)] group-hover:text-[var(--color-dark-green)]"
                                            }`}>
                                                {tab.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${
                                                        activeTab === tab.id 
                                                            ? "text-[var(--color-dark-green)]" 
                                                            : "text-[var(--color-green)] group-hover:text-[var(--color-dark-green)]"
                                                    }`}>
                                                        {tab.label}
                                                    </span>
                                                    {tab.badge && (
                                                        <span className="bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] text-xs px-2 py-1 rounded-full font-medium">
                                                            {tab.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-xs mt-1 ${
                                                    activeTab === tab.id 
                                                        ? "text-[var(--color-green)]" 
                                                        : "text-[var(--color-green)]/80"
                                                }`}>
                                                    {tab.description}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-white">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}