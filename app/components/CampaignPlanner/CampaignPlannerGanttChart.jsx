"use client";

import { useState, useEffect } from "react";
import { format, eachMonthOfInterval, isSameMonth, differenceInDays, addDays, isBefore, isAfter } from "date-fns";

export default function CampaignPlannerGanttChart({ campaigns, customerId, onViewCampaignDetails }) {
    const [months, setMonths] = useState([]);
    const [campaignsWithDates, setCampaignsWithDates] = useState([]);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const colors = {
        "Paid Social": "#10B981",    // Green
        "Paid Search": "#F59E0B",    // Amber/Orange
        "Email Marketing": "#8B5CF6", // Purple
        "SEO": "#EC4899",            // Pink
        "default": "#3B82F6",        // Bright blue
    };

    useEffect(() => {
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31);

        const monthsInYear = eachMonthOfInterval({
            start: startOfYear,
            end: endOfYear
        });

        setMonths(monthsInYear);

        if (campaigns && campaigns.length > 0) {
            const processedCampaigns = campaigns.map(campaign => {
                const startDate = new Date(campaign.startDate);
                const endDate = new Date(campaign.endDate);

                return {
                    ...campaign,
                    startDate,
                    endDate,
                    color: colors[campaign.service] || colors.default
                };
            });

            setCampaignsWithDates(processedCampaigns);
        }
    }, [campaigns, currentYear]);

    const handleYearChange = (year) => {
        setCurrentYear(parseInt(year));
    };

    const handleCampaignClick = (campaign) => {
        if (onViewCampaignDetails) {
            onViewCampaignDetails(campaign);
        }
    };

    const calculatePosition = (date) => {
        const startOfYear = new Date(currentYear, 0, 1);
        const daysInYear = currentYear % 4 === 0 ? 366 : 365;
        const dayOfYear = differenceInDays(date, startOfYear);
        return (dayOfYear / daysInYear) * 100;
    };

    const calculateWidth = (startDate, endDate) => {
        const adjustedStartDate = isBefore(startDate, new Date(currentYear, 0, 1))
            ? new Date(currentYear, 0, 1)
            : startDate;

        const adjustedEndDate = isAfter(endDate, new Date(currentYear, 11, 31))
            ? new Date(currentYear, 11, 31)
            : endDate;

        const daysInYear = currentYear % 4 === 0 ? 366 : 365;
        const campaignDays = differenceInDays(adjustedEndDate, adjustedStartDate) + 1;
        return (campaignDays / daysInYear) * 100;
    };

    const isCampaignInYear = (startDate, endDate) => {
        const yearStart = new Date(currentYear, 0, 1);
        const yearEnd = new Date(currentYear, 11, 31);

        return (
            (isAfter(startDate, yearStart) && isBefore(startDate, yearEnd)) ||
            (isAfter(endDate, yearStart) && isBefore(endDate, yearEnd)) ||
            (isBefore(startDate, yearStart) && isAfter(endDate, yearEnd))
        );
    };

    const currentYearInt = new Date().getFullYear();
    const availableYears = [
        currentYearInt - 2,
        currentYearInt - 1,
        currentYearInt,
        currentYearInt + 1,
        currentYearInt + 2
    ];

    return (
        <div className="bg-white border border-zinc-200 rounded-lg shadow-solid-l overflow-hidden mb-12">
            <div className="p-6 border-b border-zinc-200 bg-[#f8fafc] flex justify-between items-center">
                <h3 className="font-medium text-gray-800">Campaign Gantt Chart</h3>
                <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Year:</span>
                    <select
                        value={currentYear}
                        onChange={(e) => handleYearChange(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full">
                    <div className="flex border-b border-zinc-200">
                        <div className="w-64 min-w-[16rem] p-3 bg-gray-50 border-r border-zinc-200 font-medium text-gray-700">
                            Campaign
                        </div>
                        <div className="flex-1 flex">
                            {months.map((month, index) => (
                                <div
                                    key={index}
                                    className="flex-1 p-3 text-center text-sm font-medium text-gray-700 border-r border-zinc-200 last:border-r-0"
                                >
                                    {format(month, 'MMM')}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        {campaignsWithDates.length === 0 ? (
                            <div className="p-6 text-center text-gray-500">No campaigns available for this year</div>
                        ) : (
                            campaignsWithDates.map((campaign) => {
                                if (!isCampaignInYear(campaign.startDate, campaign.endDate)) {
                                    return null;
                                }

                                const startPercentage = calculatePosition(
                                    isBefore(campaign.startDate, new Date(currentYear, 0, 1))
                                        ? new Date(currentYear, 0, 1)
                                        : campaign.startDate
                                );

                                const barWidth = calculateWidth(campaign.startDate, campaign.endDate);

                                return (
                                    <div key={campaign._id} className="flex border-b border-zinc-200 hover:bg-gray-50">
                                        <div
                                            className="w-64 min-w-[16rem] p-3 border-r border-zinc-200 truncate cursor-pointer hover:text-blue-600"
                                            onClick={() => handleCampaignClick(campaign)}
                                        >
                                            <div className="font-medium">{campaign.campaignName}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {format(campaign.startDate, 'MMM d')} - {format(campaign.endDate, 'MMM d, yyyy')}
                                            </div>
                                        </div>
                                        <div className="flex-1 relative" style={{ height: '60px' }}>
                                            <div
                                                className="absolute h-8 rounded-md flex items-center justify-center text-xs text-white font-medium top-3"
                                                style={{
                                                    left: `${startPercentage}%`,
                                                    width: `${barWidth}%`,
                                                    backgroundColor: campaign.color,
                                                    minWidth: '40px',
                                                    maxWidth: `calc(100% - ${startPercentage}%)`,
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
                                                }}
                                                title={`${campaign.campaignName}: ${format(campaign.startDate, 'MMM d')} - ${format(campaign.endDate, 'MMM d')}`}
                                                onClick={() => handleCampaignClick(campaign)}
                                            >
                                                
                                            </div>
                                        </div>
                                    </div>
                                );
                            }).filter(Boolean)
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-zinc-200 bg-[#f8fafc]">
                <p className="text-sm font-medium text-gray-500 mb-2">Campaign Types</p>
                <div className="flex flex-wrap gap-4">
                    {Object.entries(colors).filter(([key]) => key !== 'default').map(([type, color]) => (
                        <div key={type} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }}></div>
                            <span className="text-sm text-gray-700">{type}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}