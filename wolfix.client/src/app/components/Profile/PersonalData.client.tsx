"use client";

import { useAuth } from "../../../contexts/AuthContext";

const PersonalData = () => {
    const { user } = useAuth();

    if (!user) {
        return <div>Завантаження даних користувача...</div>;
    }

    return (
        <div className="profile-content">
            <div className="profile-header">
                <h1>Особистий кабінет</h1>
                <div className="profile-actions">
                    <button className="action-button-primary">Редагувати</button>
                </div>
            </div>

            <section className="profile-section">
                <h2>Ваші дані</h2>
                <div className="data-grid">
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
        </div>
    );
};

export default PersonalData;