'use client';

import { FC, useState } from "react";

interface IHeaderProps {
  logoAlt: string;
}

const Header: FC<IHeaderProps> = ({ logoAlt }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="/wolfix-logo.png" alt={logoAlt} className="header-logo" />
        <nav className="nav">
          <a href="/" className="nav-link">Про нас</a>
          <a href="/about" className="nav-link">Продавати на Wolfix</a>
          <a href="/akcii" className="nav-link">Акції</a>
        </nav>
      </div>
      <div className="header-right">
        <div className="promo-banner">Великий літній розпродаж ДО -60%</div>
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Я шукаю..."
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>
        <div className="user-icons">
          <a href="/catalog" className="nav-link">Каталог</a>
          <span className="language">UA</span>
          <div className="icon-group">
            <span className="icon">🔔</span>
            <span className="icon">❤️</span>
            <span className="icon">⚖️</span>
            <span className="icon">🛒</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;