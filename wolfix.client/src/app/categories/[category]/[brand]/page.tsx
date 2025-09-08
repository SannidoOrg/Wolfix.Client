import { allProducts } from '../../../data/products';
import BrandPageClient from './BrandPageClient';
import { categorySlugMap } from '../../../(utils)/categories.config';
import { notFound } from 'next/navigation';

export default function BrandPage({ params }: { params: { category: string, brand: string } }) {
  const categoryDisplayName = categorySlugMap[params.category];
  const brandName = params.brand.charAt(0).toUpperCase() + params.brand.slice(1);

  if (!categoryDisplayName) {
    notFound();
  }
  
  return <BrandPageClient initialProducts={allProducts} brand={brandName} categoryName={categoryDisplayName} />;
}