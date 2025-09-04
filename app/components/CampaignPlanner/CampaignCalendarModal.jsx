"use client";

import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { useModalContext } from "@/app/contexts/CampaignModalContext";
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

export default function CampaignCalendarModal({
  isOpen,
  onClose,
  campaigns,
  customerId,
}) {
  const { setIsCalendarModalOpen } = useModalContext();
  const [view, setView] = useState("month");
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    setIsCalendarModalOpen(isOpen);
    
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
    
    return () => {
      setIsCalendarModalOpen(false);
    };
  }, [isOpen, campaigns, setIsCalendarModalOpen]);

  const handleClose = () => {
    setIsCalendarModalOpen(false);
    onClose();
  };
  
  const handleViewChange = (newView) => {
    setView(newView);
  };
  
  const eventStyleGetter = (event) => {
    // Set color based on campaign service
    let backgroundColor = '#3174ad'; // default blue
    
    switch(event.resource.service) {
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
    // You can implement logic to show campaign details
    // For example, you could open the details modal with the selected campaign
    const selectedCampaign = campaigns.find(campaign => campaign._id === event.id);
    if (selectedCampaign) {
      // Call a function passed from parent to open the details modal
      if (onViewCampaignDetails) {
        onViewCampaignDetails(selectedCampaign);
        // Optional: close the calendar modal
        handleClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 glassmorph-1 flex items-center justify-center z-[99999999]">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-6xl relative max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-blue-900">Campaign Calendar</h3>
          <div className="flex gap-4">
            <div className="flex rounded overflow-hidden">
              <button
                onClick={() => handleViewChange("month")}
                className={`px-4 py-2 text-sm ${
                  view === "month" ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => handleViewChange("week")}
                className={`px-4 py-2 text-sm ${
                  view === "week" ? "bg-blue-900 text-white" : "bg-gray-200 text-gray-700"
                }`}
              >
                Week
              </button>
            </div>
            <button
              onClick={handleClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto">
          <div className="h-[70vh]">
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
    </div>
  );
}