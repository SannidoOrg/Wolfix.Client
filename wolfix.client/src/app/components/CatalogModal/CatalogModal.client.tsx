"use client";

import { FC, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import "../../../styles/CatalogModal.css";

// Интерфейсы (дублируем или импортируем, если есть)
interface CategoryDto {
    id: string;
    name: string;
    photoUrl: string | null;
}

interface ICatalogModalProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef?: React.RefObject<HTMLElement>; // Чтобы знать позицию хедера, если нужно
}

const CatalogModal: FC<ICatalogModalProps> = ({ isOpen, onClose }) => {
    const [parents, setParents] = useState<CategoryDto[]>([]);
    const [activeParentId, setActiveParentId] = useState<string | null>(null);
    const [children, setChildren] = useState<CategoryDto[]>([]);
    const [loadingChildren, setLoadingChildren] = useState(false);
    const router = useRouter();
    const contentRef = useRef<HTMLDivElement>(null);

    // 1. Загрузка родителей при открытии
    useEffect(() => {
        if (isOpen && parents.length === 0) {
            api.get('/api/categories/parent')
                .then(res => {
                    setParents(res.data);
                    // Сразу выбираем первую категорию, чтобы справа не было пусто
                    if (res.data.length > 0) {
                        setActiveParentId(res.data[0].id);
                    }
                })
                .catch(console.error);
        }
    }, [isOpen]);

    // 2. Загрузка детей при смене активного родителя
    useEffect(() => {
        if (!activeParentId) return;

        setLoadingChildren(true);
        api.get(`/api/categories/child/${activeParentId}`)
            .then(res => {
                setChildren(res.data);
            })
            .catch(console.error)
            .finally(() => setLoadingChildren(false));
    }, [activeParentId]);

    // Закрытие по клику вне контента
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
            onClose();
        }
    };

    // Переход на страницу подкатегории
    const handleSubcategoryClick = (parentId: string, childId: string) => {
        onClose();
        router.push(`/categories/${parentId}/${childId}`);
    };

    if (!isOpen) return null;

    return (
        <div className="catalog-overlay" onClick={handleOverlayClick}>
            <div className="catalog-content" ref={contentRef}>

                {/* ЛЕВАЯ КОЛОНКА: Родители */}
                <div className="catalog-sidebar">
                    {parents.map(parent => (
                        <div
                            key={parent.id}
                            className={`catalog-parent-item ${activeParentId === parent.id ? 'active' : ''}`}
                            onMouseEnter={() => setActiveParentId(parent.id)}
                        >
                            <img
                                src={parent.photoUrl || "/icons/cataloge.png"}
                                alt={parent.name}
                                className="catalog-parent-icon"
                            />
                            <span>{parent.name}</span>
                        </div>
                    ))}
                </div>

                {/* ЦЕНТРАЛЬНАЯ КОЛОНКА: Дети (Подкатегории) */}
                <div className="catalog-subcategories">
                    {loadingChildren ? (
                        <div className="loading-state">Завантаження...</div>
                    ) : children.length > 0 ? (
                        children.map(child => (
                            <div key={child.id} className="subcategory-group">
                                <div
                                    className="subcategory-title"
                                    onClick={() => activeParentId && handleSubcategoryClick(activeParentId, child.id)}
                                >
                                    {child.name}
                                </div>
                                {/* Имитация списка моделей, так как API пока не отдает Variants списком */}
                                <ul className="subcategory-list">
                                    <li className="subcategory-item" onClick={() => activeParentId && handleSubcategoryClick(activeParentId, child.id)}>Всі товари {child.name}</li>
                                    {/* Если бы API отдавал модели, мы бы рендерили их здесь */}
                                </ul>
                            </div>
                        ))
                    ) : (
                        <div className="loading-state">Немає підкатегорій</div>
                    )}
                </div>

                {/* ПРАВАЯ КОЛОНКА: Баннер */}
                <div className="catalog-banner">
                    {/* Тут может быть динамический баннер, пока статика как в дизайне */}
                    <div style={{textAlign: 'center', marginBottom: '20px'}}>
                        <img src="/logo/wolfix-logo.png" alt="Wolfix" width={50} />
                        <h4 style={{margin: '10px 0'}}>Це змінює все.</h4>
                    </div>
                    <img src="/icons/Watch.png" alt="Apple Watch" style={{width: '150px'}} />
                </div>

            </div>
        </div>
    );
};

export default CatalogModal;