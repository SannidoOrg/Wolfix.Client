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
        const productData = { name, description: '...', price: 100, categoryId: '...', stock: 10 };
        const response = await createProduct(productData);
        if (response.status === 201) {
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