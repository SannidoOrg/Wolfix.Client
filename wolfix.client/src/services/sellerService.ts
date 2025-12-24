import api from "../lib/api";
import {
    SellerProfileDto,
    SellerCategoryDto,
    SellerOrderDto,
    ChangeFullNameDto,
    ChangePhoneNumberDto,
    ChangeAddressDto,
    ChangeBirthDateDto,
    ChangeEmailDto,
    ChangePasswordDto
} from "../types/seller";

export const sellerService = {
    // Получение профиля (используем точный URL из Swagger)
    getSeller: async (sellerId: string): Promise<SellerProfileDto> => {
        const response = await api.get<SellerProfileDto>(`/api/sellers/${sellerId}`);
        return response.data;
    },

    getCategories: async (sellerId: string): Promise<SellerCategoryDto[]> => {
        const response = await api.get<SellerCategoryDto[]>(`/api/sellers/${sellerId}/categories`);
        return response.data;
    },

    getProductsByCategory: async (sellerId: string, categoryId: string, page: number = 1) => {
        const response = await api.get(`/api/products/seller/${sellerId}/category/${categoryId}/page/${page}`);
        return response.data;
    },

    deleteProduct: async (productId: string): Promise<void> => {
        await api.delete(`/api/products/${productId}`);
    },

    // Заказы (исправлен URL /api/orders/sellers/{sellerId})
    getOrders: async (sellerId: string): Promise<SellerOrderDto[]> => {
        const response = await api.get<SellerOrderDto[]>(`/api/orders/sellers/${sellerId}`);
        return response.data;
    },

    // --- PATCH методы для профиля продавца ---

    updateFullName: async (sellerId: string, data: ChangeFullNameDto) => {
        await api.patch(`/api/sellers/${sellerId}/full-name`, data);
    },

    updatePhoneNumber: async (sellerId: string, data: ChangePhoneNumberDto) => {
        await api.patch(`/api/sellers/${sellerId}/phone-number`, data);
    },

    updateAddress: async (sellerId: string, data: ChangeAddressDto) => {
        await api.patch(`/api/sellers/${sellerId}/address`, data);
    },

    updateBirthDate: async (sellerId: string, data: ChangeBirthDateDto) => {
        await api.patch(`/api/sellers/${sellerId}/birth-date`, data);
    },

    // --- PATCH методы для аккаунта (Email, Password) ---

    updateEmail: async (accountId: string, data: ChangeEmailDto) => {
        await api.patch(`/api/account/${accountId}/email`, data);
    },

    updatePassword: async (accountId: string, data: ChangePasswordDto) => {
        await api.patch(`/api/account/${accountId}/password`, data);
    }
};