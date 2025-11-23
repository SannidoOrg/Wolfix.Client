export interface FavoriteItemDto {
    id: string; // Это ID товара (Product ID), судя по логике удаления
    photoUrl: string | null;
    title: string;
    averageRating: number;
    price: number;
    finalPrice: number;
    bonuses: number;
    customerId: string;
}

export interface AddProductToFavoriteDto {
    customerId: string;
    productId: string;
}