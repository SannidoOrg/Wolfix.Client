export interface ProductShortDto {
  id: string;
  title: string;
  averageRating: number;
  price: number;
  finalPrice: number;
  bonuses: number;
  mainPhoto: string;
}

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    stock: number;
}