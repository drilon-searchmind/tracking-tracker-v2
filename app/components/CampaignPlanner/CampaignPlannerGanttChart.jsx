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

            const sortedCampaigns = processedCampaigns.sort((a, b) => a.startDate - b.startDate);

            setCampaignsWithDates(sortedCampaigns);
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
        <div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-solid-l overflow-hidden">
            <div className="p-6 border-b border-[var(--color-light-natural)] bg-[var(--color-natural)] flex justify-between items-center">
                <h3 className="font-semibold text-[var(--color-dark-green)]">Campaign Gantt Chart</h3>
                <div className="flex items-center">
                    <span className="text-sm text-[var(--color-green)] mr-2">Year:</span>
                    <select
                        value={currentYear}
                        onChange={(e) => handleYearChange(e.target.value)}
                        className="border border-[var(--color-dark-natural)] rounded-lg px-3 py-2 text-sm text-[var(--color-dark-green)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-colors"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="min-w-full">
                    <div className="flex border-b border-[var(--color-light-natural)]">
                        <div className="w-64 min-w-[16rem] p-4 bg-[var(--color-natural)] border-r border-[var(--color-light-natural)] font-medium text-[var(--color-dark-green)]">
                            Campaign
                        </div>
                        <div className="flex-1 flex">
                            {months.map((month, index) => (
                                <div
                                    key={index}
                                    className="flex-1 p-4 text-center text-sm font-medium text-[var(--color-dark-green)] border-r border-[var(--color-light-natural)] last:border-r-0"
                                >
                                    {format(month, 'MMM')}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        {campaignsWithDates.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 bg-[var(--color-natural)] rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-8 h-8 text-[var(--color-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <p className="text-[var(--color-green)] text-lg font-medium mb-2">No campaigns available</p>
                                    <p className="text-[var(--color-green)] text-sm">No campaigns found for {currentYear}</p>
                                </div>
                            </div>
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
                                    <div key={campaign._id} className="flex border-b border-[var(--color-light-natural)] hover:bg-[var(--color-natural)]/30 transition-colors">
                                        <div
                                            className="w-64 min-w-[16rem] p-4 border-r border-[var(--color-light-natural)] truncate cursor-pointer hover:text-[var(--color-light-green)] transition-colors"
                                            onClick={() => handleCampaignClick(campaign)}
                                        >
                                            <div className="font-medium text-[var(--color-dark-green)]">{campaign.campaignName}</div>
                                            <div className="text-xs text-[var(--color-green)] mt-1">
                                                {format(campaign.startDate, 'MMM d')} - {format(campaign.endDate, 'MMM d, yyyy')}
                                            </div>
                                        </div>
                                        <div className="flex-1 relative" style={{ height: '60px' }}>
                                            <div
                                                className="absolute h-8 rounded-lg flex items-center justify-center text-xs text-white font-medium top-3 cursor-pointer hover:opacity-90 transition-opacity"
                                                style={{
                                                    left: `${startPercentage}%`,
                                                    width: `${barWidth}%`,
                                                    backgroundColor: campaign.color,
                                                    minWidth: '40px',
                                                    maxWidth: `calc(100% - ${startPercentage}%)`,
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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

            <div className="p-6 border-t border-[var(--color-light-natural)] bg-[var(--color-natural)]">
                <p className="text-sm font-medium text-[var(--color-green)] mb-3">Campaign Types</p>
                <div className="flex flex-wrap gap-6">
                    {Object.entries(colors).filter(([key]) => key !== 'default').map(([type, color]) => (
                        <div key={type} className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }}></div>
                            <span className="text-sm text-[var(--color-dark-green)]">{type}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}