"use client";

import { createContext, useState, useEffect, ReactNode, FC, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../lib/api";
import { useGlobalContext } from "./GlobalContext";
import { User, RoleRequestDto, TokenRequestDto, RegisterDto, ChangeFullNameDto, ChangeAddressDto, ChangeBirthDateDto, ChangePhoneNumberDto, UpdateProfileDto, RegisterSellerDto } from "../types/auth";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    logout: () => void;
    fetchUserRoles: (credentials: RoleRequestDto) => Promise<string[] | null>;
    loginWithRole: (credentials: TokenRequestDto) => Promise<boolean>;
    registerAndSetRole: (details: RegisterDto) => Promise<boolean>;
    registerSeller: (details: RegisterSellerDto) => Promise<boolean>;
    updateUserFullName: (data: ChangeFullNameDto) => Promise<boolean>;
    updateUserAddress: (data: ChangeAddressDto) => Promise<boolean>;
    updateUserBirthDate: (data: ChangeBirthDateDto) => Promise<boolean>;
    updateUserPhoneNumber: (data: ChangePhoneNumberDto) => Promise<boolean>;
    updateUserProfile: (data: UpdateProfileDto) => Promise<boolean>;
}

interface DecodedToken {
    sub?: string;
    nameid?: string;
    userId?: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    phoneNumber?: string;
    birthDate?: string;
    address?: any; 
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

    const processToken = (token: string): User | null => {
        try {
            const decoded: DecodedToken = jwtDecode(token);
            const userId = decoded.sub || decoded.nameid || decoded.userId;
            if (!userId) return null;
            return {
                userId: userId,
                email: decoded.email,
                role: decoded.role,
                firstName: decoded.firstName || null,
                lastName: decoded.lastName || null,
                middleName: decoded.middleName || null,
                phoneNumber: decoded.phoneNumber || null,
                birthDate: decoded.birthDate || null,
                address: decoded.address || null,
            };
        } catch (error) {
            return null;
        }
    };

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            const userFromToken = processToken(token);
            if (userFromToken) setUser(userFromToken);
            else sessionStorage.removeItem("authToken");
        }
    }, []);

    const handleAuthSuccess = (token: string) => {
        const userForState = processToken(token);
        if (userForState) {
            sessionStorage.setItem("authToken", token);
            setUser(userForState);
            return true;
        }
        return false;
    };

    const updateUserAndToken = async (endpoint: string, data: any): Promise<boolean> => {
        if (!user?.userId) {
            showNotification("ID користувача не знайдено, спробуйте увійти знову.", "error");
            return false;
        }
        setLoading(true);
        try {
            const response = await api.patch(`/api/customers/${user.userId}/${endpoint}`, data);
            showNotification("Дані успішно оновлено!", "success");
            if (response.data.token) return handleAuthSuccess(response.data.token);
            return true;
        } catch (error: any) {
            showNotification(error.response?.data?.message || "Не вдалося оновити дані", "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateUserProfile = (data: UpdateProfileDto) => updateUserAndToken('profile', data);
    const updateUserFullName = (data: ChangeFullNameDto) => updateUserAndToken('full-name', data);
    const updateUserAddress = (data: ChangeAddressDto) => updateUserAndToken('address', data);
    const updateUserBirthDate = (data: ChangeBirthDateDto) => updateUserAndToken('birth-date', data);
    const updateUserPhoneNumber = (data: ChangePhoneNumberDto) => updateUserAndToken('phone-number', data);

    const fetchUserRoles = async (credentials: RoleRequestDto): Promise<string[] | null> => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/customer/roles', credentials);
            return response.data?.roles || null;
        } catch (error: any) {
            showNotification(error.response?.data?.message || "Неправильний email або пароль", "error");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const loginWithRole = async (credentials: TokenRequestDto): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/customer/token', credentials);
            if (response.data && typeof response.data === 'string') return handleAuthSuccess(response.data);
            return false;
        } catch (error: any) {
             showNotification(error.response?.data?.message || "Не вдалося увійти з обраною роллю", "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const registerAndSetRole = async (details: RegisterDto): Promise<boolean> => {
        setLoading(true);
        try {
            await api.post('/api/account/customer/register', details);
            return await loginWithRole({ email: details.email, password: details.password, role: "Customer" });
        } catch (error: any) {
            showNotification(error.response?.data?.message || "Не вдалося завершити реєстрацію.", "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const registerSeller = async (details: RegisterSellerDto): Promise<boolean> => {
        setLoading(true);
        const formData = new FormData();
        
        (Object.keys(details) as Array<keyof RegisterSellerDto>).forEach(key => {
            const value = details[key];
            if (key === 'document' && value instanceof File) {
                formData.append(key, value);
            } else if (value !== undefined && value !== null && value !== '') {
                formData.append(key, String(value));
            }
        });
        
        try {
            await api.post('/api/account/seller/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            showNotification("Реєстрація успішна! Тепер ви можете увійти.", "success");
            return await loginWithRole({ email: details.email, password: details.password, role: "Seller" });
        } catch (error: any) {
            showNotification(error.response?.data?.message || "Не вдалося зареєструвати продавця.", "error");
            return false;
        } finally {
            setLoading(false);
        }
    };
    
    const logout = () => {
        sessionStorage.removeItem("authToken");
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        logout,
        fetchUserRoles,
        loginWithRole,
        registerAndSetRole,
        registerSeller,
        updateUserFullName,
        updateUserAddress,
        updateUserBirthDate,
        updateUserPhoneNumber,
        updateUserProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};