export interface CartItemDto {
    id: string;
    productId: string;
    sellerId: string; // Добавлено новое поле согласно изменениям на бэкенде
    photoUrl: string;
    title: string;
    price: number;
}

export interface CustomerCartItemsDto {
    items: CartItemDto[];
    customerId: string;
    bonusesAmount: number;
    totalCartPriceWithoutBonuses: number;
}

export interface AddProductToCartDto {
    customerId: string;
    productId: string;
}