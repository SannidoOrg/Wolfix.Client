"use client";

import { useAuth } from "../../../contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link';
import Image from "next/image";

const ProfileSidebar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Имя берем из токена или контекста, если есть, иначе заглушка
    // В идеале нужно загрузить профиль и сюда тоже, но пока оставим просто email или статику
    const userName = user?.email || "Користувач";

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const isActive = (path: string) => pathname === path ? 'active' : '';

    return (
        <aside className="profile-sidebar">
            <div className="sidebar-user-info">
                <Image src="/icons/prof.png" alt="User Avatar" width={60} height={60} className="user-avatar" />
                <span className="sidebar-user-name">{userName}</span>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {/* Главная страница профиля - это "Особисті дані" */}
                    <li><Link href="/profile" className={isActive('/profile')}>Особисті дані</Link></li>
                    <li><Link href="/profile/bonuses" className={isActive('/profile/bonuses')}>Бонуси</Link></li>
                    <li><Link href="/wip" className={isActive('/profile/orders')}>Замовлення</Link></li>
                    <li><Link href="/profile/favorites">Обране</Link></li>
                    <li><Link href="/profile/cart">Кошик</Link></li>
                    <li><Link href="/wip">Сповіщення</Link></li>
                    <li><Link href="/become-seller">Стати продавцем</Link></li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                <a href="#infocenter">Інфоцентр</a>
                <a href="#support">Технічна підтримка</a>
                <button onClick={handleLogout} style={{background:'none', border:'none', textAlign:'left', cursor:'pointer', fontSize:'16px', color:'#555', padding:0}}>Вихід</button>
            </div>
        </aside>
    );
};

export default ProfileSidebar;