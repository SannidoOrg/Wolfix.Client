// src/types/admin.ts

// --- Общие типы ---
export interface FullNameDto {
    firstName?: string;
    lastName?: string;
    middleName?: string;
}

export interface PhoneNumberDto {
    value?: string;
}

export interface AddressDto {
    city?: string;
    street?: string;
    houseNumber?: number;
    apartmentNumber?: number;
}

export interface BirthDateDto {
    value?: string;
}

// --- Типы для заявок продавцов ---
export interface SellerProfileDataDto {
    fullName?: FullNameDto;
    phoneNumber?: PhoneNumberDto;
    address?: AddressDto;
    birthDate?: BirthDateDto;
}

export interface SellerApplicationDto {
    id: string;
    categoryName?: string;
    documentUrl?: string;
    sellerProfileData?: SellerProfileDataDto;
}

// --- Типы для Супер-Админа (Создание пользователей) ---
export interface CreateAdminDto {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    phoneNumber?: string;
}

export interface CreateSupportDto {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
}

// --- Типы для Категорий ---

// Parent Category
export interface ParentCategoryDto {
    id: string;
    name: string;
    description?: string;
    photoUrl?: string | null;
}

export interface AddParentCategoryDto {
    name: string;
    description?: string;
    photo?: File | null;
}

export interface ChangeParentCategoryDto {
    name?: string;
    description?: string;
}

// Child Category
export interface ChildCategoryDto {
    id: string;
    name: string;
    description?: string;
    photoUrl?: string | null;
}

export interface AddChildCategoryDto {
    name: string;
    description?: string;
    photo?: File | null;
    attributeKeys?: string[];
    variantKeys?: string[];
}

export interface ChangeChildCategoryDto {
    name?: string;
    description?: string;
}

// Attributes & Variants
export interface CategoryAttributeDto {
    id: string;
    key: string;
}

export interface AddCategoryAttributeDto {
    key: string;
}

export interface CategoryVariantDto {
    id?: string; // В сваггере может не быть ID при get, но он нужен для удаления. Проверим использование.
    // Примечание: В swagger get variants возвращает список строк или объектов?
    // Swagger: /api/categories/child/{childId}/attributes -> CategoryAttributeDto (id, key)
    // А вот variants эндпоинт на GET отсутствует в явном виде списка, но есть POST и DELETE.
    // Предположим, что мы получаем их вместе с child категорией или отдельным запросом, если он появится.
    // В данном случае реализуем добавление/удаление.
    key: string;
}

export interface AddCategoryVariantDto {
    key: string;
}