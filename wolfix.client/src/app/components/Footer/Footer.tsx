import { FC } from "react";
import "../../../styles/Footer.css";

interface IFooterProps {}

const Footer: FC<IFooterProps> = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>Загальна інформація:</h3>
          <a href="/about" className="footer-link">Про нас</a>
          <a href="/about" className="footer-link">Умови використання сайту</a>
          <a href="/about" className="footer-link">Вакансії</a>
          <a href="/about" className="footer-link">Контакти</a>
          <a href="/contacts" className="footer-link">Всі категорії</a>
          <a href="/career" className="footer-link">Акції</a>
        </div>
        <div className="footer-column">
          <h3>Допомога:</h3>
          <a href="/faq" className="footer-link">Доставка та оплата</a>
          <a href="/support" className="footer-link">Повернення товару</a>
          <a href="/returns" className="footer-link">Кредит</a>
          <a href="/returns" className="footer-link">Гарантія</a>
          <a href="/returns" className="footer-link">Сервісні центри</a>
        </div>
        <div className="footer-column">
          <h3>Сервіси:</h3>
          <a href="/faq" className="footer-link">Бонусний рахунок</a>
          <a href="/support" className="footer-link">Подарункові сертифікати Wolfix</a>
          <a href="/returns" className="footer-link">Wolfix Обмін</a>
          <a href="/returns" className="footer-link">Для корпоративних клієнтів</a>
        </div>
        <div className="footer-column">
          <h3>Партнерам:</h3>
          <a href="/faq" className="footer-link">Продавати на Wolfix</a>
          <a href="/support" className="footer-link">Співпраця з нами</a>
          <a href="/returns" className="footer-link">Оренда приміщень</a>
        </div>
        <div className="footer-column">
          <h3>Наші соціальні мережі:</h3>
          <a href="https://facebook.com" className="footer-link">Facebook</a>
          <a href="https://instagram.com" className="footer-link">Instagram</a>
          <a href="https://twitter.com" className="footer-link">Twitter</a>
        </div>
        <div className="footer-column">

        </div>
      </div>
      <div className="footer-top">

      </div>
    </footer>
  );
};

export default Footer;