"use client";

import { Dispatch, SetStateAction } from "react";
import { SellerApplicationDto, Category } from "@/types/auth";

interface Props {
    formData: Omit<SellerApplicationDto, 'document'>;
    setFormData: Dispatch<SetStateAction<Omit<SellerApplicationDto, 'document'>>>;
    parentCategories: Category[];
    childCategories: Category[];
    selectedParent: string;
    setSelectedParent: Dispatch<SetStateAction<string>>;
    onNext: () => void;
}

const Step1PersonalInfo = ({ formData, setFormData, parentCategories, childCategories, selectedParent, setSelectedParent, onNext }: Props) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleParentCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedParent(e.target.value);
        setFormData((prev) => ({ ...prev, categoryId: "", categoryName: "" }));
    };

    const handleChildCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = e.target.selectedIndex;
        if (selectedIndex > 0) {
            const selectedOption = e.target.options[selectedIndex];
            const categoryId = selectedOption.value;
            const categoryName = selectedOption.text;
            setFormData((prev) => ({ ...prev, categoryId, categoryName }));
        } else {
            setFormData((prev) => ({ ...prev, categoryId: "", categoryName: "" }));
        }
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
                        <div className="form-group">
                            <label htmlFor="parentCategory" className="form-label">Основна категорія*</label>
                            <select id="parentCategory" className="form-input" value={selectedParent} onChange={handleParentCategoryChange} required>
                                <option value="">Оберіть основну категорію...</option>
                                {parentCategories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        {selectedParent && childCategories.length > 0 && (
                            <div className="form-group">
                                <label htmlFor="categoryId" className="form-label">Підкатегорія*</label>
                                <select id="categoryId" className="form-input" value={formData.categoryId} onChange={handleChildCategoryChange} required>
                                    <option value="">Оберіть підкатегорію...</option>
                                    {childCategories.map(category => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
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