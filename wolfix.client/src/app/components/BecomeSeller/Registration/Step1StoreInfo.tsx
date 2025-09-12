"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { RegisterSellerDto } from "@/types/auth";

interface Props {
    formData: RegisterSellerDto;
    setFormData: Dispatch<SetStateAction<RegisterSellerDto>>;
    onNext: () => void;
}

const Step1StoreInfo = ({ formData, setFormData, onNext }: Props) => {
    const [hasNoSite, setHasNoSite] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setHasNoSite(isChecked);
        if (isChecked) {
            setFormData((prev) => ({ ...prev, siteUrl: "" }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext();
    };

    return (
        <>
            <span className="form-step">1 крок</span>
            <div className="seller-form-container">
                <h2 className="form-title">Реєстрація</h2>
                <form onSubmit={handleSubmit}>
                    <fieldset className="form-fieldset">
                        <legend className="fieldset-legend">Дані про магазин</legend>
                        <div className="form-group">
                            <label htmlFor="companyName" className="form-label">Назва компанії*</label>
                            <input
                                type="text"
                                id="companyName"
                                className="form-input"
                                value={formData.companyName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="siteUrl" className="form-label">Адреса сайту*</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">https://</span>
                                <input
                                    type="text"
                                    id="siteUrl"
                                    className="form-input"
                                    value={formData.siteUrl}
                                    onChange={handleChange}
                                    disabled={hasNoSite}
                                    required={!hasNoSite}
                                />
                            </div>
                        </div>
                        <div className="form-group-checkbox">
                            <input
                                type="checkbox"
                                id="hasNoSite"
                                checked={hasNoSite}
                                onChange={handleCheckboxChange}
                            />
                            <label htmlFor="hasNoSite" className="checkbox-label">У мене немає сайту магазину</label>
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

export default Step1StoreInfo;