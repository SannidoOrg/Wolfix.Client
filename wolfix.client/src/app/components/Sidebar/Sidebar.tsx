import { FC } from "react";

interface ISidebarProps {
  style?: React.CSSProperties;
  className?: string; 
}

const Sidebar: FC<ISidebarProps> = ({ style, className }) => {
  return (
    <aside className={className} style={style}>
      <a href="/smartfony" className="sidebar-link"><img src="/icons/iPhone.png" className="sidebar-icons"/> Смартфони та телефони</a>
      <a href="/notebook" className="sidebar-link"><img src="/icons/Laptop.png" className="sidebar-icons"/> Ноутбуки, планшети та комп'ютерна техніка</a>
      <a href="/televizory" className="sidebar-link"><img src="/icons/TV.png" className="sidebar-icons"/> Телевізори та мультимедіа</a>
      <a href="/smart-godinniki" className="sidebar-link"><img src="/icons/Watch.png" className="sidebar-icons"/> Смарт-годинники та гаджети</a>
      <a href="/tovary-dlya-domu" className="sidebar-link"><img src="/icons/Sofa.png" className="sidebar-icons"/> Товари для дому</a>
      <a href="/tovary-dlya-kuxni" className="sidebar-link"><img src="/icons/Cooker.png" className="sidebar-icons"/> Товари для кухні</a>
      <a href="/audio-foto-video" className="sidebar-link"><img src="/icons/Group193.png" className="sidebar-icons"/> Аудіо, фото та відео</a>
      <a href="/gaming-pro-konsoli" className="sidebar-link"><img src="/icons/Group194.png" className="sidebar-icons"/> Геймінг, ігри консолі</a>
      <a href="/krasa-i-zdorovya" className="sidebar-link"><img src="/icons/Dispenser.png" className="sidebar-icons"/> Краса і здоров'я</a>
      <a href="/dityachi-tovary" className="sidebar-link"><img src="/icons/Stroller.png" className="sidebar-icons"/> Дитячі товари</a>
      <a href="/zootovary" className="sidebar-link"><img src="/icons/Dog.png" className="sidebar-icons"/> Зоотовари</a>
      <a href="/odjag-vzuttya-ta-prykrasy" className="sidebar-link"><img src="/icons/Clothes.png" className="sidebar-icons"/> Одяг, взуття та прикраси</a>
      <a href="/dim-ta-vydpohnok" className="sidebar-link"><img src="/icons/Bed.png" className="sidebar-icons"/> Дім та відпочинок</a>
      <a href="/ixa-ta-napoi" className="sidebar-link"><img src="/icons/Wine.png" className="sidebar-icons"/> Їжа та напої</a>
      <a href="/instrumenty-ta-avtovary" className="sidebar-link"><img src="/icons/Tools.png" className="sidebar-icons"/> Інструменти та автотовари</a>
      <a href="/persolalnyj-transpor" className="sidebar-link"><img src="/icons/Bicycle.png" className="sidebar-icons"/> Персональний транспорт</a>
      <a href="/Energozabezpechennya" className="sidebar-link"><img src="/icons/Battery.png" className="sidebar-icons"/> Енергозабезпечення</a>
    </aside>
  );
};

export default Sidebar;