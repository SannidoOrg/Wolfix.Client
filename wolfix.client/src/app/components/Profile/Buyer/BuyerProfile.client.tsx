"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { useAuth } from '../../../../contexts/AuthContext';

const BuyerProfile = () => {
    const { user, refetchUser, updateUserFullName, updateUserPhoneNumber, updateUserAddress, updateUserBirthDate } = useAuth();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        phoneNumber: '',
        birthDate: '2000-01-01',
        city: '',
        street: '',
        houseNumber: '',
        apartmentNumber: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                middleName: user.middleName || '',
                phoneNumber: user.phoneNumber || '',
                birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '2000-01-01',
                city: user.address?.city || '',
                street: user.address?.street || '',
                houseNumber: user.address?.houseNumber || '',
                apartmentNumber: user.address?.apartmentNumber || ''
            });
        }
    }, [user]);

    const handleCancel = () => {
        setIsEditing(false);
    };
    
    const handleSave = async () => {
        const results = await Promise.all([
            updateUserFullName({
                firstName: formData.firstName,
                lastName: formData.lastName,
                middleName: formData.middleName
            }),
            updateUserPhoneNumber({ phoneNumber: formData.phoneNumber }),
            updateUserAddress({
                city: formData.city,
                street: formData.street,
                houseNumber: formData.houseNumber,
                apartmentNumber: formData.apartmentNumber
            }),
            updateUserBirthDate({ birthDate: formData.birthDate })
        ]);

        if (results.every(res => res)) {
            await refetchUser();
            setIsEditing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (part: 'year' | 'month' | 'day', value: string) => {
        const dateParts = formData.birthDate.split('-');
        let [year, month, day] = dateParts;

        if (part === 'year') year = value;
        if (part === 'month') month = value.padStart(2, '0');
        if (part === 'day') day = value.padStart(2, '0');

        setFormData(prev => ({ ...prev, birthDate: `${year}-${month}-${day}` }));
    };
    
    const renderField = (label: string, value: string | null | undefined) => (
        <div className="data-item">
            <span className="data-label">{label}</span>
            <span className="data-value">{value || ''}</span>
        </div>
    );

    const renderEditableField = (label: string, name: keyof typeof formData, value: string, type: string = 'text') => (
        <div className="data-item">
            <label className="data-label" htmlFor={name}>{label}</label>
            <input
                className="data-input"
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
    
    if (!user) {
        return <div className="loader">Завантаження...</div>;
    }

    const [year, month, day] = formData.birthDate.split('-');
    
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    
    const fullName = `${user.lastName || ''} ${user.firstName || ''} ${user.middleName || ''}`;
    const fullAddress = user.address ? `м. ${user.address.city}, вул. ${user.address.street}, буд. ${user.address.houseNumber}, кв. ${user.address.apartmentNumber}` : '';
    
    const formattedBirthDate = user.birthDate ? (() => {
        const date = new Date(user.birthDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    })() : '';

    return (
        <div className="user-profile-container">
            <div className="profile-main-header">
                <Image src="/icons/prof.png" alt="User Avatar" width={64} height={64}/>
                <h1 className="profile-user-name">{fullName}</h1>
                <div className="profile-actions">
                    <button className="delete-button">Видалити</button>
                    {!isEditing && <button className="edit-button" onClick={() => setIsEditing(true)}>Редагувати</button>}
                </div>
            </div>
            
            <div className="profile-section">
                <h2 className="section-title">Особисті дані</h2>
                <div className="data-grid">
                    {isEditing ? renderEditableField("Телефон", "phoneNumber", formData.phoneNumber, "tel") : renderField("Телефон", user.phoneNumber)}
                    {renderField("Електронна пошта", user.email)}
                    <div className="data-item">
                        <span className="data-label">Дата народження</span>
                        {isEditing ? (
                            <div className="date-select-group">
                                <div className="date-select-item">
                                    <label className="date-select-label">Рік</label>
                                    <select className="date-select" value={year} onChange={(e) => handleDateChange('year', e.target.value)}>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="date-select-item">
                                    <label className="date-select-label">Місяць</label>
                                    <select className="date-select" value={parseInt(month, 10)} onChange={(e) => handleDateChange('month', e.target.value)}>
                                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                </div>
                                <div className="date-select-item">
                                    <label className="date-select-label">День</label>
                                    <select className="date-select" value={parseInt(day, 10)} onChange={(e) => handleDateChange('day', e.target.value)}>
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <span className="data-value">{formattedBirthDate}</span>
                        )}
                    </div>
                    {renderField("Стать", "Чоловіча")}
                </div>
                {isEditing && (
                    <div className="data-grid-single">
                        {renderEditableField("Прізвище", "lastName", formData.lastName)}
                        {renderEditableField("Ім'я", "firstName", formData.firstName)}
                        {renderEditableField("По-батькові", "middleName", formData.middleName)}
                    </div>
                )}
            </div>

            <div className="profile-section">
                <h2 className="section-title">Мої адреси доставки</h2>
                <div className="data-grid">
                     {isEditing ? (
                        <>
                            {renderEditableField("Місто", "city", formData.city)}
                            {renderEditableField("Вулиця", "street", formData.street)}
                            {renderEditableField("Будинок", "houseNumber", formData.houseNumber)}
                            {renderEditableField("Квартира", "apartmentNumber", formData.apartmentNumber)}
                        </>
                     ) : (
                        <div className="address-item">
                            <span className="address-value">{fullAddress}</span>
                            <span className="address-label">Адреса за замовчуванням</span>
                        </div>
                     )}
                </div>
            </div>

            {isEditing && (
                <div className="form-actions-footer">
                    <button className="cancel-button-footer" onClick={handleCancel}>Скасувати</button>
                    <button className="save-button-footer" onClick={handleSave}>Зберегти зміни</button>
                </div>
            )}
        </div>
    );
};

export default BuyerProfile;