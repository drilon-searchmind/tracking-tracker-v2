import React from 'react'

const SettingsContent = () => (
    <div>
        <h2 className="text-2xl font-semibold mb-6">System Settings</h2>
        <div className="space-y-6 max-w-2xl">
            <div className="p-5 border border-zinc-200 rounded-md">
                <h3 className="font-medium mb-3">General Settings</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">System Name</label>
                        <input
                            type="text"
                            value="Searchmind Apex"
                            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Default Language</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded text-sm">
                            <option>English</option>
                            <option>Danish</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-5 border border-zinc-200 rounded-md">
                <h3 className="font-medium mb-3">Email Settings</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">SMTP Server</label>
                        <input
                            type="text"
                            placeholder="smtp.example.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">From Email</label>
                        <input
                            type="email"
                            placeholder="noreply@searchmind.dk"
                            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button className="text-center bg-zinc-700 py-2 px-4 rounded text-white hover:bg-zinc-800 gap-2 hover:cursor-pointer text-sm">
                    Save Settings
                </button>
            </div>
        </div>
    </div>
);

export default SettingsContent