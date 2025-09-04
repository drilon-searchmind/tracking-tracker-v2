"use client";

import { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
    
    const isAnyModalOpen = isCampaignModalOpen || isDetailsModalOpen || isCalendarModalOpen;

    return (
        <ModalContext.Provider value={{ 
            isCampaignModalOpen, 
            setIsCampaignModalOpen,
            isDetailsModalOpen,
            setIsDetailsModalOpen,
            isCalendarModalOpen,
            setIsCalendarModalOpen,
            isAnyModalOpen
        }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModalContext() {
    return useContext(ModalContext);
}