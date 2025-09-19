"use client";

import { createContext, useState, useEffect, ReactNode, FC, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../lib/api";
import { useGlobalContext } from "./GlobalContext";
import { User, RoleRequestDto, TokenRequestDto, RegisterDto, ChangeFullNameDto, ChangeAddressDto, ChangeBirthDateDto, ChangePhoneNumberDto, UpdateProfileDto, RegisterSellerDto } from "../types/auth";

interface AssignRoleDto {
    userId: string;
    email: string;
    role: string;
}

interface SellerUpdateDtos {
    ChangeFullNameDto: { firstName: string; lastName: string; middleName: string; };
    ChangePhoneNumberDto: { phoneNumber: string; };
    ChangeAddressDto: { city: string; street: string; houseNumber: string; apartmentNumber: string; };
    ChangeBirthDateDto: { birthDate: string; };
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    logout: () => void;
    assignRole: (roleData: AssignRoleDto) => Promise<boolean>;
    fetchUserRoles: (credentials: RoleRequestDto) => Promise<string[] | null>;
    loginWithRole: (credentials: TokenRequestDto) => Promise<boolean>;
    registerAndSetRole: (details: RegisterDto) => Promise<boolean>;
    registerSeller: (details: RegisterSellerDto) => Promise<boolean>;
    updateUserFullName: (data: ChangeFullNameDto) => Promise<boolean>;
    updateUserAddress: (data: ChangeAddressDto) => Promise<boolean>;
    updateUserBirthDate: (data: ChangeBirthDateDto) => Promise<boolean>;
    updateUserPhoneNumber: (data: ChangePhoneNumberDto) => Promise<boolean>;
    updateUserProfile: (data: UpdateProfileDto) => Promise<boolean>;
    updateSellerFullName: (data: SellerUpdateDtos['ChangeFullNameDto']) => Promise<boolean>;
    updateSellerPhoneNumber: (data: SellerUpdateDtos['ChangePhoneNumberDto']) => Promise<boolean>;
    updateSellerAddress: (data: SellerUpdateDtos['ChangeAddressDto']) => Promise<boolean>;
    updateSellerBirthDate: (data: SellerUpdateDtos['ChangeBirthDateDto']) => Promise<boolean>;
}

interface DecodedToken {
    sub?: string;
    profile_id?: string;
    email: string;
    role?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
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
    const { loading, setLoading, showNotification } = useGlobalContext();

    const processToken = (token: string): User | null => {
        try {
            const decoded: DecodedToken = jwtDecode(token);
            const userId = decoded.profile_id || decoded.sub;
            const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;
            if (!userId || !userRole) return null;
            return {
                userId: userId,
                email: decoded.email,
                role: userRole,
                firstName: decoded.firstName || null,
                lastName: decoded.lastName || null,
                middleName: decoded.middleName || null,
                phoneNumber: decoded.phoneNumber || null,
                birthDate: decoded.birthDate || null,
                address: decoded.address || null,
            };
        } catch (error) { return null; }
    };

    const handleAuthSuccess = (token: string) => {
        const userForState = processToken(token);
        if (userForState) {
            sessionStorage.setItem("authToken", token);
            setUser(userForState);
            return true;
        }
        return false;
    };

    useEffect(() => {
        const token = sessionStorage.getItem("authToken");
        if (token) {
            handleAuthSuccess(token);
        }
    }, []);

    const logout = () => {
        sessionStorage.removeItem("authToken");
        setUser(null);
    };
    
    const fetchUserRoles = async (credentials: RoleRequestDto): Promise<string[] | null> => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/roles', credentials);
            return response.data;
        } catch (error) {
            return null;
        } finally {
            setLoading(false);
        }
    };
    
    const loginWithRole = async (credentials: TokenRequestDto): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/token', credentials);
            const token = response.data?.token || (typeof response.data === 'string' ? response.data : null);

            if (token) {
                showNotification("Вхід успішний!", "success");
                return handleAuthSuccess(token);
            }
            
            showNotification("Не вдалося отримати токен з відповіді.", "error");
            return false;
        } catch (error: any) {
            const message = error.response?.data?.title || error.response?.data || "Помилка входу. Перевірте дані.";
            showNotification(message, "error");
            return false;
        } finally {
            setLoading(false);
        }
    };
    
    const registerAndSetRole = async (details: RegisterDto): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/customer/register', details);
            if (response.data && response.data.token) {
                return handleAuthSuccess(response.data.token);
            }
            return false;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Не вдалося зареєструватися.";
            showNotification(errorMessage, "error");
            return false;
        } finally {
            setLoading(false);
        }
    };
    
    const registerSeller = async (details: RegisterSellerDto): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/seller/register', details);
            if (response.data && response.data.token) {
                showNotification("Реєстрація продавця успішна!", "success");
                return handleAuthSuccess(response.data.token);
            }
            return false;
        } catch (error: any) {
            showNotification(error.response?.data?.message || "Помилка реєстрації продавця.", "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const assignRole = async (roleData: AssignRoleDto): Promise<boolean> => {
        setLoading(true);
        try {
            const response = await api.post('/api/account/assign-role', roleData);
            showNotification("Роль успішно оновлено!", "success");
            if (response.data && response.data.token) {
               return handleAuthSuccess(response.data.token);
            }
            return true;
        } catch (error: any) {
            showNotification(error.response?.data?.message || "Не вдалося змінити роль.", "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateUserAndToken = async (endpoint: string, data: any): Promise<boolean> => {
        if (!user?.userId) return false;
        setLoading(true);
        try {
            const response = await api.patch(`/api/customers/${user.userId}/${endpoint}`, data);
            showNotification("Дані клієнта оновлено!", "success");
            if (response.data.token) return handleAuthSuccess(response.data.token);
            return true;
        } catch (error: any) {
            showNotification(error.response?.data?.message || "Не вдалося оновити дані клієнта", "error");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const updateSellerData = async (endpoint: string, data: any): Promise<boolean> => {
        if (!user?.userId) return false;
        setLoading(true);
        try {
            const response = await api.patch(`/api/sellers/${user.userId}/${endpoint}`, data);
            showNotification("Дані продавця оновлено!", "success");
            if (response.data && response.data.token) {
                return handleAuthSuccess(response.data.token);
            }
            return true;
        } catch (error: any) {
            showNotification(error.response?.data?.message || "Не вдалося оновити дані продавця", "error");
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

    const updateSellerFullName = (data: SellerUpdateDtos['ChangeFullNameDto']) => updateSellerData('full-name', data);
    const updateSellerPhoneNumber = (data: SellerUpdateDtos['ChangePhoneNumberDto']) => updateSellerData('phone-number', data);
    const updateSellerAddress = (data: SellerUpdateDtos['ChangeAddressDto']) => updateSellerData('address', data);
    const updateSellerBirthDate = (data: SellerUpdateDtos['ChangeBirthDateDto']) => updateSellerData('birth-date', data);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        loading,
        logout,
        assignRole,
        fetchUserRoles,
        loginWithRole,
        registerAndSetRole,
        registerSeller,
        updateUserFullName,
        updateUserAddress,
        updateUserBirthDate,
        updateUserPhoneNumber,
        updateUserProfile,
        updateSellerFullName,
        updateSellerPhoneNumber,
        updateSellerAddress,
        updateSellerBirthDate,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};