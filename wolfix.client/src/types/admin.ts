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

// --- Типы для заявок продавцов (Admin) ---
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

// --- Типы для Супер-Админа (Создание) ---
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

// --- Типы для Списков с Пагинацией (Super Admin) ---

// Общий интерфейс пагинации
export interface PaginationResult<T> {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    items: T[];
}

// Admin List Item
export interface BasicAdminDto {
    id: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    phoneNumber?: string;
}

// Support List Item
export interface SupportForAdminDto {
    id: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
}

// Seller List Item
export interface SellerForAdminDto {
    id: string;
    photoUrl?: string;
    fullName?: FullNameDto;
    phoneNumber?: string;
    address?: AddressDto;
    birthDate?: string; // format: date
    categories?: string[];
}

// --- Типы для Категорий (оставляем без изменений) ---
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

export interface CategoryAttributeDto {
    id: string;
    key: string;
}

export interface AddCategoryAttributeDto {
    key: string;
}

export interface CategoryVariantDto {
    id?: string;
    key: string;
}

export interface AddCategoryVariantDto {
    key: string;
}