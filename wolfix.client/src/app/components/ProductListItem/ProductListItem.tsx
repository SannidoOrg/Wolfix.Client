"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductListItemProps {
    product: {
        id: string;
        photoUrl: string;
        title: string;
        price: number;
    };
    onRemove: (id: string) => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, onRemove }) => {
    return (
        <div className="list-item">
            <Link href={`/product/${product.id}`} className="list-item-image-link">
                <Image
                    src={product.photoUrl || 'https://placehold.co/100x100/eee/ccc?text=No+Image'}
                    alt={product.title}
                    width={100}
                    height={100}
                    className="list-item-image"
                />
            </Link>
            <div className="list-item-details">
                <Link href={`/product/${product.id}`}>
                    <h3 className="list-item-title">{product.title}</h3>
                </Link>
                <p className="list-item-price">{new Intl.NumberFormat('uk-UA').format(product.price)} грн</p>
            </div>
            <button onClick={() => onRemove(product.id)} className="list-item-remove-button">
                Видалити
            </button>
        </div>
    );
};

export default ProductListItem;