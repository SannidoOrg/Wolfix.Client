import { allProducts } from '../../../data/products';
import BrandPageClient from './BrandPageClient';
import { getCategoryName } from '../utils';

export default function BrandPage({ params }: { params: { category: string, brand: string } }) {
  const { category, brand } = params;
  
  const categoryName = getCategoryName(category);

  const categoryProducts = allProducts.filter(product => {
    return categoryName.startsWith(product.category);
  });

  return <BrandPageClient initialProducts={categoryProducts} brand={brand} categoryName={categoryName} />;
}