import { FC } from "react";
import { categoriesConfig } from "../../(utils)/categories.config";
import "../../../styles/Sidebar.css";

interface ISidebarProps {
  style?: React.CSSProperties;
  className?: string; 
}

const Sidebar: FC<ISidebarProps> = ({ style, className }) => {
  const iconMap: { [key: string]: string } = {
    'Смартфони': 'iPhone.png',
    'Ноутбуки': 'Laptop.png',
    'Телевізори': 'TV.png',
    'Смарт-годинники': 'Watch.png',
    'Товари для дому': 'Sofa.png',
    'Побутова техніка': 'Cooker.png',
    'Аудіотехніка': 'Group193.png',
    'Геймінг': 'Group194.png',
    'Краса і здоров\'я': 'Dispenser.png',
    'Дитячі товари': 'Stroller.png',
    'Зоотовари': 'Dog.png',
    'Одяг та взуття': 'Clothes.png',
    'Дім та відпочинок': 'Bed.png',
    'Їжа та напої': 'Wine.png',
    'Інструменти': 'Tools.png',
    'Транспорт': 'Bicycle.png',
    'Енергозабезпечення': 'Battery.png',
  };

  return (
    <aside className={className} style={style}>
      {categoriesConfig.map(category => (
        <a href={`/categories/${category.slug}`} className="sidebar-link" key={category.slug}>
          <img src={`/icons/${iconMap[category.internalName]}`} className="sidebar-icons"/> {category.displayName}
        </a>
      ))}
    </aside>
  );
};

export default Sidebar;