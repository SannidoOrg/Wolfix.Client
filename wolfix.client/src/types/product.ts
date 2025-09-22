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
    title: string;
    description: string;
    price: number;
    categoryId: string;
    status: string;
    sellerId: string;
    attributesJson: string;
    media: File;
    contentType: string;
}