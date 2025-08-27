import Header from '../../components/Header/Header.client';
import Sidebar from '../../components/Sidebar/Sidebar';
import CategorySelection from '../../components/CategorySelection/CategorySelection';
import Footer from '../../components/Footer/Footer';
import { getCategoryName } from './utils';
import '../../../styles/[category].css';

interface ICategoryProps {
  params: {
    category: string;
  };
  logoAlt: string;
}

const CategoryPage = ({ params, logoAlt }: ICategoryProps) => {
  const categoryName = params && params.category ? getCategoryName(params.category) : 'Категорія не знайдена';

  if (!categoryName || categoryName === 'Категорія не знайдена') {
    return null;
  }

  return (
    <div className="page-container">
      <Header logoAlt={logoAlt} />
      <div className="main-content">
        <Sidebar className="sidebar" />
        <div className="divider" />
        <div className="content-area">
          <div className="breadcrumbs">Головна / {categoryName}</div>
          <h1 className="category-title">{categoryName}</h1>
          <CategorySelection category={params.category} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;