"use client";

import React from 'react';

const PersonalData = () => {
    return (
        <div>
            <nav style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <button style={{ background: 'darkorange', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px' }}>
                    Додати оголошення
                </button>
            </nav>
            
            <div className="profile-content-sections">
                <h2>Мій акаунт Wolfix</h2>
                <p>Тут буде контент покупця з особистими даними, адресою, бонусами і т.д.</p>
            </div>
        </div>
    );
};

export default PersonalData;