"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import isSameDay from "date-fns/isSameDay";
import isWithinInterval from "date-fns/isWithinInterval";
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

	const colors = {
		primary: "#3B82F6",    // Bright blue
		hue1: "#10B981",       // Green
		hue2: "#F59E0B",       // Amber/Orange
		hue3: "#8B5CF6",       // Purple
		hue4: "#EC4899",       // Pink
	};

	useEffect(() => {
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
		let backgroundColor = colors.primary;

		switch (event.resource.service) {
			case 'Paid Social':
				backgroundColor = colors.hue1;
				break;
			case 'Paid Search':
				backgroundColor = colors.hue2;
				break;
			case 'Email Marketing':
				backgroundColor = colors.hue3;
				break;
			case 'SEO':
				backgroundColor = colors.hue4;
				break;
		}

		return {
			style: {
				backgroundColor,
				borderRadius: '4px',
				opacity: 0.9,
				color: 'white',
				border: 'none',
				display: 'block',
				fontWeight: '500',
				fontSize: '13px',
				boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
				padding: '2px 5px'
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

	// Custom month view that shows all events
	const CustomMonthView = () => {
		const [currentDate, setCurrentDate] = useState(new Date());
		
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);
		const startDate = startOfWeek(monthStart);
		const endDate = addDays(startOfWeek(addDays(monthEnd, 6)), 6);

		const dateFormat = "d";
		const rows = [];
		let days = [];
		let day = startDate;

		// Create calendar grid
		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				const cloneDay = day;
				const dayEvents = events.filter(event => {
					const eventStart = new Date(event.start);
					const eventEnd = new Date(event.end);
					return isWithinInterval(cloneDay, { start: eventStart, end: eventEnd });
				});

				const isToday = isSameDay(day, new Date());
				const isCurrentMonth = day.getMonth() === currentDate.getMonth();

				days.push(
					<div
						key={day.toString()}
						className={`border border-gray-200 p-2 ${
							isCurrentMonth ? 'bg-white' : 'bg-gray-50'
						} ${isToday ? 'bg-blue-50' : ''}`}
						style={{ minHeight: Math.max(120, dayEvents.length * 25 + 40) + 'px' }}
					>
						<div className={`text-sm font-medium mb-2 ${
							isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
						} ${isToday ? 'text-blue-600' : ''}`}>
							{format(cloneDay, dateFormat)}
						</div>
						<div className="space-y-1">
							{dayEvents.map((event) => {
								const style = eventStyleGetter(event).style;
								return (
									<div
										key={event.id}
										onClick={() => handleEventSelect(event)}
										className="cursor-pointer text-xs p-1 rounded truncate"
										style={style}
										title={event.title}
									>
										{event.title}
									</div>
								);
							})}
						</div>
					</div>
				);
				day = addDays(day, 1);
			}
			rows.push(
				<div key={day.toString()} className="grid grid-cols-7">
					{days}
				</div>
			);
			days = [];
		}

		const nextMonth = () => {
			setCurrentDate(addDays(monthStart, 32));
		};

		const prevMonth = () => {
			setCurrentDate(addDays(monthStart, -1));
		};

		return (
			<div className="h-full flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<button
						onClick={prevMonth}
						className="px-4 py-3 bg-black text-white hover:bg-gray-800 rounded-lg text-lg font-bold transition-colors"
					>
						‹
					</button>
					<h2 className="text-lg font-semibold">
						{format(currentDate, 'MMMM yyyy')}
					</h2>
					<button
						onClick={nextMonth}
						className="px-4 py-3 bg-black text-white hover:bg-gray-800 rounded-lg text-lg font-bold transition-colors"
					>
						›
					</button>
				</div>

				{/* Day headers */}
				<div className="grid grid-cols-7 border-b">
					{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
						<div key={day} className="p-3 text-center font-medium text-gray-600 bg-gray-50">
							{day}
						</div>
					))}
				</div>

				{/* Calendar grid */}
				<div className="flex-1 overflow-auto">
					{rows}
				</div>
			</div>
		);
	};

	const calendarCustomizations = {
		dayPropGetter: (date) => {
			const today = new Date();
			return {
				style: {
					backgroundColor: date.getDate() === today.getDate() &&
						date.getMonth() === today.getMonth() &&
						date.getFullYear() === today.getFullYear()
						? '#f8fafc' : 'inherit'
				}
			};
		},
		dayHeaderFormat: (date) => {
			return format(date, 'EEE');
		}
	};

	return (
		<div className="bg-white border border-[var(--color-light-natural)] rounded-lg shadow-solid-l overflow-hidden">
			<div className="flex justify-between items-center p-6 border-b border-[var(--color-light-natural)] bg-[var(--color-natural)] hidden">
				<div className="flex gap-2 hidden">
					<button
						onClick={() => handleViewChange("month")}
						className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${view === "month"
								? "bg-[var(--color-dark-green)] text-white"
								: "bg-white text-[var(--color-green)] border border-[var(--color-dark-natural)] hover:bg-[var(--color-natural)]"
							}`}
					>
						Month
					</button>
					<button
						onClick={() => handleViewChange("week")}
						className={`px-4 py-2 text-sm rounded-lg transition-colors font-medium ${view === "week"
								? "bg-[var(--color-dark-green)] text-white"
								: "bg-white text-[var(--color-green)] border border-[var(--color-dark-natural)] hover:bg-[var(--color-natural)]"
							}`}
					>
						Week
					</button>
				</div>
			</div>

			<div className="h-[600px] px-6 pt-4">
				{view === "month" ? (
					<CustomMonthView />
				) : (
					<Calendar
						localizer={localizer}
						events={events}
						startAccessor="start"
						endAccessor="end"
						style={{ height: "100%" }}
						view={view}
						onView={handleViewChange}
						views={["week"]}
						eventPropGetter={eventStyleGetter}
						onSelectEvent={handleEventSelect}
						dayPropGetter={calendarCustomizations.dayPropGetter}
						formats={{
							dayHeaderFormat: date => format(date, 'EEE')
						}}
						popup
						className="campaign-calendar"
					/>
				)}
			</div>

			<div className="p-6 border-t border-[var(--color-light-natural)] bg-[var(--color-natural)] mt-4">
				<p className="text-sm font-medium text-[var(--color-green)] mb-3">Campaign Types</p>
				<div className="flex gap-6 flex-wrap">
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded-sm" style={{ backgroundColor: colors.hue1 }}></div>
						<span className="text-sm text-[var(--color-dark-green)]">Paid Social</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded-sm" style={{ backgroundColor: colors.hue2 }}></div>
						<span className="text-sm text-[var(--color-dark-green)]">Paid Search</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded-sm" style={{ backgroundColor: colors.hue3 }}></div>
						<span className="text-sm text-[var(--color-dark-green)]">Email Marketing</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="w-4 h-4 rounded-sm" style={{ backgroundColor: colors.hue4 }}></div>
						<span className="text-sm text-[var(--color-dark-green)]">SEO</span>
					</div>
				</div>
			</div>
		</div>
	);
}