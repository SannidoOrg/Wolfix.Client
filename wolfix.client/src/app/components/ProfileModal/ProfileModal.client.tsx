"use client";

import { FC, useRef, useEffect, useState, RefObject } from 'react';
import Image from 'next/image';
import '../../../styles/ProfileModal.css';
import { useAuth } from '../../../contexts/AuthContext';
import { useGlobalContext } from '../../../contexts/GlobalContext';

interface IProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: RefObject<HTMLButtonElement | null>;
}

const ProfileModal: FC<IProfileModalProps> = ({ isOpen, onClose, anchorRef }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Состояния формы
    const [view, setView] = useState<'login' | 'register' | 'selectRole'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    // Список ролей, полученный с сервера
    const [availableRoles, setAvailableRoles] = useState<string[]>([]);

    const { fetchUserRoles, loginWithRole, register } = useAuth();
    const { loading } = useGlobalContext();

    // Сброс формы при открытии/закрытии
    useEffect(() => {
        if (isOpen) {
            setView('login');
            setError('');
            // Не сбрасываем email/pass для удобства, если пользователь случайно закрыл
        }
    }, [isOpen]);

    // Закрытие по клику вне
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node) &&
                anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, anchorRef]);

    const handleSwitchView = (newView: 'login' | 'register') => {
        setError('');
        setView(newView);
    };

    // ЛОГИКА ВХОДА (Этап 1)
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // 1. Запрашиваем роли
        const roles = await fetchUserRoles({ email, password });

        if (!roles || roles.length === 0) {
            setError("Користувача не знайдено або неправильний пароль.");
            return;
        }

        // 2. Если роль одна - входим сразу
        if (roles.length === 1) {
            await finalizeLogin(roles[0]);
        } else {
            // 3. Если ролей много - показываем выбор
            setAvailableRoles(roles);
            setView('selectRole');
        }
    };

    // ЛОГИКА ВХОДА (Этап 2 - получение токена)
    const finalizeLogin = async (role: string) => {
        const success = await loginWithRole({ email, password, role });
        if (success) {
            onClose();
            // Очистка чувствительных данных
            setPassword('');
            setConfirmPassword('');
        }
    };

    // ЛОГИКА РЕГИСТРАЦИИ
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Паролі не співпадають");
            return;
        }

        const success = await register({ email, password });
        if (success) {
            onClose();
            setPassword('');
            setConfirmPassword('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={modalRef}>
                <button className="modal-close-button" onClick={onClose}>&times;</button>

                {/* --- ВИД: ВЫБОР РОЛИ --- */}
                {view === 'selectRole' ? (
                    <div style={{ width: '100%', textAlign: 'center' }}>
                        <h2 className="modal-title">Оберіть роль</h2>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px' }}>
                            Увійдіть як:
                        </p>
                        <div className="roles-selection" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {availableRoles.map(role => (
                                <button
                                    key={role}
                                    onClick={() => finalizeLogin(role)}
                                    className="continue-button"
                                    disabled={loading}
                                    style={{ backgroundColor: '#0C3C3E' }} // Другой цвет для отличия
                                >
                                    {role === 'Customer' ? 'Покупець' : role === 'Seller' ? 'Продавець' : role === 'Admin' ? 'Адміністратор' : role}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setView('login')}
                            className="forgot-password"
                            style={{ marginTop: '20px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            ← Назад
                        </button>
                    </div>
                ) : (
                    /* --- ВИД: ВХОД И РЕГИСТРАЦИЯ --- */
                    <>
                        <h2 className="modal-title">{view === 'login' ? 'Вхід' : 'Реєстрація'}</h2>
                        <div className="modal-separator"></div>

                        <form className="login-form" onSubmit={view === 'login' ? handleLoginSubmit : handleRegisterSubmit}>

                            <label htmlFor="email" className="form-label">Електронна пошта</label>
                            <input
                                type="email"
                                id="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label htmlFor="password" className="form-label">Пароль</label>
                            <input
                                type="password"
                                id="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            {view === 'register' && (
                                <>
                                    <label htmlFor="confirm" className="form-label">Підтвердити пароль</label>
                                    <input
                                        type="password"
                                        id="confirm"
                                        className="form-input"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </>
                            )}

                            {view === 'login' && (
                                <a href="#" className="forgot-password">Забули пароль?</a>
                            )}

                            {error && <p style={{ color: '#dc3545', fontSize: '13px', textAlign: 'center', margin: '5px 0' }}>{error}</p>}

                            <button type="submit" className="continue-button" disabled={loading}>
                                {loading ? 'Обробка...' : 'Продовжити'}
                            </button>
                        </form>

                        <div className="modal-separator-text-middle">або</div>

                        <div className="social-login-options">
                            <button className="social-button">
                                <Image src="/icons/Group198.jpg" alt="Google" width={20} height={20} />
                                Продовжити з Google
                            </button>
                        </div>

                        <div className="registration-prompt">
                            {view === 'login' ? (
                                <p>Ще немає акаунту? <a onClick={() => handleSwitchView('register')}>Зареєструватися</a></p>
                            ) : (
                                <p>Вже є акаунт? <a onClick={() => handleSwitchView('login')}>Увійти</a></p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileModal;