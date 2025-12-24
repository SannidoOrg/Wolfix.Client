// src/types/seller.ts

// --- Существующие типы ---
export interface ProductShortDto {
    id: string;
    title: string;
    price: number;
    mainPhoto?: string;
}

export interface SellerCategoryDto {
    id: string;
    categoryId: string; // Важно для запросов
    name: string;
}

// Исправлено согласно Swagger SellerOrderItemDto
export interface SellerOrderDto {
    id: string;
    title: string;
    price: number;
    quantity: number;
    photoUrl?: string;
}

// --- Типы для профиля ---

export interface AddressDto {
    city: string;
    street: string;
    houseNumber: number;
    apartmentNumber?: number;
}

export interface FullNameDto {
    firstName: string;
    lastName: string;
    middleName?: string;
}

export interface SellerProfileDto {
    id: string;
    photoUrl?: string;
    fullName: FullNameDto;
    phoneNumber?: string;
    address?: AddressDto;
    birthDate?: string; // date string
    // Email обычно приходит в identity, но может быть и тут если бек возвращает
}

// --- DTO для обновлений (PATCH) ---

export interface ChangeFullNameDto {
    firstName: string;
    lastName: string;
    middleName?: string;
}

export interface ChangePhoneNumberDto {
    phoneNumber: string;
}

export interface ChangeAddressDto {
    city: string;
    street: string;
    houseNumber: number;
    apartmentNumber?: number;
}

export interface ChangeBirthDateDto {
    birthDate: string; // YYYY-MM-DD
}

export interface ChangeEmailDto {
    email: string;
}

export interface ChangePasswordDto {
    currentPassword?: string;
    newPassword?: string;
}