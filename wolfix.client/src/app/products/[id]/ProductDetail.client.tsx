"use client";

import { FC, useState, useEffect } from "react";
import { ProductFullDto } from "@/types/product";
import { ProductReviewDto } from "@/types/review";
import { useUser } from "@/contexts/UserContext";
import api from "@/lib/api";
import "../../../styles/ProductDetailPage.css";

interface Props {
    product: ProductFullDto;
}

const ProductDetailClient: FC<Props> = ({ product }) => {
    const [activeImage, setActiveImage] = useState(product.medias.find(m => m.isMain)?.url || "/placeholder.png");

    const [reviews, setReviews] = useState<ProductReviewDto[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    const { addToCart } = useUser();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get(`/api/products/${product.id}/reviews?pageSize=10`);
                setReviews(response.data.items || []);
            } catch (error) {
                console.error("Failed to load reviews", error);
            } finally {
                setLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [product.id]);

    const handleAddToCart = () => {
        addToCart(product.id);
        alert("Товар додано до кошика!");
    };

    const renderStars = (rating: number) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('uk-UA');
    };

    return (
        <div className="product-detail-container">
            <div className="product-main-grid">
                {/* Левая колонка: Галерея */}
                <div className="gallery-container">
                    <div className="main-image-wrapper">
                        <img src={activeImage} alt={product.title} className="main-image" />
                    </div>
                    {product.medias.length > 1 && (
                        <div className="thumbnails">
                            {product.medias.map((media, idx) => (
                                <img
                                    key={idx}
                                    src={media.url}
                                    className={`thumbnail ${activeImage === media.url ? 'active' : ''}`}
                                    onClick={() => setActiveImage(media.url)}
                                    alt={`thumb-${idx}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Правая колонка: Инфо */}
                <div className="product-info-col">
                    <h1>{product.title}</h1>

                    <div className="rating-row">
                        <span style={{color: '#FF6B00', fontSize: '18px'}}>{renderStars(Math.round(product.averageRating))}</span>
                        <span style={{marginLeft: '8px'}}>{product.averageRating}</span>
                        <span style={{marginLeft: '15px'}}>Код: {product.id.slice(0, 8)}</span>
                        <span style={{marginLeft: '15px', color: product.status === 'InStock' ? 'green' : 'red'}}>
                            {product.status === 'InStock' ? 'В наявності' : 'Немає в наявності'}
                        </span>
                    </div>

                    <div className="price-block">
                        {product.price !== product.finalPrice && (
                            <div className="old-price">{product.price.toLocaleString()} грн</div>
                        )}
                        <div className="current-price">{product.finalPrice.toLocaleString()} грн</div>
                        {product.bonuses > 0 && (
                            <div className="bonuses">+ {product.bonuses} бонусів</div>
                        )}

                        <div className="actions-row">
                            <button className="buy-btn" onClick={handleAddToCart}>Купити</button>
                            <button className="credit-btn">Купити в кредит</button>
                        </div>
                    </div>

                    <div className="short-specs">
                        <h3>Основні характеристики:</h3>
                        <ul style={{paddingLeft: '20px', color: '#555', lineHeight: '1.6'}}>
                            {product.attributes.slice(0, 5).map((attr, i) => (
                                <li key={i}><b>{attr.key}:</b> {attr.value}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{marginTop: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px'}}>
                        <p style={{margin:0, fontSize: '14px', color:'#777'}}>Продавець:</p>
                        <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'5px'}}>
                            {product.seller.sellerPhotoUrl && (
                                <img src={product.seller.sellerPhotoUrl} style={{width:30, height:30, borderRadius:'50%', objectFit: 'cover'}} alt="Seller" />
                            )}
                            <b>{product.seller.sellerFullName}</b>
                        </div>
                    </div>
                </div>
            </div>

            {product.description && (
                <div className="info-section">
                    <h2>Опис</h2>
                    <div dangerouslySetInnerHTML={{ __html: product.description }} style={{lineHeight: '1.6'}} />
                </div>
            )}

            <div className="info-section">
                <h2>Характеристики</h2>
                <table className="attributes-table">
                    <tbody>
                    {product.attributes.map((attr, i) => (
                        <tr key={i}>
                            <td className="attr-key">{attr.key}</td>
                            <td className="attr-val">{attr.value}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="info-section">
                <h2 style={{marginBottom: '20px'}}>Відгуки ({reviews.length})</h2>

                {loadingReviews ? (
                    <p style={{color: '#777'}}>Завантаження відгуків...</p>
                ) : reviews.length > 0 ? (
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review.id} style={{borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                    <div style={{fontWeight: 'bold'}}>
                                        {review.title || "Користувач"}
                                    </div>
                                    <div style={{color: '#888', fontSize: '14px'}}>{formatDate(review.createdAt)}</div>
                                </div>
                                <div style={{color: '#FF6B00', marginBottom: '8px', fontSize: '14px'}}>
                                    {renderStars(review.rating)}
                                </div>
                                <p style={{lineHeight: '1.5', margin: 0}}>{review.text}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{color: '#777'}}>До цього товару ще немає відгуків. Будьте першим!</p>
                )}
            </div>
        </div>
    );
};

export default ProductDetailClient;