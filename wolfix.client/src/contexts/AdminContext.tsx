"use client";

import { createContext, useState, ReactNode, FC, useContext, useCallback } from "react";
import api from "../lib/api";
import { SellerApplication } from "../types/auth";

interface AdminContextType {
    applications: SellerApplication[];
    loading: boolean;
    fetchApplications: () => Promise<void>;
    approveApplication: (id: string) => Promise<boolean>;
    rejectApplication: (id: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAdmin must be used within an AdminContextProvider");
    return context;
};

export const AdminContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [applications, setApplications] = useState<SellerApplication[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchApplications = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<SellerApplication[]>("/api/seller-applications");
            setApplications(response.data);
        } catch (error) {
            console.error("Не вдалося завантажити заявки", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const approveApplication = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        try {
            await api.patch(`/api/seller-applications/${id}/approve`);
            await fetchApplications();
            return true;
        } catch (error) {
            console.error("Не вдалося схвалити заявку", error);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchApplications]);

    const rejectApplication = useCallback(async (id: string): Promise<boolean> => {
        setLoading(true);
        try {
            await api.patch(`/api/seller-applications/${id}/reject`);
            await fetchApplications();
            return true;
        } catch (error) {
            console.error("Не вдалося відхилити заявку", error);
            return false;
        } finally {
            setLoading(false);
        }
    }, [fetchApplications]);

    return (
        <AdminContext.Provider value={{ applications, loading, fetchApplications, approveApplication, rejectApplication }}>
            {children}
        </AdminContext.Provider>
    );
};