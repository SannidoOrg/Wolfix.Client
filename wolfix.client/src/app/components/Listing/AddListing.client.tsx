"use client";

import React, { useState, useEffect } from 'react';
import { useProducts } from '../../../contexts/ProductContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useGlobalContext } from '../../../contexts/GlobalContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { Category, AvailableAttribute } from '../../../types/category';

const AddListingClient = () => {
    const { user } = useAuth();
    const { createProduct } = useProducts();
    const { showNotification, loading, setLoading } = useGlobalContext();
    const router = useRouter();

    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const [childCategories, setChildCategories] = useState<Category[]>([]);
    const [availableAttributes, setAvailableAttributes] = useState<AvailableAttribute[]>([]);
    const [attributeValues, setAttributeValues] = useState<{ [key: string]: string }>({});
    
    const [selectedParentCategory, setSelectedParentCategory] = useState('');
    
    const [productData, setProductData] = useState({
        title: '',
        description: '',
        price: 0,
        status: 'InStock',
        categoryId: '',
    });
    const [mainMediaFile, setMainMediaFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchParentCategories = async () => {
            try {
                const response = await api.get('/api/categories/parent');
                setParentCategories(response.data);
            } catch (error) {
                console.error("Не вдалося завантажити категорії", error);
            }
        };
        fetchParentCategories();
    }, []);

    const handleParentCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const parentId = e.target.value;
        setSelectedParentCategory(parentId);
        setChildCategories([]);
        setAvailableAttributes([]);
        setAttributeValues({});
        setProductData(prev => ({ ...prev, categoryId: '' }));

        if (parentId) {
            try {
                const response = await api.get(`/api/categories/child/${parentId}`);
                setChildCategories(response.data);
            } catch (error) {
                console.error("Не вдалося завантажити підкатегорії", error);
            }
        }
    };

    const handleChildCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const childId = e.target.value;
        setProductData(prev => ({ ...prev, categoryId: childId }));
        setAvailableAttributes([]);
        setAttributeValues({});

        if (childId) {
            try {
                const response = await api.get<AvailableAttribute[]>(`/api/categories/child/${childId}/attributes`);
                setAvailableAttributes(response.data);
                const initialValues: { [key: string]: string } = {};
                response.data.forEach(attr => {
                    initialValues[attr.key] = '';
                });
                setAttributeValues(initialValues);
            } catch (error) {
                 console.error("Не вдалося завантажити атрибути", error);
            }
        }
    };

    const handleAttributeValueChange = (key: string, value: string) => {
        setAttributeValues(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'price') {
            const priceValue = parseFloat(value);
            setProductData(prev => ({ ...prev, price: isNaN(priceValue) ? 0 : priceValue }));
        } else {
            setProductData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMainMediaFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.profileId) {
            showNotification('Помилка: не знайдено ID продавця.', 'error');
            return;
        }
        if (!mainMediaFile) {
            showNotification('Будь ласка, завантажте головне фото.', 'error');
            return;
        }

        const unfilledAttributes = availableAttributes.filter(attr => !attributeValues[attr.key]);
        if (unfilledAttributes.length > 0) {
            showNotification(`Будь ласка, заповніть усі характеристики: ${unfilledAttributes.map(a => a.key).join(', ')}`, 'error');
            return;
        }

        setLoading(true);

        const finalAttributes = Object.entries(attributeValues).map(([key, value]) => ({ key, value }));

        const submissionData = new FormData();
        submissionData.append('title', productData.title);
        submissionData.append('description', productData.description);
        submissionData.append('price', String(productData.price));
        submissionData.append('status', productData.status);
        submissionData.append('categoryId', productData.categoryId);
        submissionData.append('sellerId', user.profileId);
        submissionData.append('attributesJson', JSON.stringify(finalAttributes));
        submissionData.append('media', mainMediaFile);
        submissionData.append('contentType', mainMediaFile.type.startsWith('video') ? 'Video' : 'Photo');
        
        const createResponse = await createProduct(submissionData);

        if (createResponse && createResponse.status >= 200 && createResponse.status < 300) {
            showNotification('Оголошення успішно розміщено', 'success');
            router.push('/');
        } else {
            const errorMsg = createResponse?.data?.title || createResponse?.data?.detail || 'Помилка при створенні оголошення';
            showNotification(errorMsg, 'error');
        }
        setLoading(false);
    };
    
    return (
        <div className="add-listing-container">
            <form onSubmit={handleSubmit} className="add-listing-form">
                <div className="form-header">
                    <button type="button" onClick={() => router.back()} className="back-button">←</button>
                    <h1>Оголошення</h1>
                </div>

                <section className="form-section">
                    <h2>Основна інформація</h2>
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="title">Заголовок</label>
                            <input type="text" id="title" name="title" value={productData.title} onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="price">Ціна</label>
                            <input type="number" step="0.01" id="price" name="price" value={productData.price || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="category">Категорія</label>
                            <select id="category" value={selectedParentCategory} onChange={handleParentCategoryChange} required>
                                <option value="">Оберіть категорію</option>
                                {parentCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div className="form-field">
                            <label htmlFor="subCategory">Підкатегорія</label>
                            <select id="subCategory" name="categoryId" value={productData.categoryId} onChange={handleChildCategoryChange} disabled={!selectedParentCategory} required>
                                <option value="">Оберіть підкатегорію</option>
                                {childCategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="description">Опис</label>
                        <textarea id="description" name="description" value={productData.description} onChange={handleChange} rows={8}></textarea>
                    </div>
                </section>

                {availableAttributes.length > 0 && (
                    <section className="form-section">
                        <h2>Характеристики</h2>
                        <div className="form-grid">
                            {availableAttributes.map(attr => (
                                <div key={attr.id} className="form-field">
                                    <label htmlFor={`attribute-${attr.key}`}>{attr.key}</label>
                                    <input
                                        type="text"
                                        id={`attribute-${attr.key}`}
                                        value={attributeValues[attr.key] || ''}
                                        onChange={(e) => handleAttributeValueChange(attr.key, e.target.value)}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                <section className="form-section">
                    <h2>Фото та медіа</h2>
                    <div className="form-field">
                        <label>Головне фото*</label>
                        <div className="file-uploader">
                            <input type="file" id="media" onChange={handleMainFileChange} accept="image/*,video/*" required/>
                            <label htmlFor="media" className="file-uploader-label">
                                {mainMediaFile ? mainMediaFile.name : 'Натисніть, щоб обрати файл'}
                            </label>
                        </div>
                    </div>
                </section>

                <div className="form-actions-footer">
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Публікація...' : 'Опублікувати'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddListingClient;