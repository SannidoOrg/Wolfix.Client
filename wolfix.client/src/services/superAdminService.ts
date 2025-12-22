// src/services/superAdminService.ts
import api from "../lib/api";
import { CreateAdminDto, CreateSupportDto } from "../types/admin";

export const superAdminService = {
    addAdmin: async (data: CreateAdminDto): Promise<void> => {
        await api.post("/api/admins", data);
    },

    createSupport: async (data: CreateSupportDto): Promise<void> => {
        await api.post("/api/supports", data);
    }
};