// src/services/adminService.ts
import api from "../lib/api";
import { SellerApplicationDto } from "../types/admin";

export const adminService = {
    // Получение всех заявок
    getAllApplications: async (): Promise<SellerApplicationDto[]> => {
        const response = await api.get<SellerApplicationDto[]>("/api/seller-applications");
        return response.data;
    },

    // Одобрение заявки
    approveApplication: async (applicationId: string): Promise<void> => {
        await api.patch(`/api/seller-applications/${applicationId}/approve`);
    },

    // Отклонение заявки
    rejectApplication: async (applicationId: string): Promise<void> => {
        await api.patch(`/api/seller-applications/${applicationId}/reject`);
    },
};