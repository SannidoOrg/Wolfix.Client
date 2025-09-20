"use client";

import Link from 'next/link';
import { useAuth } from '../../../../contexts/AuthContext';
import '../../../../styles/ProfilePage.css';

const BuyerSidebar = () => {
    const { user, logout } = useAuth();

    return (
        <aside className="profile-sidebar">
            <div className="sidebar-user-info">
                <div className="sidebar-avatar-icon"></div>
                <p className="sidebar-user-email">{user?.email}</p>
            </div>
            <nav className="sidebar-nav">
                <Link href="/wip" className="sidebar-link">Бонуси</Link>
                <Link href="/wip" className="sidebar-link">Замовлення</Link>
                <Link href="/profile/cart" className="sidebar-link">Кошик</Link>
                <Link href="/wip" className="sidebar-link">Відгуки</Link>
                <Link href="/profile/favorites" className="sidebar-link">Обране</Link>
            </nav>
            <div className="sidebar-footer-nav">
                <button onClick={logout} className="sidebar-link sidebar-logout-button">Вихід</button>
            </div>
        </aside>
    );
};

export default BuyerSidebar;