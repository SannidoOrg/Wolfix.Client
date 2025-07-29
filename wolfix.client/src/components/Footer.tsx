import { FC } from 'react';
import styles from '../styles/Footer.module.css';

const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.section}>
        <h3>Допомога</h3>
        <ul>
          <li>Продавці на Wolfix</li>
          <li>Продавати на Wolfix</li>
          <li>Безпека</li>
          <li>Контакти</li>
          <li>Акції</li>
        </ul>
      </div>
      <div className={styles.section}>
        <h3>Договора</h3>
        <ul>
          <li>Доставка та оплата</li>
          <li>Повернення товару</li>
          <li>Гарантія</li>
          <li>Сервіс центри</li>
        </ul>
      </div>
      <div className={styles.section}>
        <h3>Сервіс</h3>
        <ul>
          <li>Бонуси та акції</li>
          <li>Подарункові сертифікати Wolfix</li>
          <li>Вікі Wolfix</li>
          <li>Допомога покупцям</li>
        </ul>
      </div>
      <div className={styles.section}>
        <h3>Партнери</h3>
        <ul>
          <li>Продавці на Wolfix</li>
          <li>Співпраця з нами</li>
          <li>Оренда прилавків</li>
        </ul>
      </div>
      <div className={styles.section}>
        <h3>Наш соціальний мережи</h3>
        <div className={styles.socialIcons}>
          <span className={styles.icon}>📱</span>
          <span className={styles.icon}>🌐</span>
          <span className={styles.icon}>📲</span>
          <span className={styles.icon}>🍏</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;