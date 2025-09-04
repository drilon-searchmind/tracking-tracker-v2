"use client";

import { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    
    const isAnyModalOpen = isCampaignModalOpen || isDetailsModalOpen;

    return (
        <ModalContext.Provider value={{ 
            isCampaignModalOpen, 
            setIsCampaignModalOpen,
            isDetailsModalOpen,
            setIsDetailsModalOpen,
            isAnyModalOpen
        }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModalContext() {
    return useContext(ModalContext);
}