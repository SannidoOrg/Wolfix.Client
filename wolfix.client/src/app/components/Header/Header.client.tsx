"use client";

import {FC, useState, useRef} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import ProfileModal from "../ProfileModal/ProfileModal.client";
import Search from "./Search.client";
import CatalogModal from "../CatalogModal/CatalogModal.client";
import CartModal from "./CartModal.client";
import {useAuth} from "../../../contexts/AuthContext";
import {useUser} from "../../../contexts/UserContext";
import "../../../styles/Header.css";

interface IHeaderClientProps {
    logoAlt: string;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

const HeaderClient: FC<IHeaderClientProps> = ({logoAlt, searchQuery, onSearchChange}) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

    const profileButtonRef = useRef<HTMLButtonElement | null>(null);
    const cartButtonRef = useRef<HTMLAnchorElement | null>(null);

    const router = useRouter();
    const {isAuthenticated, user, isLoading} = useAuth();
    const {cart} = useUser();

    // Скрываем иконки магазина для персонала
    const shouldHideShopIcons = isLoading || (user?.role === 'Seller' || user?.role === 'Support');

    const handleProfileClick = () => {
        if (isAuthenticated) {
            // Проверяем роль пользователя
            if (user?.role === 'Seller') {
                // Путь к дашборду продавца.
                // Убедитесь, что вы создали страницу src/app/seller/dashboard/page.tsx
                router.push('/seller/dashboard');
            }
            else if (user?.role === 'Support') {
                router.push('/support/dashboard');
            }
            else if (user?.role === 'Admin') {
                router.push('/admin/dashboard');
            }
            else if (user?.role === 'SuperAdmin') {
                router.push('/super-admin/dashboard');
            }
            else {
                router.push('/profile');
            }
        } else {
            setIsModalOpen(true);
            document.body.style.overflow = 'hidden';
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    const toggleCatalog = () => {
        if (isCatalogOpen) {
            setIsCatalogOpen(false);
            document.body.style.overflow = 'auto';
        } else {
            setIsCatalogOpen(true);
            document.body.style.overflow = 'hidden';
        }
    };

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isCartOpen) {
            setIsCartOpen(false);
        } else {
            setIsCartOpen(true);
        }
    };

    const itemsCount = cart?.items.length || 0;

    return (
        <div className="header-container">
            <div className="top-bar">
                <nav className="top-nav">
                    <Link href="/wip" className="nav-link">Про нас</Link>
                    <Link href="/profile/become-seller" className="nav-link">Продавати на Wolfix</Link>
                    <Link href="/wip" className="nav-link">Акції</Link>
                </nav>
                <div className="top-banner"><img src="/banners/banner.png" alt="Promo Banner"/></div>

                <button className="user-profile-icon" onClick={handleProfileClick} ref={profileButtonRef}>
                    <img src="/icons/Profile.png" alt="Profile Icon"/>
                </button>
            </div>

            <header className="header">
                <a href="/">
                    <div className="logo-block">
                        <img src="/logo/wolfix-logo.png" alt={logoAlt} className="header-logo"/>
                        <img src="/logo/Wolfix.png" alt="Second Logo"/>
                    </div>
                </a>

                <div className="catalog-container">
                    <div className="catalog-link" onClick={toggleCatalog} style={{cursor: 'pointer'}}>
                        <img src="/icons/Cataloge.png" alt="Cataloge Icon"/>
                        {isCatalogOpen ? 'Закрити' : 'Каталог'}
                    </div>
                </div>

                <div className="header-right">
                    <Search query={searchQuery} onQueryChange={onSearchChange} />
                    <div className="user-icons">
                        <div className="icon-group">
                            <Link href="/wip" className="icon"><img src="/icons/notification.png"
                                                                    alt="Notification Icon"/></Link>

                            {/* ИЗБРАННОЕ (скрыто для персонала) */}
                            {!shouldHideShopIcons && (
                                <Link href="/profile/favorites" className="icon">
                                    <img src="/icons/selected.png" alt="Favorites"/>
                                </Link>
                            )}

                            {/* Блок Comparison удален отсюда */}

                            {/* КОРЗИНА (скрыта для персонала) */}
                            {!shouldHideShopIcons && (
                                <div className="icon" style={{position: 'relative'}}>
                                    <a href="/profile/cart" onClick={handleCartClick} ref={cartButtonRef}>
                                        <img src="/icons/cart.png" alt="Cart Icon"/>
                                        {itemsCount > 0 && (
                                            <span style={{
                                                position: 'absolute',
                                                top: '-5px',
                                                right: '-5px',
                                                backgroundColor: '#FF6B00',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: '18px',
                                                height: '18px',
                                                fontSize: '11px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {itemsCount}
                                            </span>
                                        )}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <ProfileModal isOpen={isModalOpen} onClose={handleCloseModal} anchorRef={profileButtonRef}/>
            <CatalogModal isOpen={isCatalogOpen} onClose={() => {
                setIsCatalogOpen(false);
                document.body.style.overflow = 'auto';
            }}/>

            {!shouldHideShopIcons && (
                <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} anchorRef={cartButtonRef}/>
            )}
        </div>
    );
};

export default HeaderClient;