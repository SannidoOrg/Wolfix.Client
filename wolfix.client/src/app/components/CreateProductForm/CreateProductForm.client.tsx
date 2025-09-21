"use client";

import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useProducts } from "../../../contexts/ProductContext";

const CreateProductForm = () => {
    const { user } = useAuth();
    const { createProduct } = useProducts();
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const productFormData = new FormData();
        productFormData.append('name', name);
        productFormData.append('description', '...');
        productFormData.append('price', '100');
        productFormData.append('categoryId', '...');
        productFormData.append('stock', '10');

        const response = await createProduct(productFormData);
        if (response && response.status >= 200 && response.status < 300) {
            alert("Товар успішно створено!");
        } else {
            alert("Помилка створення товару.");
        }
    };
    
    if (!user || !['Admin', 'Seller'].includes(user.role)) {
        return <p>У вас немає прав для додавання товару.</p>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>Додати новий товар</h3>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Назва товару" />
            <button type="submit">Створити товар</button>
        </form>
    );
};

export default CreateProductForm;