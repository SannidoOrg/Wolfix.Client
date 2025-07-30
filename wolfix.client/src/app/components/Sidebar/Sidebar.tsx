import { FC } from "react";

interface ISidebarProps {}

const Sidebar: FC<ISidebarProps> = () => {
  return (
    <aside className="sidebar">
      <a href="/categories/smartfony" className="sidebar-link">Смартфони та телефони</a>
      <a href="/categories/noutbuky" className="sidebar-link">Ноутбуки, планшети та комп’ютери</a>
      <a href="/categories/televzory" className="sidebar-link">Телевізори та мультимедіа</a>
      <a href="/categories/smart-chasy" className="sidebar-link">Смарт-годинники та гаджети</a>
      <a href="/categories/mebli" className="sidebar-link">Меблі</a>
      <a href="/categories/tovary-dlya-doma" className="sidebar-link">Товари для дому</a>
      <a href="/categories/tovary-dlya-kuxni" className="sidebar-link">Товари для кухні</a>
      <a href="/categories/avto" className="sidebar-link">Авто, мото та вело</a>
      <a href="/categories/igrushki" className="sidebar-link">Іграшки, ігрові консолі</a>
      <a href="/categories/krasa" className="sidebar-link">Краса та здоров’я</a>
      <a href="/categories/dityachi-tovary" className="sidebar-link">Дитячі товари</a>
      <a href="/categories/prykraski" className="sidebar-link">Прикраси</a>
      <a href="/categories/elektronika" className="sidebar-link">Енергообладнання</a>
    </aside>
  );
};

export default Sidebar;