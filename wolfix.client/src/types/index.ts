export interface ICategory {
  name: string;
  icon: string;
}

export interface IProduct {
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  imageUrl: string;
}

export interface ICartItem {
  productId: string;
  quantity: number;
}