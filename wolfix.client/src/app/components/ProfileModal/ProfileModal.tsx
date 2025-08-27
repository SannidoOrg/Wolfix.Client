"use client";

import { FC, useRef, useEffect, useState, RefObject } from 'react';
import Image from 'next/image';
import '../../../styles/ProfileModal.css';

interface IProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLButtonElement | null>;
}

const ProfileModal: FC<IProfileModalProps> = ({ isOpen, onClose, anchorRef }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) &&
          anchorRef.current && !anchorRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      setView('login');
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const handleSwitchToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    setView('register');
  };
  
  const handleSwitchToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setView('login');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">{view === 'login' ? 'Вхід' : 'Реєстрація'}</h2>
        <div className="modal-separator"></div>

        {view === 'login' ? (
          <form className="login-form">
            <label htmlFor="login-email-input" className="form-label">Електронна пошта</label>
            <input type="email" id="login-email-input" className="form-input" />

            <label htmlFor="login-password-input" className="form-label">Пароль</label>
            <input type="password" id="login-password-input" className="form-input" />

            <a href="#" className="forgot-password">Забули пароль?</a>
            <button type="submit" className="continue-button">Продовжити</button>
          </form>
        ) : (
          <form className="login-form">
            <label htmlFor="register-email-input" className="form-label">Електронна пошта</label>
            <input type="email" id="register-email-input" className="form-input" />

            <label htmlFor="register-password-input" className="form-label">Пароль</label>
            <input type="password" id="register-password-input" className="form-input" />

            <label htmlFor="register-confirm-password-input" className="form-label">Підтвердити пароль</label>
            <input type="password" id="register-confirm-password-input" className="form-input" />

            <button type="submit" className="continue-button">Продовжити</button>
          </form>
        )}

        <p className="privacy-policy">
          Продовжуючи, ви підтверджуєте, що згодні увійти до облікового запису Wolfix та надаєте згоду на&nbsp;
          <a href="#">обробку персональних даних</a>
        </p>

        <div className="modal-separator-text-middle">або</div>

        <div className="social-login-options">
          <button className="social-button">
            <Image src="/icons/Facebook.jpg" alt="Facebook" width={24} height={24} />
            Реєстрація через Facebook
          </button>
          <button className="social-button">
            <Image src="/icons/Group198.jpg" alt="Google" width={24} height={24} />
            Реєстрація через Google
          </button>
        </div>

        {view === 'login' ? (
          <div className="registration-prompt">
            <p>Ще немає акаунту? <a href="#" onClick={handleSwitchToRegister}>Зареєструватися</a></p>
          </div>
        ) : (
          <div className="registration-prompt">
            <p>Вже є акаунт? <a href="#" onClick={handleSwitchToLogin}>Увійти</a></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;