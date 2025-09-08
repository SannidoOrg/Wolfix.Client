"use client";

import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Image from "next/image";

const ProfileSidebar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    
    const userName = "Романенко Олексій";

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <aside className="profile-sidebar">
            <div className="sidebar-user-info">
                <Image src="/icons/prof.png" alt="User Avatar" width={48} height={48} className="user-avatar" />
                <span className="sidebar-user-name">{userName}</span>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li><Link href="/wip">Бонуси</Link></li>
                    <li><Link href="/wip">Замовлення</Link></li>
                    <li><Link href="/wip">Відгуки</Link></li>
                    <li><Link href="/wip">Обране</Link></li>
                    <li><Link href="/wip">Список порівнянь</Link></li>
                    <li><Link href="/wip">Кошик</Link></li>
                    <li><Link href="/wip">Мої картки</Link></li>
                    <li><Link href="/wip">Сповіщення</Link></li>
                    <li><Link href="/become-seller">Стати продавцем</Link></li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                 <a href="#infocenter">Інфоцентр</a>
                 <a href="#support">Технічна підтримка</a>
                 <button onClick={handleLogout} className="logout-button">Вихід</button>
            </div>
        </aside>
    );
};

export default ProfileSidebar;