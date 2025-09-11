"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useGlobalContext } from "../../../contexts/GlobalContext";

const PersonalData = () => {
    const { user, updateUserProfile } = useAuth();
    const { loading } = useGlobalContext();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setMiddleName(user.middleName || '');
            if (!user.firstName) {
                setIsEditing(true);
            }
        }
    }, [user]);

    const handleSave = async (e: FormEvent) => {
        e.preventDefault();
        const success = await updateUserProfile({ firstName, lastName, middleName });
        if (success) {
            setIsEditing(false);
        }
    };

    if (!user) {
        return <div>Завантаження даних користувача...</div>;
    }

    return (
        <div className="profile-content">
            <form onSubmit={handleSave}>
                <div className="profile-header">
                    <h1>Особистий кабінет</h1>
                    <div className="profile-actions">
                        {isEditing ? (
                            <button type="submit" className="action-button-primary" disabled={loading}>
                                {loading ? 'Збереження...' : 'Зберегти'}
                            </button>
                        ) : (
                            <button type="button" className="action-button-primary" onClick={() => setIsEditing(true)}>
                                Редагувати
                            </button>
                        )}
                    </div>
                </div>

                {!isEditing && !user.firstName && (
                     <div className="profile-notification">
                        Будь ласка, заповніть ваші особисті дані.
                     </div>
                )}

                <section className="profile-section">
                    <h2>Ваші дані</h2>
                    <div className="data-grid">
                        <div className="data-item">
                            <span className="data-label">Ім'я</span>
                            {isEditing ? (
                                <input className="data-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                            ) : (
                                <span className="data-value">{user.firstName || 'Не вказано'}</span>
                            )}
                        </div>
                        <div className="data-item">
                            <span className="data-label">Прізвище</span>
                            {isEditing ? (
                                <input className="data-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                            ) : (
                                <span className="data-value">{user.lastName || 'Не вказано'}</span>
                            )}
                        </div>
                        <div className="data-item">
                            <span className="data-label">По батькові</span>
                            {isEditing ? (
                                <input className="data-input" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                            ) : (
                                <span className="data-value">{user.middleName || 'Не вказано'}</span>
                            )}
                        </div>
                        <div className="data-item">
                            <span className="data-label">Електронна пошта</span>
                            <span className="data-value">{user.email}</span>
                        </div>
                        <div className="data-item">
                            <span className="data-label">Ваша поточна роль</span>
                            <span className="data-value">{user.role}</span>
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
};

export default PersonalData;
