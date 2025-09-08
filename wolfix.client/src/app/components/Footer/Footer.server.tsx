import { FC } from "react";
import "../../../styles/Footer.css";

const Footer: FC = () => {
  return (
    <>
      <div className="footer-top"></div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Загальна інформація:</h3>
            <a href="/about" className="footer-link">Про нас</a>
            <a href="/terms" className="footer-link">Умови використання сайту</a>
            <a href="/careers" className="footer-link">Вакансії</a>
            <a href="/contacts" className="footer-link">Контакти</a>
            <a href="/categories" className="footer-link">Всі категорії</a>
            <a href="/promotions" className="footer-link">Акції</a>
          </div>
          <div className="footer-column">
            <h3>Допомога:</h3>
            <a href="/shipping" className="footer-link">Доставка та оплата</a>
            <a href="/returns" className="footer-link">Повернення товару</a>
            <a href="/credit" className="footer-link">Кредит</a>
            <a href="/warranty" className="footer-link">Гарантія</a>
            <a href="/service-centers" className="footer-link">Сервісні центри</a>
          </div>
          <div className="footer-column">
            <h3>Сервіси:</h3>
            <a href="/bonus-account" className="footer-link">Бонусний рахунок</a>
            <a href="/gift-cards" className="footer-link">Подарункові сертифікати Wolfix</a>
            <a href="/exchange" className="footer-link">Wolfix Обмін</a>
            <a href="/business-clients" className="footer-link">Для корпоративних клієнтів</a>
          </div>
          <div className="footer-column">
            <h3>Партнерам:</h3>
            <a href="/sell-on-wolfix" className="footer-link">Продавати на Wolfix</a>
            <a href="/partnership" className="footer-link">Співпраця з нами</a>
            <a href="/rentals" className="footer-link">Оренда приміщень</a>
          </div>
          <div className="footer-social-link">
            <h3>Наші соціальні мережі:</h3>
            <div className="social-links-container">
              <a href="https://www.facebook.com/wolfix" className="footer-link social-icon"><img src="/icons/Facebook.png" alt="Facebook" /></a>
              <a href="https://www.instagram.com/wolfix/" className="footer-link social-icon"><img src="/icons/Instagram.png" alt="Instagram" /></a>
              <a href="https://twitter.com/wolfix" className="footer-link social-icon"><img src="/icons/X.png" alt="Twitter" /></a>
              <a href="https://www.tiktok.com/@wolfix" className="footer-link social-icon"><img src="/icons/TikTok.png" alt="TikTok" /></a>
              <a href="https://www.youtube.com/@wolfix" className="footer-link social-icon"><img src="/icons/YouTube.png" alt="YouTube" /></a>
              <a href="https://t.me/wolfix" className="footer-link social-icon"><img src="/icons/Telegram.png" alt="Telegram" /></a>
            </div>
            <div className="footer-download-links">
              <a href="https://play.google.com/store/apps/details?id=com.wolfix.app" className="footer-link app-store"><img src="/icons/GooglePlay.jpg" alt="Google Play" /></a>
              <a href="https://www.apple.com/app-store/" className="footer-link app-store"><img src="/icons/AppStore.jpg" alt="App Store" /></a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;