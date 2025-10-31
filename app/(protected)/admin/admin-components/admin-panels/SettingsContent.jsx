"use client";

import { useState } from 'react';
import { FaCog, FaServer, FaEnvelope, FaGlobe, FaSave, FaDatabase, FaShieldAlt } from 'react-icons/fa';

const SettingsContent = () => {
    const [settings, setSettings] = useState({
        systemName: "Searchmind Apex",
        defaultLanguage: "English",
        smtpServer: "",
        fromEmail: "noreply@searchmind.dk",
        smtpPort: "587",
        smtpUsername: "",
        smtpPassword: "",
        enableSSL: true,
        apiRateLimit: "1000",
        sessionTimeout: "24"
    });

    const [saving, setSaving] = useState(false);

    const handleInputChange = (field, value) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        // Simulate API call
        setTimeout(() => {
            setSaving(false);
            console.log("Settings saved:", settings);
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] mb-2">System Settings</h2>
                    <p className="text-[var(--color-green)]">Configure system-wide preferences and settings</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-white p-6 rounded-xl border border-[var(--color-dark-natural)] shadow-solid-11">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[var(--color-lime)]/10 rounded-lg">
                            <FaCog className="text-[var(--color-dark-green)] text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-[var(--color-dark-green)]">General Settings</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-green)] mb-2">
                                System Name
                            </label>
                            <input
                                type="text"
                                value={settings.systemName}
                                onChange={(e) => handleInputChange('systemName', e.target.value)}
                                className="w-full px-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                placeholder="Enter system name"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-green)] mb-2">
                                Default Language
                            </label>
                            <select
                                value={settings.defaultLanguage}
                                onChange={(e) => handleInputChange('defaultLanguage', e.target.value)}
                                className="w-full px-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                            >
                                <option value="English">English</option>
                                <option value="Danish">Danish</option>
                                <option value="German">German</option>
                                <option value="French">French</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-green)] mb-2">
                                Session Timeout (hours)
                            </label>
                            <input
                                type="number"
                                value={settings.sessionTimeout}
                                onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                                className="w-full px-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                placeholder="24"
                                min="1"
                                max="168"
                            />
                        </div>
                    </div>
                </div>

                {/* Email Settings */}
                <div className="bg-white p-6 rounded-xl border border-[var(--color-dark-natural)] shadow-solid-11">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[var(--color-lime)]/10 rounded-lg">
                            <FaEnvelope className="text-[var(--color-dark-green)] text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-[var(--color-dark-green)]">Email Settings</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-green)] mb-2">
                                SMTP Server
                            </label>
                            <input
                                type="text"
                                value={settings.smtpServer}
                                onChange={(e) => handleInputChange('smtpServer', e.target.value)}
                                className="w-full px-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                placeholder="smtp.example.com"
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-green)] mb-2">
                                    SMTP Port
                                </label>
                                <input
                                    type="text"
                                    value={settings.smtpPort}
                                    onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                                    className="w-full px-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                    placeholder="587"
                                />
                            </div>
                            <div className="flex items-end">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.enableSSL}
                                        onChange={(e) => handleInputChange('enableSSL', e.target.checked)}
                                        className="rounded border-[var(--color-dark-natural)] text-[var(--color-lime)] focus:ring-[var(--color-lime)]"
                                    />
                                    <span className="text-sm text-[var(--color-green)]">Enable SSL</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-green)] mb-2">
                                From Email
                            </label>
                            <input
                                type="email"
                                value={settings.fromEmail}
                                onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                                className="w-full px-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                placeholder="noreply@searchmind.dk"
                            />
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white p-6 rounded-xl border border-[var(--color-dark-natural)] shadow-solid-11">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[var(--color-lime)]/10 rounded-lg">
                            <FaShieldAlt className="text-[var(--color-dark-green)] text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-[var(--color-dark-green)]">Security Settings</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-green)] mb-2">
                                API Rate Limit (requests/hour)
                            </label>
                            <input
                                type="number"
                                value={settings.apiRateLimit}
                                onChange={(e) => handleInputChange('apiRateLimit', e.target.value)}
                                className="w-full px-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                                placeholder="1000"
                                min="100"
                                max="10000"
                            />
                        </div>
                        
                        <div className="p-4 bg-[var(--color-lime)]/5 border border-[var(--color-lime)]/20 rounded-lg">
                            <h4 className="font-medium text-[var(--color-dark-green)] mb-2">Authentication</h4>
                            <p className="text-sm text-[var(--color-green)]">
                                Two-factor authentication is enabled for all admin accounts.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-[var(--color-natural)] border border-[var(--color-dark-natural)] rounded-lg">
                            <h4 className="font-medium text-[var(--color-dark-green)] mb-2">Data Encryption</h4>
                            <p className="text-sm text-[var(--color-green)]">
                                All sensitive data is encrypted at rest and in transit using AES-256 encryption.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Database Settings */}
                <div className="bg-white p-6 rounded-xl border border-[var(--color-dark-natural)] shadow-solid-11">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[var(--color-lime)]/10 rounded-lg">
                            <FaDatabase className="text-[var(--color-dark-green)] text-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-[var(--color-dark-green)]">Database Settings</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-[var(--color-natural)] border border-[var(--color-dark-natural)] rounded-lg">
                            <h4 className="font-medium text-[var(--color-dark-green)] mb-2">BigQuery Integration</h4>
                            <p className="text-sm text-[var(--color-green)] mb-2">
                                Connected and operational
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-600">Active connection</span>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-[var(--color-natural)] border border-[var(--color-dark-natural)] rounded-lg">
                            <h4 className="font-medium text-[var(--color-dark-green)] mb-2">MongoDB</h4>
                            <p className="text-sm text-[var(--color-green)] mb-2">
                                Primary database for application data
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-green-600">Healthy</span>
                            </div>
                        </div>
                        
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="font-medium text-yellow-800 mb-2">Backup Status</h4>
                            <p className="text-sm text-yellow-700">
                                Last backup: 2 hours ago
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6">
                <button
                    onClick={handleSaveSettings}
                    disabled={saving}
                    className="bg-[var(--color-lime)] hover:bg-[var(--color-light-green)] text-[var(--color-dark-green)] px-8 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaSave />
                    {saving ? "Saving Settings..." : "Save Settings"}
                </button>
            </div>

            {/* Warning Notice */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 text-sm">⚠</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-red-800 mb-1">Work in Progress</h4>
                        <p className="text-sm text-red-700">
                            This settings panel is currently under development. Changes made here will not be saved permanently.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsContent;