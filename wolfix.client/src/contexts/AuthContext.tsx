"use client";

import { createContext, useState, useEffect, ReactNode, FC, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../lib/api";
import { useGlobalContext } from "./GlobalContext";
import { User, RoleRequestDto, TokenRequestDto, RegisterDto } from "../types/auth";

interface UserRolesResponse {
    accountId: string;
    email: string;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    fetchUserRoles: (credentials: RoleRequestDto) => Promise<string[] | null>;
    loginWithRole: (credentials: TokenRequestDto) => Promise<boolean>;
    register: (details: RegisterDto) => Promise<boolean>;
    logout: () => void;
    assignRole: (data: any) => Promise<boolean>; // Добавил заглушку для assignRole, так как она используется в ProfilePage
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

    const decodeAndNormalizeUser = (token: string): User | null => {
        try {
            const raw: any = jwtDecode(token);
            console.log("🔐 Raw Token Claims:", raw);

            // 1. ID Аккаунта (Identity)
            const accountId =
                raw.sub ||
                raw.id ||
                raw.accountId ||
                raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

            // 2. ВАЖНО: ID Профиля (Покупателя/Продавца) из токена
            // На твоем скриншоте поле называется "profile_id"
            const customerId = raw.profile_id || raw.customerId;

            // Роль
            const rawRole =
                raw.role ||
                raw.roles ||
                raw["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            const userRole = Array.isArray(rawRole) ? rawRole[0] : rawRole;

            // Email
            const userEmail = raw.email || raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

            if (!accountId) return null;

            const normalizedUser = {
                userId: accountId,      // Alias
                accountId: accountId,
                customerId: customerId, // Здесь теперь точно будет значение из profile_id
                email: userEmail,
                role: userRole,
                ...raw
            };

            console.log("✅ Normalized User:", normalizedUser);
            return normalizedUser;
        } catch (error) {
            console.error("Token decode error:", error);
            return null;
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            const userData = decodeAndNormalizeUser(token);
            if (userData) setUser(userData);
            else sessionStorage.removeItem("authToken");
        }
    }, []);

    const handleAuthSuccess = (token: string) => {
        sessionStorage.setItem("authToken", token);
        const userData = decodeAndNormalizeUser(token);
        if (userData) setUser(userData);
    };

    const fetchUserRoles = async (credentials: RoleRequestDto) => {
        setLoading(true);
        try {
            const response = await api.post<UserRolesResponse>('/api/account/roles', credentials);
            if (response.data && Array.isArray(response.data.roles)) {
                return response.data.roles;
            }
            return null;
        } catch (error: any) {
            console.error("Fetch roles error:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const loginWithRole = async (credentials: TokenRequestDto) => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/token', credentials);
            const token = typeof response.data === 'string' ? response.data : response.data?.token;

            if (token) {
                handleAuthSuccess(token);
                // showNotification("Вхід успішний!", "success"); // Можно раскомментировать
                return true;
            }
            return false;
        } catch (error: any) {
            console.error("Login error:", error);
            showNotification(error.response?.data?.message || "Помилка авторизації.", "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (details: RegisterDto) => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/customer/register', details);
            if (response.status === 200 || response.status === 201) {
                const loginSuccess = await loginWithRole({
                    email: details.email,
                    password: details.password,
                    role: "Customer"
                });
                return loginSuccess;
            }
            return false;
        } catch (error: any) {
            console.error("Registration error:", error);
            const msg = error.response?.data || "Не вдалося зареєструватися.";
            showNotification(typeof msg === 'string' ? msg : "Помилка реєстрації", "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Заглушка, так как endpoint для смены роли не был описан в последнем swagger,
    // но он используется в ProfilePage.client.tsx
    const assignRole = async (data: any) => {
        console.log("Assign role logic placeholder", data);
        return true;
    };

    const logout = () => {
        sessionStorage.removeItem("authToken");
        setUser(null);
        window.location.href = '/';
    };

    const value = { user, isAuthenticated: !!user, fetchUserRoles, loginWithRole, register, logout, assignRole };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};