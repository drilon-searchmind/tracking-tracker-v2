"use client";

import { createContext, useContext, useState } from 'react';

const ClickUpUsersContext = createContext();

export function ClickUpUsersProvider({ children }) {
    const [clickupUsers, setClickupUsers] = useState({});
    const [isClickupUsersLoaded, setIsClickupUsersLoaded] = useState(false);

    const updateClickupUsers = (users) => {
        console.log("Setting clickup users in context:", users);
        setClickupUsers(users || {});
        setIsClickupUsersLoaded(true);
    };

    return (
        <ClickUpUsersContext.Provider value={{
            clickupUsers,
            isClickupUsersLoaded,
            updateClickupUsers
        }}>
            {children}
        </ClickUpUsersContext.Provider>
    );
}

export function useClickUpUsers() {
    const context = useContext(ClickUpUsersContext);
    if (context === undefined) {
        throw new Error('useClickUpUsers must be used within a ClickUpUsersProvider');
    }
    return context;
}