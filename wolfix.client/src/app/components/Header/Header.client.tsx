"use client";

import { FC, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "../../../styles/Header.css";
import ProfileModal from "../ProfileModal/ProfileModal.client";
import Search from "./Search.client";
import { useAuth } from "../../../contexts/AuthContext";
import Link from "next/link";

interface IHeaderClientProps {
  logoAlt: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const HeaderClient: FC<IHeaderClientProps> = ({ logoAlt, searchQuery, onSearchChange }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="header-container">
      <div className="top-bar">
        <nav className="top-nav">
          <Link href="/wip" className="nav-link">Про нас</Link>
          <Link href="/wip" className="nav-link">Продавати на Wolfix</Link>
          <Link href="/wip" className="nav-link">Акції</Link>
        </nav>
        <div className="top-banner"><img src="/banners/banner.png" alt="Promo Banner" /></div>
        <button className="user-profile-icon" onClick={handleProfileClick} ref={profileButtonRef}>
            <img src="/icons/Profile.png" alt="Profile Icon" />
        </button>
      </div>
      <header className="header">
        <a href="/">
          <div className="logo-block">
            <img src="/logo/wolfix-logo.png" alt={logoAlt} className="header-logo" />
            <img src="/logo/Wolfix.png" alt="Second Logo" />
          </div>
        </a>
        <div className="catalog-container">
          <Link href="/wip" className="catalog-link"><img src="/icons/Cataloge.png" alt="Cataloge Icon" />Каталог</Link>
        </div>
        <div className="header-right">
          <Search query={searchQuery} onQueryChange={onSearchChange} />
          <div className="user-icons">
            <div className="icon-group">
              <Link href="/wip" className="icon"><img src="/icons/notification.png" alt="Notification Icon" /></Link>
              <Link href="/profile/favorites" className="icon"><img src="/icons/selected.png" alt="Selected Icon" /></Link>
              <Link href="/profile/cart" className="icon"><img src="/icons/cart.png" alt="Cart Icon" /></Link>
            </div>
          </div>
        </div>
      </header>
      <ProfileModal isOpen={isModalOpen} onClose={handleCloseModal} anchorRef={profileButtonRef} />
    </div>
  );
};

export default HeaderClient;