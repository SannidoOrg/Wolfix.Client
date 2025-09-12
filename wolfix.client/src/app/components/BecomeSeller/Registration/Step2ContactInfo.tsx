"use client";

import { Dispatch, SetStateAction } from "react";
import { RegisterSellerDto } from "@/types/auth";

interface Props {
    formData: RegisterSellerDto;
    setFormData: Dispatch<SetStateAction<RegisterSellerDto>>;
    onBack: () => void;
    onSubmit: () => void;
}

const Step2ContactInfo = ({ formData, setFormData, onBack, onSubmit }: Props) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <>
            <span className="form-step">2 крок</span>
            <div className="seller-form-container">
                <h2 className="form-title">Реєстрація</h2>
                <form onSubmit={handleSubmit}>
                    <fieldset className="form-fieldset">
                        <legend className="fieldset-legend">Контактна інформація</legend>
                        <div className="form-group">
                            <label htmlFor="fullName" className="form-label">ПІБ*</label>
                            <input type="text" id="fullName" className="form-input" value={formData.fullName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="position" className="form-label">Посада*</label>
                            <input type="text" id="position" className="form-input" value={formData.position} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">E-mail*</label>
                            <input type="email" id="email" className="form-input" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber" className="form-label">Номер телефону*</label>
                            <input type="tel" id="phoneNumber" className="form-input" value={formData.phoneNumber} onChange={handleChange} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="password" className="form-label">Пароль*</label>
                            <input type="password" id="password" className="form-input" value={formData.password} onChange={handleChange} required />
                        </div>
                         <div className="form-group-checkbox">
                            <input type="checkbox" id="isNonResident" />
                            <label htmlFor="isNonResident" className="checkbox-label">Нерезидент</label>
                        </div>
                        <p className="form-footnote">Заповнюючи анкету надаю згоду на обробку персональних даних...</p>
                        <p className="form-footnote">*Поля обов'язкові до заповнення</p>
                    </fieldset>
                    <div className="form-actions">
                        <button type="submit" className="submit-button">Зареєструватись</button>
                    </div>
                     <div className="form-actions" style={{marginTop: '1rem'}}>
                        <button type="button" onClick={onBack} className="return-link" style={{color: '#555', background: 'none', border: 'none', cursor: 'pointer'}}>Повернутись</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Step2ContactInfo;