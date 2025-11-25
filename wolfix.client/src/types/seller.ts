// src/types/seller.ts

export interface CreateSellerApplicationDto {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    phoneNumber?: string;
    city?: string;
    street?: string;
    houseNumber: number;
    apartmentNumber?: number;
    birthDate: string; // date format YYYY-MM-DD
    categoryId: string; // uuid
    categoryName?: string;
    document: File | null;
}

export interface CategorySimpleDto {
    id: string;
    name: string;
}