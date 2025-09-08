export interface FavoriteItemDto {
  id: string;
  photoUrl: string;
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