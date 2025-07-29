import { ICategory, IProduct } from '../types';

export const fetchCategories = async (): Promise<ICategory[]> => {
  const response = await fetch('');
  return response.json();
};

export const fetchFeaturedProducts = async (): Promise<IProduct[]> => {
  const response = await fetch('');
  return response.json();
};