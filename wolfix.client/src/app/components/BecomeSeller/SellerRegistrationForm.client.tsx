"use client";

import { useState } from "react";
import '../../../styles/SellerRegistration.css';

const SellerRegistrationForm = () => {
    const [companyName, setCompanyName] = useState("");
    const [siteUrl, setSiteUrl] = useState("");
    const [hasNoSite, setHasNoSite] = useState(false);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setHasNoSite(isChecked);
        if (isChecked) {
            setSiteUrl("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({ companyName, siteUrl, hasNoSite });
        alert("Дані форми відправлені (дивіться консоль)");
    };

    return (
        <div className="seller-form-wrapper">
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
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
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
                                    value={siteUrl}
                                    onChange={(e) => setSiteUrl(e.target.value)}
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
        </div>
    );
};

export default SellerRegistrationForm;