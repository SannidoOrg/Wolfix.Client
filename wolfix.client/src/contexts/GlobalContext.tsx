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
    showModal: boolean;
    OnShowModal: (mContent: ReactNode, mTitle?: string) => void;
    OnHideModal: () => void;
    modalContent: ReactNode;
    modalTitle: string;
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
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ReactNode>(null);
    const [modalTitle, setModalTitle] = useState<string>("");

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const OnShowModal = (mContent: ReactNode, mTitle: string = "") => {
        setModalTitle(mTitle);
        setModalContent(mContent);
        setShowModal(true);
    };

    const OnHideModal = () => {
        setModalContent(null);
        setShowModal(false);
    };

    const value: GlobalContextType = {
        loading,
        setLoading,
        notification,
        showNotification,
        showModal,
        OnShowModal,
        OnHideModal,
        modalContent,
        modalTitle,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};