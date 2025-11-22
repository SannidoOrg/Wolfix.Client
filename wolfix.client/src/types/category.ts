// src/types/category.ts

export interface CategoryDto {
    id: string;
    name: string;
    photoUrl?: string | null;
}

export interface CategoryFullDto {
    id: string;
    name: string;
    photoUrl: string | null;
}

export interface CategoryVariantDto {
    key: string; // id варианта или ключ
    value: string; // Название, например "iPhone 15"
}