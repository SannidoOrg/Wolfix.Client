"use client";

import { createContext, useState, ReactNode, FC, useContext } from "react";

interface NotificationState {
    message: string;
    type: 'success' | 'error';
}

interface GlobalContextType {
    loading: boolean;
    setLoading: (isLoading: boolean) => void;
    notification: NotificationState | null;
    showNotification: (message: string, type?: 'success' | 'error') => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within a GlobalContextProvider");
    }
    return context;
};

export const GlobalContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const value: GlobalContextType = {
        loading,
        setLoading,
        notification,
        showNotification,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};