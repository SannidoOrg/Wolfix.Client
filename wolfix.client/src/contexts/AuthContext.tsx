"use client";

import { createContext, useState, useEffect, ReactNode, FC, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { AxiosResponse } from "axios";
import api from "../lib/api";
import { useGlobalContext } from "./GlobalContext";
import { User, LoginDto, RegisterDto } from "../types/auth";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (credentials: LoginDto) => Promise<AxiosResponse>;
    register: (details: RegisterDto) => Promise<AxiosResponse>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthContextProvider");
    return context;
};

export const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const { setLoading } = useGlobalContext();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decodedUser: User = jwtDecode(token);
                setUser(decodedUser);
            } catch (error) {
                localStorage.removeItem("authToken");
            }
        }
    }, []);

    const handleAuthSuccess = (token: string) => {
        localStorage.setItem("authToken", token);
        const decodedUser: User = jwtDecode(token);
        setUser(decodedUser);
    };

    const login = async (credentials: LoginDto) => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/customer/token', credentials);
            if (response.data.token) {
                handleAuthSuccess(response.data.token);
            }
            return response;
        } catch (error: any) {
            return error.response;
        } finally {
            setLoading(false);
        }
    };

    const register = async (details: RegisterDto) => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/customer/register', details);
            return response;
        } catch (error: any) {
            return error.response;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};