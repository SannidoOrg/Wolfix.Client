"use client";

import { createContext, useState, useEffect, ReactNode, FC, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../lib/api";
import { useGlobalContext } from "./GlobalContext";
import { User, RoleRequestDto, TokenRequestDto, RegisterDto } from "../types/auth";

// Ответ от /api/account/roles
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

    // --- ЛОГИКА ПАРСИНГА ТОКЕНА ---
    const decodeAndNormalizeUser = (token: string): User | null => {
        try {
            const raw: any = jwtDecode(token);
            console.log("🔐 Decoded Token:", raw); // Лог для проверки в консоли

            // 1. Ищем Account ID (обычно это 'sub' или 'nameidentifier')
            const accountId =
                raw.sub ||
                raw.id ||
                raw.accountId ||
                raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

            // 2. Ищем Customer ID (Ваш кастомный клейм profile_id)
            const customerId =
                raw.profile_id ||  // <-- ГЛАВНОЕ ИСПРАВЛЕНИЕ
                raw.customerId ||
                raw.CustomerId ||
                raw.customer_id;

            // 3. Ищем Роль
            const rawRole =
                raw.role ||
                raw.roles ||
                raw["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            const userRole = Array.isArray(rawRole) ? rawRole[0] : rawRole;

            // 4. Ищем Email
            const userEmail =
                raw.email ||
                raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

            if (!accountId) return null;

            return {
                userId: accountId,      // Для совместимости
                accountId: accountId,   // Истинный ID аккаунта
                customerId: customerId, // ID профиля для запросов данных
                email: userEmail,
                role: userRole,
                ...raw                  // Сохраняем остальные поля
            };
        } catch (error) {
            console.error("Token decode error:", error);
            return null;
        }
    };

    // Проверка токена при старте приложения
    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            const userData = decodeAndNormalizeUser(token);
            if (userData) {
                setUser(userData);
            } else {
                // Если токен битый, удаляем его
                sessionStorage.removeItem("authToken");
            }
        }
    }, []);

    const handleAuthSuccess = (token: string) => {
        sessionStorage.setItem("authToken", token);
        const userData = decodeAndNormalizeUser(token);
        if (userData) {
            setUser(userData);
        }
    };

    // 1. Получение списка ролей (Шаг 1 входа)
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
            // Не показываем алерт здесь, чтобы ProfileModal мог сам обработать ошибку (показать красный текст)
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 2. Получение токена с конкретной ролью (Шаг 2 входа)
    const loginWithRole = async (credentials: TokenRequestDto) => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/token', credentials);

            // Бэкенд возвращает строку токена напрямую или объект { token: "..." }
            const token = typeof response.data === 'string' ? response.data : response.data?.token;

            if (token) {
                handleAuthSuccess(token);
                showNotification("Вхід успішний!", "success");
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

    // 3. Регистрация
    const register = async (details: RegisterDto) => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/customer/register', details);

            if (response.status === 200 || response.status === 201) {
                // После успешной регистрации пытаемся сразу войти как Customer
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

    const logout = () => {
        sessionStorage.removeItem("authToken");
        setUser(null);
        window.location.href = '/';
    };

    const value = {
        user,
        isAuthenticated: !!user,
        fetchUserRoles,
        loginWithRole,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};