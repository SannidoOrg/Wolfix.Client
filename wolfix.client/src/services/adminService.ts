// src/services/adminService.ts
import api from "../lib/api";
import {
    SellerApplicationDto,
    AddParentCategoryDto,
    ChangeParentCategoryDto,
    AddChildCategoryDto,
    ChangeChildCategoryDto,
    AddCategoryAttributeDto,
    AddCategoryVariantDto,
    ParentCategoryDto,
    ChildCategoryDto,
    CategoryAttributeDto
} from "../types/admin";

export const adminService = {
    // --- Заявки продавцов ---
    getAllApplications: async (): Promise<SellerApplicationDto[]> => {
        const response = await api.get("/api/seller-applications");
        return response.data;
    },

    approveApplication: async (id: string): Promise<void> => {
        await api.patch(`/api/seller-applications/${id}/approve`);
    },

    rejectApplication: async (id: string): Promise<void> => {
        await api.patch(`/api/seller-applications/${id}/reject`);
    },

    // --- Категории (Parent) ---
    getAllParentCategories: async (): Promise<ParentCategoryDto[]> => {
        const response = await api.get("/api/categories/parent?withCaching=false");
        return response.data;
    },

    addParentCategory: async (data: AddParentCategoryDto): Promise<void> => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.description) formData.append("description", data.description);
        if (data.photo) formData.append("photo", data.photo);

        await api.post("/api/categories", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    changeParentCategory: async (id: string, data: ChangeParentCategoryDto): Promise<void> => {
        await api.patch(`/api/categories/${id}`, data);
    },

    deleteCategory: async (id: string): Promise<void> => {
        await api.delete(`/api/categories/${id}`);
    },

    // --- Категории (Child) ---
    getChildCategoriesByParent: async (parentId: string): Promise<ChildCategoryDto[]> => {
        const response = await api.get(`/api/categories/child/${parentId}?withCaching=false`);
        return response.data;
    },

    addChildCategory: async (parentId: string, data: AddChildCategoryDto): Promise<void> => {
        const formData = new FormData();
        if (data.name) formData.append("name", data.name);
        if (data.description) formData.append("description", data.description);
        if (data.photo) formData.append("photo", data.photo);

        // Массивы ключей атрибутов и вариантов
        if (data.attributeKeys) {
            data.attributeKeys.forEach(key => formData.append("attributeKeys", key));
        }
        if (data.variantKeys) {
            data.variantKeys.forEach(key => formData.append("variantKeys", key));
        }

        await api.post(`/api/categories/${parentId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    changeChildCategory: async (childId: string, data: ChangeChildCategoryDto): Promise<void> => {
        await api.patch(`/api/categories/child/${childId}`, data);
    },

    // --- Атрибуты и Варианты ---
    getAttributesByChildCategory: async (childId: string): Promise<CategoryAttributeDto[]> => {
        const response = await api.get(`/api/categories/child/${childId}/attributes`);
        return response.data;
    },

    // Примечание: Эндпоинта Get Variants by childId в swagger-5.json нет явного,
    // но есть POST/DELETE. Обычно варианты приходят вместе с инфо о категории или отдельным get.
    // Если его нет, мы можем только добавлять/удалять "вслепую" или нужно уточнить API.
    // Пока реализуем методы действия.

    addAttributeToChildCategory: async (childId: string, data: AddCategoryAttributeDto): Promise<void> => {
        await api.post(`/api/categories/child/${childId}/attributes`, data);
    },

    deleteAttribute: async (childId: string, attributeId: string): Promise<void> => {
        await api.delete(`/api/categories/child/${childId}/attributes/${attributeId}`);
    },

    addVariantToChildCategory: async (childId: string, data: AddCategoryVariantDto): Promise<void> => {
        await api.post(`/api/categories/child/${childId}/variants`, data);
    },

    deleteVariant: async (childId: string, variantId: string): Promise<void> => {
        await api.delete(`/api/categories/child/${childId}/variants/${variantId}`);
    }
};