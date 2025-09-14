"use client";

import { Dispatch, SetStateAction } from "react";
import { RegisterSellerDto } from "@/types/auth";

interface Props {
    formData: Omit<RegisterSellerDto, 'document'>;
    setFormData: Dispatch<SetStateAction<Omit<RegisterSellerDto, 'document'>>>;
    setDocumentFile: Dispatch<SetStateAction<File | null>>;
    onBack: () => void;
    onSubmit: () => void;
}

const Step2AddressAndAccount = ({ formData, setFormData, setDocumentFile, onBack, onSubmit }: Props) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setDocumentFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <>
            <span className="form-step">Крок 2 з 2</span>
            <div className="seller-form-container">
                <h2 className="form-title">Адреса та дані для входу</h2>
                <form onSubmit={handleSubmit}>
                    <fieldset className="form-fieldset">
                        <legend className="fieldset-legend">Адреса</legend>
                         <div className="form-group">
                            <label htmlFor="city" className="form-label">Місто*</label>
                            <input type="text" id="city" className="form-input" value={formData.city} onChange={handleChange} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="street" className="form-label">Вулиця*</label>
                            <input type="text" id="street" className="form-input" value={formData.street} onChange={handleChange} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="houseNumber" className="form-label">Номер будинку*</label>
                            <input type="text" id="houseNumber" className="form-input" value={formData.houseNumber} onChange={handleChange} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="apartmentNumber" className="form-label">Номер квартири</label>
                            <input type="text" id="apartmentNumber" className="form-input" value={formData.apartmentNumber} onChange={handleChange} />
                        </div>
                    </fieldset>

                    <fieldset className="form-fieldset">
                        <legend className="fieldset-legend">Дані для входу</legend>
                         <div className="form-group">
                            <label htmlFor="email" className="form-label">E-mail*</label>
                            <input type="email" id="email" className="form-input" value={formData.email} onChange={handleChange} required />
                        </div>
                         <div className="form-group">
                            <label htmlFor="password" className="form-label">Пароль*</label>
                            <input type="password" id="password" className="form-input" value={formData.password} onChange={handleChange} required />
                        </div>
                    </fieldset>

                     <fieldset className="form-fieldset">
                        <legend className="fieldset-legend">Документи</legend>
                         <div className="form-group">
                            <label htmlFor="document" className="form-label">Завантажте документ*</label>
                            <input type="file" id="document" className="form-input" onChange={handleFileChange} required />
                        </div>
                    </fieldset>
                    <p className="form-footnote">*Поля обов'язкові до заповнення</p>
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

export default Step2AddressAndAccount;