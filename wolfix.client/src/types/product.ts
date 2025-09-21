export interface ProductShortDto {
  id: string;
  title: string;
  averageRating: number | null;
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