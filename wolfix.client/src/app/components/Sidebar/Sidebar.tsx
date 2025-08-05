import { FC } from "react";

interface ISidebarProps {
  style?: React.CSSProperties;
  className?: string; 
}

const Sidebar: FC<ISidebarProps> = ({ style, className }) => {
  return (
    <aside className={className} style={style}>
      <a href="/categories/smartfony" className="sidebar-link"><img src="/icons/iPhone.png" className="sidebar-icons"/> Смартфони та телефони</a>
      <a href="/categories/notebook" className="sidebar-link"><img src="/icons/Laptop.png" className="sidebar-icons"/> Ноутбуки, планшети та комп'ютерна техніка</a>
      <a href="/categories/televizory" className="sidebar-link"><img src="/icons/TV.png" className="sidebar-icons"/> Телевізори та мультимедіа</a>
      <a href="/categories/smart-godinniki" className="sidebar-link"><img src="/icons/Watch.png" className="sidebar-icons"/> Смарт-годинники та гаджети</a>
      <a href="/categories/tovary-dlya-domu" className="sidebar-link"><img src="/icons/Sofa.png" className="sidebar-icons"/> Товари для дому</a>
      <a href="/categories/tovary-dlya-kuxni" className="sidebar-link"><img src="/icons/Cooker.png" className="sidebar-icons"/> Товари для кухні</a>
      <a href="/categories/audio-foto-video" className="sidebar-link"><img src="/icons/Group193.png" className="sidebar-icons"/> Аудіо, фото та відео</a>
      <a href="/categories/gaming-pro-konsoli" className="sidebar-link"><img src="/icons/Group194.png" className="sidebar-icons"/> Геймінг, ігри консолі</a>
      <a href="/categories/krasa-i-zdorovya" className="sidebar-link"><img src="/icons/Dispenser.png" className="sidebar-icons"/> Краса і здоров'я</a>
      <a href="/categories/dityachi-tovary" className="sidebar-link"><img src="/icons/Stroller.png" className="sidebar-icons"/> Дитячі товари</a>
      <a href="/categories/zootovary" className="sidebar-link"><img src="/icons/Dog.png" className="sidebar-icons"/> Зоотовари</a>
      <a href="/categories/odjag-vzuttya-ta-prykrasy" className="sidebar-link"><img src="/icons/Clothes.png" className="sidebar-icons"/> Одяг, взуття та прикраси</a>
      <a href="/categories/dim-ta-vydpohnok" className="sidebar-link"><img src="/icons/Bed.png" className="sidebar-icons"/> Дім та відпочинок</a>
      <a href="/categories/ixa-ta-napoi" className="sidebar-link"><img src="/icons/Wine.png" className="sidebar-icons"/> Їжа та напої</a>
      <a href="/categories/instrumenty-ta-avtovary" className="sidebar-link"><img src="/icons/Tools.png" className="sidebar-icons"/> Інструменти та автотовари</a>
      <a href="/categories/persolalnyj-transpor" className="sidebar-link"><img src="/icons/Bicycle.png" className="sidebar-icons"/> Персональний транспорт</a>
      <a href="/categories/Energozabezpechennya" className="sidebar-link"><img src="/icons/Battery.png" className="sidebar-icons"/> Енергозабезпечення</a>
    </aside>
  );
};

export default Sidebar;