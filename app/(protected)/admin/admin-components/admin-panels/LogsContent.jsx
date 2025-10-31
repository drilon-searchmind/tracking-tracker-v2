"use client";

import { useState } from 'react';
import { FaSearch, FaFilter, FaClipboardList, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimesCircle, FaUser, FaCog } from 'react-icons/fa';

const LogsContent = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All Types');
    const [currentPage, setCurrentPage] = useState(1);

    // Mock log data
    const mockLogs = [
        {
            id: 1,
            type: 'User',
            action: 'User Login',
            description: 'User admin@searchmind.dk logged in successfully from 192.168.1.1',
            timestamp: '2025-10-31 10:30:25',
            status: 'Success',
            category: 'Authentication',
            icon: FaUser,
            statusColor: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            id: 2,
            type: 'System',
            action: 'Database Backup',
            description: 'Automated database backup completed successfully',
            timestamp: '2025-10-31 09:00:00',
            status: 'Success',
            category: 'System',
            icon: FaCog,
            statusColor: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            id: 3,
            type: 'Error',
            action: 'API Error',
            description: 'BigQuery connection timeout while fetching customer data',
            timestamp: '2025-10-31 08:45:12',
            status: 'Error',
            category: 'API',
            icon: FaExclamationTriangle,
            statusColor: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
        },
        {
            id: 4,
            type: 'User',
            action: 'Customer Created',
            description: 'New customer "Example Corp" created by admin user',
            timestamp: '2025-10-31 08:15:33',
            status: 'Success',
            category: 'Customer Management',
            icon: FaUser,
            statusColor: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200'
        },
        {
            id: 5,
            type: 'System',
            action: 'System Update',
            description: 'System configuration updated - Session timeout changed to 24 hours',
            timestamp: '2025-10-31 07:30:00',
            status: 'Info',
            category: 'Configuration',
            icon: FaCog,
            statusColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        }
    ];

    const filteredLogs = mockLogs.filter(log => {
        const matchesSearch = 
            log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            log.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesFilter = filterType === 'All Types' || log.type === filterType;
        
        return matchesSearch && matchesFilter;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Success':
                return <FaCheckCircle className="text-green-600" />;
            case 'Error':
                return <FaTimesCircle className="text-red-600" />;
            case 'Info':
                return <FaInfoCircle className="text-blue-600" />;
            default:
                return <FaInfoCircle className="text-gray-600" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-dark-green)] mb-2">Activity Logs</h2>
                    <p className="text-[var(--color-green)]">Monitor system activity, user actions, and system events</p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-[var(--color-green)] text-sm" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search logs..."
                        className="w-full pl-10 pr-4 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaFilter className="text-[var(--color-green)] text-sm" />
                    </div>
                    <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="pl-10 pr-8 py-3 border border-[var(--color-dark-natural)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent"
                    >
                        <option>All Types</option>
                        <option>User</option>
                        <option>System</option>
                        <option>Error</option>
                    </select>
                </div>
            </div>

            {/* Logs Display */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[var(--color-dark-green)]">
                        Recent Activity
                        <span className="ml-2 text-sm font-normal text-[var(--color-green)]">
                            ({filteredLogs.length} {filteredLogs.length === 1 ? 'entry' : 'entries'})
                        </span>
                    </h3>
                </div>

                {filteredLogs.length > 0 ? (
                    <div className="space-y-3">
                        {filteredLogs.map((log) => (
                            <div 
                                key={log.id} 
                                className={`p-4 md:p-6 border rounded-xl transition-all duration-200 hover:shadow-solid-11 ${log.bgColor} ${log.borderColor}`}
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="flex-shrink-0">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <log.icon className={`text-lg ${log.statusColor}`} />
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="font-semibold text-[var(--color-dark-green)]">
                                                    {log.action}
                                                </h4>
                                                {getStatusIcon(log.status)}
                                            </div>
                                            
                                            <p className="text-sm text-[var(--color-green)] mb-3 leading-relaxed">
                                                {log.description}
                                            </p>
                                            
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    log.status === 'Success' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : log.status === 'Error'
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {log.status}
                                                </span>
                                                <span className="bg-[var(--color-natural)] text-[var(--color-green)] text-xs px-2 py-1 rounded-full">
                                                    {log.category}
                                                </span>
                                                <span className="bg-[var(--color-lime)]/20 text-[var(--color-dark-green)] text-xs px-2 py-1 rounded-full">
                                                    {log.type}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-shrink-0">
                                        <span className="text-xs text-[var(--color-green)] bg-white px-3 py-1 rounded-full border border-[var(--color-dark-natural)]">
                                            {log.timestamp}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-[var(--color-dark-natural)]">
                        <FaClipboardList className="text-3xl text-[var(--color-light-green)] mx-auto mb-4" />
                        <p className="text-[var(--color-green)]">
                            {searchQuery || filterType !== 'All Types' 
                                ? "No logs match your current filters" 
                                : "No activity logs found"}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {filteredLogs.length > 0 && (
                    <div className="flex justify-center pt-6">
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-[var(--color-dark-natural)] rounded-lg text-sm hover:bg-[var(--color-natural)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            
                            <button className="px-4 py-2 border border-[var(--color-lime)] bg-[var(--color-lime)]/10 text-[var(--color-dark-green)] rounded-lg text-sm font-medium">
                                1
                            </button>
                            <button className="px-4 py-2 border border-[var(--color-dark-natural)] rounded-lg text-sm hover:bg-[var(--color-natural)] transition-colors">
                                2
                            </button>
                            <button className="px-4 py-2 border border-[var(--color-dark-natural)] rounded-lg text-sm hover:bg-[var(--color-natural)] transition-colors">
                                3
                            </button>
                            
                            <button 
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="px-4 py-2 border border-[var(--color-dark-natural)] rounded-lg text-sm hover:bg-[var(--color-natural)] transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Warning Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-yellow-600 text-sm">⚠</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium text-yellow-800 mb-1">Work in Progress</h4>
                        <p className="text-sm text-yellow-700">
                            This activity logs panel is currently under development. The logs shown are mock data for demonstration purposes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogsContent;