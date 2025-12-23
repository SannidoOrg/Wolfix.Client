// src/types/seller.ts

export interface SellerProfileDto {
    id: string;
    fullName: {
        firstName?: string;
        lastName?: string;
        middleName?: string;
    };
    phoneNumber?: string;
    address?: {
        city?: string;
        street?: string;
    };
}

export interface ProductShortDto {
    id: string;
    title: string;
    price: number;
    mainPhoto?: string;
    status?: string;
}

export interface CreateProductDto {
    title: string;
    description: string;
    price: number;
    categoryId: string;
    attributesJson?: string;
    media?: File;
}

export interface SellerCategoryDto {
    categoryId: string;
    name: string;
}

export interface SellerOrderDto {
    id: string;
    title: string; // Product Title
    price: number;
    quantity: number;
    photoUrl?: string;
}