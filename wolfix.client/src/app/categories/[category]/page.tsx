import { FC } from "react";

interface CategoryProps {
  params: { category: string };
}

const Category: FC<CategoryProps> = ({ params }) => {
  return (
    <div className="category-page">
      <h1>Категорія: {params.category}</h1>
      {/* Тут можна додати динамічний контент для кожної категорії */}
    </div>
  );
};

export default Category;