import { FC } from "react";
import Link from "next/link";
import "../../../styles/Footer.css";

const Footer: FC = () => {
  return (
    <>
      <div className="footer-top"></div>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Загальна інформація:</h3>
            <Link href="/wip" className="footer-link">Про нас</Link>
            <Link href="/wip" className="footer-link">Умови використання сайту</Link>
            <Link href="/wip" className="footer-link">Вакансії</Link>
            <Link href="/wip" className="footer-link">Контакти</Link>
            <Link href="/wip" className="footer-link">Всі категорії</Link>
            <Link href="/wip" className="footer-link">Акції</Link>
          </div>
          <div className="footer-column">
            <h3>Допомога:</h3>
            <Link href="/wip" className="footer-link">Доставка та оплата</Link>
            <Link href="/wip" className="footer-link">Повернення товару</Link>
            <Link href="/wip" className="footer-link">Кредит</Link>
            <Link href="/wip" className="footer-link">Гарантія</Link>
            <Link href="/wip" className="footer-link">Сервісні центри</Link>
          </div>
          <div className="footer-column">
            <h3>Сервіси:</h3>
            <Link href="/wip" className="footer-link">Бонусний рахунок</Link>
            <Link href="/wip" className="footer-link">Подарункові сертифікати Wolfix</Link>
            <Link href="/wip" className="footer-link">Wolfix Обмін</Link>
            <Link href="/wip" className="footer-link">Для корпоративних клієнтів</Link>
          </div>
          <div className="footer-column">
            <h3>Партнерам:</h3>
            <Link href="/wip" className="footer-link">Продавати на Wolfix</Link>
            <Link href="/wip" className="footer-link">Співпраця з нами</Link>
            <Link href="/wip" className="footer-link">Оренда приміщень</Link>
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