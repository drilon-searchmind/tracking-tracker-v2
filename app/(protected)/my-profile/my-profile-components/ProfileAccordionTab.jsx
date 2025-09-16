"use client";

import { useState } from 'react';
import UserSettingsContent from './my-profile-panels/UserSettingsContent';
import IntegrationsContent from './my-profile-panels/IntegrationsContent';
import UserCampaignsContent from './my-profile-panels/UserCampaignsContent';

export default function ProfileAccordionTab() {
    const [activeTab, setActiveTab] = useState("settings");

    const tabs = [
        { id: "settings", label: "User Settings" },
        { id: "integrations", label: "Integrations (WIP)" },
        { id: "campaignplanner", label: "My Campaigns" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "settings":
                return <UserSettingsContent />;
            case "integrations":
                return <IntegrationsContent />;
            case "campaignplanner":
                return <UserCampaignsContent />;
            default:
                return <UserSettingsContent />;
        }
    };

    return (
        <div>
            <div className="bg-white border border-zinc-200 rounded-lg shadow-solid-7 overflow-hidden">
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
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
}