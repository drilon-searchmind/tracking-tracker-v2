"use client";

import { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

    return (
        <ModalContext.Provider value={{ isCampaignModalOpen, setIsCampaignModalOpen }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModalContext() {
    return useContext(ModalContext);
}