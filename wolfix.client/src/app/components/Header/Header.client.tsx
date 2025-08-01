import { FC } from "react";
import "../../../styles/Header.css";

interface IHeaderProps {
  logoAlt: string;
}

const Header: FC<IHeaderProps> = ({ logoAlt }) => {
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
        <div className="promo-banner"><img src="/banners/banner.png" alt="Promo Banner" /></div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Я шукаю..."
            className="search-input"
            readOnly
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