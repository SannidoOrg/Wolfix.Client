import { FC, useState } from 'react';
import styles from '../styles/Header.module.css';

const Header: FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src="/public/icon.png" alt="Wolfix Logo" className={styles.logo} />
        <span className={styles.brand}>Wolfix</span>
        <span className={styles.slogan}>Каталог</span>
      </div>
      <div className={styles.navContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Я шукаю..."
          className={styles.search}
        />
        <div className={styles.icons}>
          <span className={styles.icon}>🔔</span>
          <span className={styles.icon}>❤️</span>
          <span className={styles.icon}>👤</span>
          <span className={styles.icon}>🛒</span>
          <select className={styles.language}>
            <option value="ua">UA</option>
            <option value="en">EN</option>
          </select>
        </div>
      </div>
      <div className={styles.promoBanner}>
        <span>Вишукані товари зі знижкою</span>
        <span className={styles.discount}>-60%</span>
      </div>
    </header>
  );
};

export default Header;