import { FC } from "react";

interface ISidebarProps {}

const Sidebar: FC<ISidebarProps> = () => {
  return (
    <aside className="sidebar">
      <a href="/smartfony" className="sidebar-link">📱 Смартфони та телефони</a>
      <a href="/notebook" className="sidebar-link">💻 Ноутбуки, планшети та комп'ютерна техніка</a>
      <a href="/televizory" className="sidebar-link">📺 Телевізори та мультимедіа</a>
      <a href="/smart-godinniki" className="sidebar-link">⌚ Смарт-годинники та гаджети</a>
      <a href="/tovary-dlya-domu" className="sidebar-link">🏠 Товари для дому</a>
      <a href="/tovary-dlya-kuxni" className="sidebar-link">🍳 Товари для кухні</a>
      <a href="/audio-foto-video" className="sidebar-link">📷 Аудіо, фото та відео</a>
      <a href="/gaming-pro-konsoli" className="sidebar-link">🎮 Геймінг, ігри консолі</a>
      <a href="/krasa-i-zdorovya" className="sidebar-link">💅 Краса і здоров'я</a>
      <a href="/dityachi-tovary" className="sidebar-link">👶 Дитячі товари</a>
      <a href="/zootovary" className="sidebar-link">🐶 Зоотовари</a>
      <a href="/odjag-vzuttya-ta-prykrasy" className="sidebar-link">👗 Одяг, взуття та прикраси</a>
      <a href="/dim-ta-vydpohnok" className="sidebar-link">🏡 Дім та відпочинок</a>
      <a href="/ixa-ta-napoi" className="sidebar-link">🍵 Їжа та напої</a>
      <a href="/instrumenty-ta-avtovary" className="sidebar-link">🔧 Інструменти та автотовари</a>
      <a href="/persolalnyj-transpor" className="sidebar-link">🚲 Персональний транспорт</a>
    </aside>
  );
};

export default Sidebar;