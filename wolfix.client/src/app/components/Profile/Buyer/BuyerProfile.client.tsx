"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

interface BuyerData {
    firstName: string;
    lastName: string;
    middleName: string;
    phoneNumber: string;
    city: string;
    street: string;
    houseNumber: string;
    apartmentNumber: string;
    birthDate: string;
    language: string;
}

interface AccordionProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}

const Accordion = ({ title, subtitle, children }: AccordionProps) => (
    <details className="seller-profile-accordion">
        <summary>
            <div><strong>{title}</strong>{subtitle && <span>{subtitle}</span>}</div>
            <span className="accordion-arrow">▼</span>
        </summary>
        <div className="seller-profile-accordion-content">{children}</div>
    </details>
);

interface EditableSectionProps {
    children: React.ReactNode;
    onSave: () => void;
    onCancel: () => void;
}

const EditableSection = ({ children, onSave, onCancel }: EditableSectionProps) => {
    return (
        <div className="editable-section">
            {children}
            <div className="form-actions">
                <button onClick={onCancel} className="cancel-button">Скасувати</button>
                <button onClick={onSave} className="save-button">Зберегти</button>
            </div>
        </div>
    );
};

const BuyerProfile = () => {
    const { user, updateUserFullName, updateUserPhoneNumber, updateUserAddress, updateUserBirthDate } = useAuth();
    const [profileData, setProfileData] = useState<BuyerData | null>(null);
    const [formData, setFormData] = useState<Partial<BuyerData>>({});
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const initialData = {
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                middleName: user.middleName || '',
                phoneNumber: user.phoneNumber || '',
                birthDate: user.birthDate || '',
                language: 'Українська',
                city: user.address?.city || '',
                street: user.address?.street || '',
                houseNumber: user.address?.houseNumber || '',
                apartmentNumber: user.address?.apartmentNumber || '',
            };
            setProfileData(initialData);
            setFormData(initialData);
            setIsLoading(false);
        }
    }, [user]);

    const handleEdit = (section: string) => {
        setEditingSection(section);
        setFormData(profileData || {});
    };

    const handleCancel = () => {
        setEditingSection(null);
        setFormData(profileData || {});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (section: string) => {
        let success = false;
        if (section === 'fullName') {
            success = await updateUserFullName({ 
                firstName: formData.firstName ?? '', 
                lastName: formData.lastName ?? ''
            });
        } else if (section === 'phoneNumber') {
            success = await updateUserPhoneNumber({ phoneNumber: formData.phoneNumber ?? '' });
        } else if (section === 'address') {
            success = await updateUserAddress({
                address: {
                    city: formData.city ?? '',
                    street: formData.street ?? '',
                    houseNumber: formData.houseNumber ?? '',
                    apartmentNumber: formData.apartmentNumber ?? ''
                }
            });
        } else if (section === 'birthDate') {
            success = await updateUserBirthDate({ birthDate: formData.birthDate ?? '' });
        }
        
        if (success) {
            const updatedProfileData = { ...profileData!, ...formData } as BuyerData;
            setProfileData(updatedProfileData);
            setFormData(updatedProfileData);
            setEditingSection(null);
        }
    };
    
    if (isLoading) return <div className="loader">Завантаження даних...</div>;
    if (!profileData) return <div className="error">Не вдалося завантажити дані покупця.</div>;

    const renderField = (label: string, name: keyof BuyerData, value: string | undefined, type: string = 'text') => (
        <div className="form-field">
            <label htmlFor={name}>{label}</label>
            <input id={name} name={name} type={type} value={value || ''} onChange={handleChange} />
        </div>
    );
    
    return (
        <div className="profile-content-sections">
            <Accordion title="Мій акаунт Wolfix" subtitle={`${profileData.lastName} ${profileData.firstName}`}>
                {editingSection === 'fullName' ? (
                    <EditableSection onSave={() => handleSave('fullName')} onCancel={handleCancel}>
                        {renderField("Прізвище", "lastName", formData.lastName)}
                        {renderField("Ім'я", "firstName", formData.firstName)}
                        {renderField("По-батькові", "middleName", formData.middleName)}
                    </EditableSection>
                ) : (
                    <div className="display-section">
                        <p>{`${profileData.lastName} ${profileData.firstName} ${profileData.middleName}`}</p>
                        <button onClick={() => handleEdit('fullName')}>Редагувати</button>
                    </div>
                )}
            </Accordion>

            <Accordion title="Особисті дані" subtitle={profileData.language}>
                 {editingSection === 'birthDate' ? (
                    <EditableSection onSave={() => handleSave('birthDate')} onCancel={handleCancel}>
                        {renderField("Дата народження", "birthDate", formData.birthDate?.split('T')[0], 'date')}
                    </EditableSection>
                ) : (
                    <div className="display-section">
                        <p>Дата народження: {new Date(profileData.birthDate).toLocaleDateString()}</p>
                        <button onClick={() => handleEdit('birthDate')}>Редагувати</button>
                    </div>
                )}
            </Accordion>

            <Accordion title="Контакти" subtitle={profileData.phoneNumber}>
                 {editingSection === 'phoneNumber' ? (
                    <EditableSection onSave={() => handleSave('phoneNumber')} onCancel={handleCancel}>
                        {renderField("Номер телефону", "phoneNumber", formData.phoneNumber, 'tel')}
                    </EditableSection>
                ) : (
                    <div className="display-section">
                        <p>{profileData.phoneNumber}</p>
                        <button onClick={() => handleEdit('phoneNumber')}>Редагувати</button>
                    </div>
                )}
            </Accordion>
            
            <Accordion title="Моя адреса" subtitle={profileData.city}>
                 {editingSection === 'address' ? (
                    <EditableSection onSave={() => handleSave('address')} onCancel={handleCancel}>
                        {renderField("Місто", "city", formData.city)}
                        {renderField("Вулиця", "street", formData.street)}
                        {renderField("Дім", "houseNumber", formData.houseNumber)}
                        {renderField("Квартира", "apartmentNumber", formData.apartmentNumber)}
                    </EditableSection>
                ) : (
                    <div className="display-section">
                        <p>{`м. ${profileData.city}, вул. ${profileData.street}, ${profileData.houseNumber}/${profileData.apartmentNumber}`}</p>
                        <button onClick={() => handleEdit('address')}>Редагувати</button>
                    </div>
                )}
            </Accordion>
        </div>
    );
};

export default BuyerProfile;