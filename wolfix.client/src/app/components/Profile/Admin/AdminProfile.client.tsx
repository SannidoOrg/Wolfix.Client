"use client";

import { useState } from 'react';
import Image from "next/image";
import { useAuth } from "../../../../contexts/AuthContext";
import AdminDashboard from "./AdminDashboard.client";

const AdminProfile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'info' | 'applications'>('info');

    if (!user) {
        return <div className="loader">Завантаження...</div>;
    }

    return (
        <div className="user-profile-container">
            <div className="profile-main-header">
                <Image src="/icons/prof.png" alt="Admin Avatar" width={64} height={64}/>
                <div className="profile-user-details">
                    <h1 className="profile-user-name">Профіль Адміністратора</h1>
                    <span className="profile-user-email">{user.email}</span>
                </div>
            </div>

            <div className="profile-tabs-nav">
                <button 
                    className={`profile-tab-button ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    Особисті дані
                </button>
                <button 
                    className={`profile-tab-button ${activeTab === 'applications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('applications')}
                >
                    Керування заявками
                </button>
            </div>

            <div className="profile-tab-content">
                {activeTab === 'info' && (
                    <div className="profile-section">
                        <h2 className="section-title">Дані облікового запису</h2>
                        <div className="data-grid">
                            <div className="data-item">
                                <span className="data-label">Електронна пошта</span>
                                <span className="data-value">{user.email}</span>
                            </div>
                            <div className="data-item">
                                <span className="data-label">Роль</span>
                                <span className="data-value">{user.role}</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'applications' && (
                    <AdminDashboard />
                )}
            </div>
        </div>
    );
};

export default AdminProfile;