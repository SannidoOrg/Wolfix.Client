// src/services/superAdminService.ts
import api from "../lib/api";
import {
    CreateAdminDto,
    CreateSupportDto,
    PaginationResult,
    BasicAdminDto,
    SupportForAdminDto,
    SellerForAdminDto
} from "../types/admin";

export const superAdminService = {
    // --- Admins ---
    addAdmin: async (data: CreateAdminDto): Promise<void> => {
        await api.post("/api/admins", data);
    },

    getAdminsPage: async (page: number = 1, pageSize: number = 10): Promise<PaginationResult<BasicAdminDto>> => {
        const response = await api.get(`/api/admins/page/${page}`, {
            params: { pageSize }
        });
        return response.data;
    },

    deleteAdmin: async (id: string): Promise<void> => {
        await api.delete(`/api/admins/${id}`);
    },

    // --- Support ---
    createSupport: async (data: CreateSupportDto): Promise<void> => {
        await api.post("/api/supports", data);
    },

    getSupportsPage: async (page: number = 1, pageSize: number = 10): Promise<PaginationResult<SupportForAdminDto>> => {
        const response = await api.get(`/api/supports/page/${page}`, {
            params: { pageSize }
        });
        return response.data;
    },

    deleteSupport: async (id: string): Promise<void> => {
        await api.delete(`/api/supports/${id}`);
    },

    // --- Sellers ---
    getSellersPage: async (page: number = 1, pageSize: number = 10): Promise<PaginationResult<SellerForAdminDto>> => {
        const response = await api.get(`/api/sellers/page/${page}`, {
            params: { pageSize }
        });
        return response.data;
    },

    deleteSeller: async (id: string): Promise<void> => {
        await api.delete(`/api/sellers/${id}`);
    }
};