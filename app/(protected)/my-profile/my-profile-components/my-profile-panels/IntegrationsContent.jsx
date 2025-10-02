"use client";

import { useState } from 'react';
import { FaSlack } from "react-icons/fa";
import { SiClickup } from "react-icons/si";

export default function IntegrationsContent() {
    const [integrations, setIntegrations] = useState({
        slack: {
            webhook: '',
            connected: false
        },
        clickup: {
            apiKey: '',
            connected: false
        }
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleInputChange = (integration, field, value) => {
        setIntegrations(prev => ({
            ...prev,
            [integration]: {
                ...prev[integration],
                [field]: value
            }
        }));
    };

    const handleSaveIntegration = (integration) => {
        setIsSaving(true);
        setTimeout(() => {
            setIntegrations(prev => ({
                ...prev,
                [integration]: {
                    ...prev[integration],
                    connected: !!prev[integration].apiKey || !!prev[integration].webhook
                }
            }));
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Integration Settings (WIP)</h2>

            <div className="space-y-8">
                {/* Slack Integration */}
                <div className="border border-gray-200 rounded-lg p-6 opacity-50 cursor-not-allowed poiner-events-none">
                    <div className="flex items-center gap-3 mb-4">
                        <FaSlack className="text-2xl text-[#4A154B]" />
                        <h3 className="text-lg font-medium">Slack Integration</h3>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                        Connect to Slack to receive notifications about campaign updates and approvals.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Slack Webhook URL</label>
                            <input
                                type="text"
                                value={integrations.slack.webhook}
                                onChange={(e) => handleInputChange('slack', 'webhook', e.target.value)}
                                placeholder="https://hooks.slack.com/services/..."
                                className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                {integrations.slack.connected && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Connected
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => handleSaveIntegration('slack')}
                                disabled={isSaving}
                                className="bg-zinc-700 py-1 px-3 rounded text-white hover:bg-zinc-800 text-sm disabled:bg-gray-400"
                            >
                                {isSaving ? "Saving..." : "Save Connection"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ClickUp Integration */}
                <div className="border border-gray-200 rounded-lg p-6 opacity-50 cursor-not-allowed poiner-events-none">
                    <div className="flex items-center gap-3 mb-4">
                        <SiClickup className="text-2xl text-[#7B68EE]" />
                        <h3 className="text-lg font-medium">ClickUp Integration</h3>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                        Connect to ClickUp to sync tasks and campaign progress with your workspace.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">ClickUp API Key</label>
                            <input
                                type="text"
                                value={integrations.clickup.apiKey}
                                onChange={(e) => handleInputChange('clickup', 'apiKey', e.target.value)}
                                placeholder="pk_12345678_ABCDEFGHIJK..."
                                className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                {integrations.clickup.connected && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Connected
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={() => handleSaveIntegration('clickup')}
                                disabled={isSaving}
                                className="bg-zinc-700 py-1 px-3 rounded text-white hover:bg-zinc-800 text-sm disabled:bg-gray-400"
                            >
                                {isSaving ? "Saving..." : "Save Connection"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}