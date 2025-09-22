export interface CartItemDto {
  id: string;
  productId: string;
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