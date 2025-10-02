import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const GA4Analytics = () => {
    const [timeRange, setTimeRange] = useState('7d');

    const mockData = {
        summary: {
            users: 1248,
            newUsers: 782,
            sessions: 3967,
            engagement: '2m 34s',
            bounceRate: '42.3%',
            pageviews: 8563
        },
        pageviewsData: {
            labels: ['Sep 8', 'Sep 9', 'Sep 10', 'Sep 11', 'Sep 12', 'Sep 13', 'Sep 14'],
            datasets: [
                {
                    label: 'Pageviews',
                    data: [756, 824, 691, 903, 1204, 1056, 978],
                    borderColor: '#1C398E',
                    backgroundColor: '#1C398E',
                    tension: 0.3
                }
            ]
        },
        userEngagement: {
            labels: ['0-10s', '10-30s', '30-60s', '1-3m', '3-10m', '10m+'],
            datasets: [
                {
                    label: 'Session Duration',
                    data: [432, 864, 1123, 967, 421, 160],
                    backgroundColor: [
                        '#1C398E',
                        '#2E4CA8',
                        '#4963BE',
                        '#6E82D0',
                        '#9BABE1',
                        '#CDD5F0'
                    ],
                }
            ]
        },
        topPages: [
            { path: '/dashboard/airbyte_humdakin_dk', views: 986, avgTime: '3:24' },
            { path: '/home', views: 754, avgTime: '1:42' },
            { path: '/admin', views: 543, avgTime: '5:12' },
            { path: '/dashboard/humdakin_dk', views: 421, avgTime: '2:56' },
            { path: '/dashboard/pompdelux_dk', views: 357, avgTime: '2:33' }
        ],
        events: {
            labels: ['Page View', 'Click', 'Session Start', 'File Download', 'Form Submit', 'Scroll'],
            datasets: [
                {
                    data: [8563, 5429, 3967, 876, 542, 2341],
                    backgroundColor: ['#1C398E', '#2E4CA8', '#4963BE', '#6E82D0', '#9BABE1', '#CDD5F0'],
                }
            ]
        },
        userSource: [
            { source: 'Direct', users: 516, percentage: '41.3%' },
            { source: 'Email', users: 327, percentage: '26.2%' },
            { source: 'Organic Search', users: 214, percentage: '17.1%' },
            { source: 'Referral', users: 143, percentage: '11.5%' },
            { source: 'Social', users: 48, percentage: '3.9%' }
        ]
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0,0,0,0.05)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right'
            }
        },
        cutout: '65%'
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="mb-2 text-xl font-semibold text-black dark:text-white xl:text-2xl mt-5 mb-5">GA4 Analytics Dashboard</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setTimeRange('7d')}
                        className={`px-3 py-1 text-sm rounded ${timeRange === '7d'
                            ? 'bg-zinc-700 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        7 Days
                    </button>
                    <button
                        onClick={() => setTimeRange('30d')}
                        className={`px-3 py-1 text-sm rounded ${timeRange === '30d'
                            ? 'bg-zinc-700 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        30 Days
                    </button>
                    <button
                        onClick={() => setTimeRange('90d')}
                        className={`px-3 py-1 text-sm rounded ${timeRange === '90d'
                            ? 'bg-zinc-700 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                        90 Days
                    </button>
                </div>
            </div>

            {/* Key Metrics Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-solid-l border border-zinc-200">
                    <p className="text-sm text-gray-500 mb-1">Users</p>
                    <p className="text-xl font-semibold">{mockData.summary.users.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-solid-l border border-zinc-200">
                    <p className="text-sm text-gray-500 mb-1">New Users</p>
                    <p className="text-xl font-semibold">{mockData.summary.newUsers.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-solid-l border border-zinc-200">
                    <p className="text-sm text-gray-500 mb-1">Sessions</p>
                    <p className="text-xl font-semibold">{mockData.summary.sessions.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-solid-l border border-zinc-200">
                    <p className="text-sm text-gray-500 mb-1">Avg. Engagement</p>
                    <p className="text-xl font-semibold">{mockData.summary.engagement}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-solid-l border border-zinc-200">
                    <p className="text-sm text-gray-500 mb-1">Bounce Rate</p>
                    <p className="text-xl font-semibold">{mockData.summary.bounceRate}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-solid-l border border-zinc-200">
                    <p className="text-sm text-gray-500 mb-1">Total Pageviews</p>
                    <p className="text-xl font-semibold">{mockData.summary.pageviews.toLocaleString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pageviews Chart */}
                <div className="bg-white p-6 rounded-lg shadow-solid-l border border-zinc-200">
                    <h3 className="text-lg font-medium mb-4">Pageviews Over Time</h3>
                    <div className="h-60">
                        <Line data={mockData.pageviewsData} options={lineOptions} />
                    </div>
                </div>

                {/* User Engagement Chart */}
                <div className="bg-white p-6 rounded-lg shadow-solid-l border border-zinc-200">
                    <h3 className="text-lg font-medium mb-4">User Engagement</h3>
                    <div className="h-60">
                        <Bar data={mockData.userEngagement} options={barOptions} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Pages Table */}
                <div className="bg-white p-6 rounded-lg shadow-solid-l border border-zinc-200 lg:col-span-2">
                    <h3 className="text-lg font-medium mb-4">Top Pages</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 border-b text-left">
                                <tr className="text-zinc-600">
                                    <th className="px-4 py-3 font-medium">Page Path</th>
                                    <th className="px-4 py-3 font-medium text-center">Views</th>
                                    <th className="px-4 py-3 font-medium text-center">Avg. Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100">
                                {mockData.topPages.map((page, index) => (
                                    <tr key={index} className="text-zinc-700">
                                        <td className="px-4 py-3">{page.path}</td>
                                        <td className="px-4 py-3 text-center">{page.views.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-center">{page.avgTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Events Chart */}
                <div className="bg-white p-6 rounded-lg shadow-solid-l border border-zinc-200">
                    <h3 className="text-lg font-medium mb-4">Top Events</h3>
                    <div className="h-60">
                        <Doughnut data={mockData.events} options={doughnutOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GA4Analytics;