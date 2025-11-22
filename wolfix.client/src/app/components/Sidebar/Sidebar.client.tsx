"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import "../../../styles/Sidebar.css";

interface CategoryDto {
    id: string;
    name: string;
    photoUrl: string | null;
}

interface ISidebarProps {
    style?: React.CSSProperties;
    className?: string;
}

const Sidebar: FC<ISidebarProps> = ({ style, className }) => {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/api/categories/parent');
                setCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <aside className={className} style={style}>
                <div className="sidebar-loading">Завантаження...</div>
            </aside>
        );
    }

    return (
        <aside className={className} style={style}>
            {categories.length > 0 ? (
                categories.map(category => (
                    <Link
                        href={`/categories/${category.id}`}
                        className="sidebar-link"
                        key={category.id}
                    >
                        <div className="sidebar-icon-wrapper">
                            <img
                                src={category.photoUrl || "/icons/cataloge.png"}
                                alt={category.name}
                                className="sidebar-icon"
                            />
                        </div>
                        <span className="sidebar-text">{category.name}</span>
                    </Link>
                ))
            ) : (
                <div className="sidebar-empty">Категорії не знайдено</div>
            )}
        </aside>
    );
};

export default Sidebar;