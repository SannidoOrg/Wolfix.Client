// src/types/product.ts

// --- Для списков (ProductList, ProductCard, Search) ---
export interface ProductShortDto {
    id: string;
    title: string;
    averageRating: number;
    price: number;
    finalPrice: number;
    bonuses: number;
    mainPhoto: string | null;
}

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    stock: number;
}

// --- Для детальной страницы (ProductPage) ---

export interface ProductMediaDto {
    url: string;
    contentType: string;
    isMain: boolean;
}

export interface ProductAttributeDto {
    key: string;
    value: string;
}

export interface ProductVariantDto {
    key: string;
    value: string;
}

export interface ProductSellerDto {
    sellerId: string;
    sellerFullName: string;
    sellerPhotoUrl: string | null;
}

export interface ProductFullDto {
    id: string;
    title: string;
    description: string;
    price: number;
    finalPrice: number;
    status: string;
    bonuses: number;
    averageRating: number;
    variants: ProductVariantDto[];
    categories: { categoryId: string; categoryName: string; order: number }[];
    medias: ProductMediaDto[];
    attributes: ProductAttributeDto[];
    seller: ProductSellerDto;
}