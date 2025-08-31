import { allProducts } from '../../../data/products';
import { getCategoryName } from '../utils';
import BrandPageClient from './BrandPageClient';

export default function BrandPage({ params }: { params: { category: string, brand: string } }) {
  const { category, brand } = params;
  
  const categoryName = getCategoryName(category);

  const categoryProducts = allProducts.filter(product => {
    return categoryName.startsWith(product.category);
  });

  return (
    <BrandPageClient 
      initialProducts={categoryProducts} 
      brand={brand} 
      categoryName={categoryName} 
    />
  );
}