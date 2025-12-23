// src/services/sellerService.ts
import api from "../lib/api";
import { SellerProfileDto, CreateProductDto, ProductShortDto, SellerCategoryDto, SellerOrderDto } from "../types/seller";

export const sellerService = {
    getProfile: async (id: string): Promise<SellerProfileDto> => {
        const response = await api.get(`/api/sellers/${id}`);
        return response.data;
    },

    getCategories: async (sellerId: string): Promise<SellerCategoryDto[]> => {
        const response = await api.get(`/api/sellers/${sellerId}/categories`);
        return response.data;
    },

    // Получаем продукты через категории (так как прямого метода get all products for seller нет в swagger)
    getProductsByCategory: async (sellerId: string, categoryId: string, page: number = 1): Promise<any> => {
        const response = await api.get(`/api/products/seller/${sellerId}/category/${categoryId}/page/${page}`);
        return response.data;
    },

    createProduct: async (data: CreateProductDto): Promise<void> => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        formData.append("categoryId", data.categoryId);
        // formData.append("sellerId", ...); // Обычно берется из токена или передается
        if (data.media) formData.append("media", data.media);
        if (data.attributesJson) formData.append("attributesJson", data.attributesJson);

        await api.post("/api/products", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    deleteProduct: async (productId: string): Promise<void> => {
        await api.delete(`/api/products/${productId}`);
    },

    getOrders: async (sellerId: string): Promise<SellerOrderDto[]> => {
        const response = await api.get(`/api/orders/sellers/${sellerId}`);
        return response.data;
    }
};