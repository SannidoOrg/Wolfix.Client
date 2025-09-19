"use client";

import Link from 'next/link';
import { useAuth } from '../../../../contexts/AuthContext';
import '../../../styles/ProfileSidebar.css';

const SellerSidebar = () => {
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
                <Link href="/wip" className="sidebar-link">Відгуки</Link>
                <Link href="/wip" className="sidebar-link">Обране</Link>
                <Link href="/wip" className="sidebar-link">Список порівнянь</Link>
                <Link href="/wip" className="sidebar-link">Кошик</Link>
                <Link href="/wip" className="sidebar-link">Мої картки</Link>
                <Link href="/wip" className="sidebar-link">Сповіщення</Link>
                <Link href="/wip" className="sidebar-link">Стати продавцем</Link>
            </nav>
            <div className="sidebar-footer-nav">
                <Link href="/wip" className="sidebar-link">Інфоцентр</Link>
                <Link href="/wip" className="sidebar-link">Технічна підтримка</Link>
                <button onClick={logout} className="sidebar-link sidebar-logout-button">Вихід</button>
            </div>
        </aside>
    );
};

export default SellerSidebar;