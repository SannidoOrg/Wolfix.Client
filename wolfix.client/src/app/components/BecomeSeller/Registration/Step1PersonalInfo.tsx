"use client";

import { Dispatch, SetStateAction } from "react";
import { RegisterSellerDto } from "@/types/auth";

interface Props {
    formData: Omit<RegisterSellerDto, 'document'>;
    setFormData: Dispatch<SetStateAction<Omit<RegisterSellerDto, 'document'>>>;
    onNext: () => void;
}

const Step1PersonalInfo = ({ formData, setFormData, onNext }: Props) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <>
            <span className="form-step">Крок 1 з 2</span>
            <div className="seller-form-container">
                <h2 className="form-title">Особиста інформація</h2>
                <form onSubmit={handleSubmit}>
                    <fieldset className="form-fieldset">
                        <div className="form-group">
                            <label htmlFor="lastName" className="form-label">Прізвище*</label>
                            <input type="text" id="lastName" className="form-input" value={formData.lastName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName" className="form-label">Ім'я*</label>
                            <input type="text" id="firstName" className="form-input" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="middleName" className="form-label">По-батькові*</label>
                            <input type="text" id="middleName" className="form-input" value={formData.middleName} onChange={handleChange} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="birthDate" className="form-label">Дата народження*</label>
                            <input type="date" id="birthDate" className="form-input" value={formData.birthDate} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber" className="form-label">Номер телефону*</label>
                            <input type="tel" id="phoneNumber" className="form-input" value={formData.phoneNumber} onChange={handleChange} required placeholder="+380..." />
                        </div>
                        <p className="form-footnote">*Поля обов'язкові до заповнення</p>
                    </fieldset>
                    <div className="form-actions">
                        <button type="submit" className="submit-button">Продовжити</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Step1PersonalInfo;