"use client";

import { createContext, useState, ReactNode, FC } from "react";
import axios, { AxiosResponse } from "axios";

interface GlobalContextType {
    sendRequest: (
        endpoint: string,
        method?: string,
        body?: any,
        headers?: Record<string, string>
    ) => Promise<AxiosResponse>;
    loading: boolean;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

const GlobalContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState<boolean>(false);

    async function sendRequest(
        endpoint: string,
        method: string = "GET",
        body: any = null,
        headers: Record<string, string> = {}
    ): Promise<AxiosResponse> {
        setLoading(true);
        try {
            const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
            const response = await axios({
                url: fullUrl,
                method,
                data: body,
                headers,
            });
            return response;
        } catch (error: any) {
            if (error.response) {
                return error.response;
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const value: GlobalContextType = {
        sendRequest,
        loading,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

export { GlobalContextProvider, GlobalContext };