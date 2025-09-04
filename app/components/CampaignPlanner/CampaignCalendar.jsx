"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
	"en-US": require("date-fns/locale/en-US")
};

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
});

export default function CampaignCalendar({
	campaigns,
	customerId,
	onViewCampaignDetails
}) {
	const [view, setView] = useState("month");
	const [events, setEvents] = useState([]);

	useEffect(() => {
		// Format campaigns as calendar events
		if (campaigns && campaigns.length > 0) {
			const formattedEvents = campaigns.map(campaign => ({
				id: campaign._id,
				title: campaign.campaignName,
				start: new Date(campaign.startDate),
				end: new Date(campaign.endDate),
				resource: {
					...campaign,
					service: campaign.service,
					media: campaign.media,
					budget: campaign.budget,
				}
			}));
			setEvents(formattedEvents);
		}
	}, [campaigns]);

	const handleViewChange = (newView) => {
		setView(newView);
	};

	const eventStyleGetter = (event) => {
		// Set color based on campaign service
		let backgroundColor = '#3174ad'; // default blue

		switch (event.resource.service) {
			case 'Paid Social':
				backgroundColor = '#1DA1F2'; // Twitter blue
				break;
			case 'Paid Search':
				backgroundColor = '#EA4335'; // Google red
				break;
			case 'Email Marketing':
				backgroundColor = '#6B5B95'; // Purple
				break;
			case 'SEO':
				backgroundColor = '#2E8B57'; // Sea green
				break;
		}

		return {
			style: {
				backgroundColor,
				borderRadius: '4px',
				opacity: 0.8,
				color: 'white',
				border: 'none',
				display: 'block'
			}
		};
	};

	const handleEventSelect = (event) => {
		if (onViewCampaignDetails) {
			const selectedCampaign = campaigns.find(campaign => campaign._id === event.id);
			if (selectedCampaign) {
				onViewCampaignDetails(selectedCampaign);
			}
		}
	};

	return (
		<div className="bg-white rounded-lg shadow-xl p-6">
			<div className="flex justify-between items-center mb-6">
				<h3 className="text-xl font-semibold text-blue-900">Campaign Calendar</h3>
				<div className="flex gap-2">
					<button
						onClick={() => handleViewChange("month")}
						className={`px-4 py-2 text-sm ${view === "month" ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700"
							} rounded-l`}
					>
						Month
					</button>
					<button
						onClick={() => handleViewChange("week")}
						className={`px-4 py-2 text-sm ${view === "week" ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700"
							} rounded-r`}
					>
						Week
					</button>
				</div>
			</div>

			<div className="h-[600px]">
				<Calendar
					localizer={localizer}
					events={events}
					startAccessor="start"
					endAccessor="end"
					style={{ height: "100%" }}
					view={view}
					onView={handleViewChange}
					views={["month", "week"]}
					eventPropGetter={eventStyleGetter}
					onSelectEvent={handleEventSelect}
				/>
			</div>

			<div className="mt-4 flex gap-4 flex-wrap">
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 bg-[#1DA1F2] rounded"></div>
					<span className="text-sm">Paid Social</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 bg-[#EA4335] rounded"></div>
					<span className="text-sm">Paid Search</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 bg-[#6B5B95] rounded"></div>
					<span className="text-sm">Email Marketing</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 bg-[#2E8B57] rounded"></div>
					<span className="text-sm">SEO</span>
				</div>
			</div>
		</div>
	);
}