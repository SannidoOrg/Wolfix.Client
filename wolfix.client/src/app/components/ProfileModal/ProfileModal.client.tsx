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
  const [view, setView] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const { loading } = useGlobalContext();

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

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleSwitchToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    resetForm();
    setView('register');
  };
  
  const handleSwitchToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    resetForm();
    setView('login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let response;
    if (view === 'login') {
      response = await login({ email, password });
    } else {
      if (password !== confirmPassword) {
        setError("Паролі не співпадають");
        return;
      }
      response = await register({ email, password });
    }

    if (response && response.status === 200) {
      onClose();
    } else {
      setError(response?.data?.message || "Помилка. Спробуйте ще раз.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2 className="modal-title">{view === 'login' ? 'Вхід' : 'Реєстрація'}</h2>
        <div className="modal-separator"></div>

        <form className="login-form" onSubmit={handleSubmit}>
          {view === 'login' ? (
            <>
              <label htmlFor="login-email-input" className="form-label">Електронна пошта</label>
              <input type="email" id="login-email-input" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label htmlFor="login-password-input" className="form-label">Пароль</label>
              <input type="password" id="login-password-input" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <a href="#" className="forgot-password">Забули пароль?</a>
            </>
          ) : (
            <>
              <label htmlFor="register-email-input" className="form-label">Електронна пошта</label>
              <input type="email" id="register-email-input" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <label htmlFor="register-password-input" className="form-label">Пароль</label>
              <input type="password" id="register-password-input" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <label htmlFor="register-confirm-password-input" className="form-label">Підтвердити пароль</label>
              <input type="password" id="register-confirm-password-input" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </>
          )}
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <button type="submit" className="continue-button" disabled={loading}>
            {loading ? 'Завантаження...' : 'Продовжити'}
          </button>
        </form>

        <p className="privacy-policy">
          Продовжуючи, ви підтверджуєте, що згодні увійти до облікового запису Wolfix та надаєте згоду на&nbsp;
          <a href="#">обробку персональних даних</a>
        </p>

        <div className="modal-separator-text-middle">або</div>

        <div className="social-login-options">
          <button className="social-button"><Image src="/icons/Facebook.jpg" alt="Facebook" width={24} height={24} />Реєстрація через Facebook</button>
          <button className="social-button"><Image src="/icons/Group198.jpg" alt="Google" width={24} height={24} />Реєстрація через Google</button>
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