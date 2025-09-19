"use client";

import React, { useState, useEffect } from 'react';
import { useProducts } from '../../../contexts/ProductContext';
import { useGlobalContext } from '../../../contexts/GlobalContext';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import AttributeFieldRenderer from './AttributeFieldRenderer.client';
import '../../../styles/AddListing.css';

interface Category {
    id: string;
    name: string;
}

export interface AttributeValue {
    id: string;
    value: string;
}

export interface CategoryAttribute {
    key: string;
    type: 'SingleSelect' | 'MultiSelect' | 'Text';
    values: AttributeValue[];
}

const AddListingClient = () => {
    const { createProduct } = useProducts();
    const { showNotification, loading } = useGlobalContext();
    const router = useRouter();

    const [parentCategories, setParentCategories] = useState<Category[]>([]);
    const [childCategories, setChildCategories] = useState<Category[]>([]);
    const [attributes, setAttributes] = useState<CategoryAttribute[]>([]);
    const [selectedParentCategory, setSelectedParentCategory] = useState('');
    
    const [productData, setProductData] = useState({
        title: '',
        description: '',
        price: 0,
        status: 'New',
        categoryId: '',
        attributes: [] as { key: string; value: string | string[] }[],
    });
    const [mediaFile, setMediaFile] = useState<File | null>(null);

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
        setAttributes([]);
        setProductData(prev => ({ ...prev, categoryId: '', attributes: [] }));

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
        setProductData(prev => ({ ...prev, categoryId: childId, attributes: [] }));
        setAttributes([]);

        if (childId) {
            try {
                const response = await api.post(`/api/categories/child/${childId}/attributes`);
                setAttributes(response.data);
            } catch (error) {
                 console.error("Не вдалося завантажити атрибути", error);
            }
        }
    };

    const handleAttributeChange = (key: string, value: string | string[]) => {
        setProductData(prev => {
            const otherAttributes = prev.attributes.filter(attr => attr.key !== key);
            if ((Array.isArray(value) && value.length === 0) || !value) {
                return { ...prev, attributes: otherAttributes };
            }
            return {
                ...prev,
                attributes: [...otherAttributes, { key, value }],
            };
        });
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMediaFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const submissionData = new FormData();
        submissionData.append('title', productData.title);
        submissionData.append('description', productData.description);
        submissionData.append('price', String(productData.price));
        submissionData.append('status', productData.status);
        submissionData.append('categoryId', productData.categoryId);
        submissionData.append('attributes', JSON.stringify(productData.attributes));

        if (mediaFile) {
            submissionData.append('media', mediaFile);
        }
        
        const response = await createProduct(submissionData);

        if (response && response.status >= 200 && response.status < 300) {
            showNotification('Оголошення успішно розміщено', 'success');
            router.push('/');
        } else {
            showNotification('Помилка при створенні оголошення', 'error');
        }
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
                            <label htmlFor="category">Категорія</label>
                            <select id="category" value={selectedParentCategory} onChange={handleParentCategoryChange}>
                                <option value="">Оберіть категорію</option>
                                {parentCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div className="form-field">
                            <label htmlFor="title">Заголовок</label>
                            <input type="text" id="title" name="title" value={productData.title} onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="subCategory">Підкатегорія</label>
                            <select id="subCategory" value={productData.categoryId} onChange={handleChildCategoryChange} disabled={!selectedParentCategory}>
                                <option value="">Оберіть підкатегорію</option>
                                {childCategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                            </select>
                        </div>
                        
                        {attributes.map(attr => (
                           <AttributeFieldRenderer 
                                key={attr.key} 
                                attribute={attr} 
                                value={productData.attributes.find(a => a.key === attr.key)?.value || []}
                                onChange={handleAttributeChange} 
                            />
                        ))}
                    </div>
                    <div className="form-field">
                        <label htmlFor="description">Опис</label>
                        <textarea id="description" name="description" value={productData.description} onChange={handleChange} rows={8}></textarea>
                    </div>
                    <div className="form-grid">
                         <div className="form-field">
                            <label htmlFor="price">Ціна</label>
                            <input type="number" step="0.01" id="price" name="price" value={productData.price || ''} onChange={handleChange} required />
                        </div>
                        <div className="form-field">
                            <label htmlFor="status">Статус</label>
                            <select id="status" name="status" value={productData.status} onChange={handleChange}>
                                <option value="New">Новий</option>
                                <option value="Used">Б/У</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="form-section">
                    <h2>Фото та медіа</h2>
                    <div className="file-uploader">
                        <input type="file" id="media" name="media" onChange={handleFileChange} accept="image/*,video/*"/>
                        <label htmlFor="media" className="file-uploader-label">
                            <span>Завантажити фото</span>
                        </label>
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