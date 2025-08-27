import { allProducts } from '../../../data/products';
import BrandPageClient from './BrandPageClient';

export default function BrandPage({ params }: { params: { brand: string } }) {
  const { brand } = params;
  
  const initialProducts = allProducts.filter(p => p.brand.toLowerCase() === brand.toLowerCase());

  return <BrandPageClient initialProducts={initialProducts} brand={brand} />;
}