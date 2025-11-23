export interface FavoriteItemDto {
    id: string;        // ID записи в избранном (для удаления)
    productId?: string; // ID самого товара (для корзины/ссылок). Если сервер не шлет, будем пробовать id.
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