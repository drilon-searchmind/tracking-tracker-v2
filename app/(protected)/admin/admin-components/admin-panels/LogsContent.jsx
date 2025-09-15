import React from 'react'

const LogsContent = () => (
    <div>
        <h2 className="text-2xl font-semibold mb-6">Activity Logs</h2>
        <div className="mb-6 flex items-center gap-4">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search logs..."
                    className="w-64 px-4 py-2 border border-gray-300 rounded text-sm"
                />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded text-sm">
                <option>All Types</option>
                <option>User</option>
                <option>System</option>
                <option>Error</option>
            </select>
        </div>
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="p-3 border border-zinc-200 rounded-md">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">User Login</span>
                        <span className="text-xs text-gray-500">2025-09-14 10:30:25</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        User admin@searchmind.dk logged in successfully from 192.168.1.1
                    </p>
                    <div className="flex gap-2 mt-2">
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">Success</span>
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded">Authentication</span>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-6 flex justify-center">
            <div className="flex gap-1">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm">Previous</button>
                <button className="px-3 py-1 border border-gray-300 rounded bg-zinc-700 text-white text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm">2</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm">3</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm">Next</button>
            </div>
        </div>
    </div>
);

export default LogsContent