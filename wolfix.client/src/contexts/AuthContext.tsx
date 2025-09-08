"use client";

import { createContext, useState, useEffect, ReactNode, FC, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { AxiosResponse } from "axios";
import api from "../lib/api";
import { useGlobalContext } from "./GlobalContext";
import { User, RoleRequestDto, TokenRequestDto, RegisterDto } from "../types/auth";

interface AssignRoleDto {
    userId: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    fetchUserRoles: (credentials: RoleRequestDto) => Promise<string[] | null>;
    loginWithRole: (credentials: TokenRequestDto) => Promise<boolean>;
    registerAndSetRole: (details: RegisterDto) => Promise<boolean>;
    logout: () => void;
    assignRole: (roleData: AssignRoleDto) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthContextProvider");
    return context;
};

export const AuthContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const { setLoading, showNotification } = useGlobalContext();

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            try {
                const decodedUser: User = jwtDecode(token);
                setUser(decodedUser);
            } catch (error) {
                sessionStorage.removeItem("authToken");
            }
        }
    }, []);

    const handleAuthSuccess = (token: string) => {
        sessionStorage.setItem("authToken", token);
        const decodedUser: User = jwtDecode(token);
        setUser(decodedUser);
    };
    
    const fetchUserRoles = async (credentials: RoleRequestDto) => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/customer/roles', credentials);
            if (response.data && Array.isArray(response.data.roles)) {
                return response.data.roles;
            }
            return null;
        } catch (error: any) {
            showNotification(error.response?.data?.message || "Неправильний email або пароль", "error");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const loginWithRole = async (credentials: TokenRequestDto) => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/customer/token', credentials);
            if (response.data && typeof response.data === 'string') {
                handleAuthSuccess(response.data);
                return true;
            }
            return false;
        } catch (error: any) {
             showNotification(error.response?.data?.message || "Не вдалося увійти з обраною роллю", "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        sessionStorage.removeItem("authToken");
        setUser(null);
    };
    
    const registerAndSetRole = async (details: RegisterDto) => {
        setLoading(true);
        try {
            const registerResponse = await api.post('/api/account/customer/register', details);
            if (registerResponse.status !== 200 && registerResponse.status !== 201) {
                throw new Error("Помилка реєстрації");
            }
            
            await assignRole({ userId: "", email: details.email, role: "Customer" });

            const success = await loginWithRole({ email: details.email, role: "Customer" });
            
            return success;
        } catch (error: any) {
            showNotification(error.response?.data?.message || "Не вдалося завершити реєстрацію.", "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const assignRole = async (roleData: AssignRoleDto) => {
       try {
            const response = await api.post('/api/account/customer/roles', roleData);
            if (response.data.token) {
                handleAuthSuccess(response.data.token);
                showNotification("Ваша роль успішно оновлена!", "success");
                return true;
            }
            return false;
        } catch (error: any) {
            showNotification("Помилка при оновленні ролі.", "error");
            return false;
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        fetchUserRoles,
        loginWithRole,
        registerAndSetRole,
        logout,
        assignRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};