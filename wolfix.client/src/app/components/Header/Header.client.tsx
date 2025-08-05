"use client";

import { FC, useState } from "react";
import "../../../styles/Header.css";

interface IHeaderProps {
  logoAlt: string;
}

const Header: FC<IHeaderProps> = ({ logoAlt }) => {
  const [searchQuery, setSearchQuery] = useState<string>(''); // Изначально пустое значение, что безопасно

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="header-container">
      <div className="top-bar">
        <nav className="top-nav">
          <a href="/" className="nav-link">Про нас</a>
          <a href="/about" className="nav-link">Продавати на Wolfix</a>
          <a href="/akcii" className="nav-link">Акції</a>
        </nav>
        <div className="top-banner"><img src="/banners/banner.png" alt="Promo Banner" /></div>
        <div className="user-profile-icon"><img src="/icons/Profile.png" alt="Profile Icon" /></div>
      </div>
      <header className="header">
        <div className="logo-block">
          <img src="/logo/wolfix-logo.png" alt={logoAlt} className="header-logo" />
          <img src="/logo/Wolfix.png" alt="Second Logo" />
        </div>
        <div className="catalog-container">
          <a href="/catalog" className="catalog-link"><img src="/icons/Cataloge.png" alt="Cataloge Icon" />Каталог</a>
        </div>
        <div className="header-right">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Я шукаю..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
              <img src="/icons/Search.png" alt="Search Icon" />
            </button>
          </div>
          <div className="user-icons">
            <div className="icon-group">
              <span className="icon"><img src="/icons/notification.png" alt="Notification Icon" /></span>
              <span className="icon"><img src="/icons/selected.png" alt="Selected Icon" /></span>
              <span className="icon"><img src="/icons/comparison.png" alt="Comparison Icon" /></span>
              <span className="icon"><img src="/icons/cart.png" alt="Cart Icon" /></span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;