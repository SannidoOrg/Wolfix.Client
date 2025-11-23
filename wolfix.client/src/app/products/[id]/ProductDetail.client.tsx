"use client";

import { FC, useState, useEffect, useCallback } from "react";
import { ProductFullDto } from "@/types/product";
import { ProductReviewDto } from "@/types/review";
import { useUser } from "@/contexts/UserContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import "../../../styles/ProductDetailPage.css";
import ReviewModal from "../../components/ReviewModal/ReviewModal.client";

interface Props {
    product: ProductFullDto;
}

const ProductDetailClient: FC<Props> = ({ product }) => {
    const [activeImage, setActiveImage] = useState(product.medias.find(m => m.isMain)?.url || "/placeholder.png");

    // Состояние отзывов
    const [reviews, setReviews] = useState<ProductReviewDto[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    // Состояние модалки отзыва
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const { addToCart } = useUser();
    const { isAuthenticated } = useAuth();

    // Выносим загрузку отзывов в функцию, чтобы вызывать её после добавления нового отзыва
    const fetchReviews = useCallback(async () => {
        try {
            // Если API поддерживает пагинацию, здесь можно добавить параметры. Пока грузим первые 20.
            const response = await api.get(`/api/products/${product.id}/reviews?pageSize=20`);
            setReviews(response.data.items || []);
        } catch (error) {
            console.error("Failed to load reviews", error);
        } finally {
            setLoadingReviews(false);
        }
    }, [product.id]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleAddToCart = () => {
        addToCart(product.id);
        // Можно добавить уведомление через GlobalContext, если нужно
    };

    const handleOpenReviewModal = () => {
        if (!isAuthenticated) {
            alert("Будь ласка, увійдіть в акаунт, щоб залишити відгук.");
            return;
        }
        setIsReviewModalOpen(true);
    };

    const renderStars = (rating: number) => {
        return (
            <span style={{ color: '#FF6B00', fontSize: '18px', letterSpacing: '2px' }}>
                {"★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating))}
            </span>
        );
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
                        {renderStars(product.averageRating)}
                        <span style={{marginLeft: '8px', color: '#666'}}>({reviews.length} відгуків)</span>
                        <span style={{marginLeft: '15px'}}>Код: {product.id.slice(0, 8)}</span>
                        <span style={{marginLeft: '15px', color: product.status === 'InStock' ? 'green' : 'red', fontWeight: 500}}>
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

                    <div style={{marginTop: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fff'}}>
                        <p style={{margin:0, fontSize: '14px', color:'#777'}}>Продавець:</p>
                        <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'5px'}}>
                            {product.seller.sellerPhotoUrl ? (
                                <img src={product.seller.sellerPhotoUrl} style={{width:30, height:30, borderRadius:'50%', objectFit: 'cover'}} alt="Seller" />
                            ) : (
                                <div style={{width:30, height:30, borderRadius:'50%', backgroundColor:'#eee', display:'flex', alignItems:'center', justifyContent:'center'}}>🏪</div>
                            )}
                            <b>{product.seller.sellerFullName}</b>
                        </div>
                    </div>
                </div>
            </div>

            {product.description && (
                <div className="info-section">
                    <h2>Опис</h2>
                    <div dangerouslySetInnerHTML={{ __html: product.description }} style={{lineHeight: '1.6', color: '#444'}} />
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
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px'}}>
                    <h2 style={{margin: 0, border: 'none', padding: 0}}>Відгуки ({reviews.length})</h2>
                    <button
                        onClick={handleOpenReviewModal}
                        style={{
                            backgroundColor: '#fff',
                            border: '1px solid #FF6B00',
                            color: '#FF6B00',
                            padding: '8px 20px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: '14px'
                        }}
                    >
                        Написати відгук
                    </button>
                </div>

                {loadingReviews ? (
                    <p style={{color: '#777', textAlign: 'center', padding: '20px'}}>Завантаження відгуків...</p>
                ) : reviews.length > 0 ? (
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review.id} style={{borderBottom: '1px solid #f0f0f0', paddingBottom: '20px', marginBottom: '20px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                    <div style={{fontWeight: 'bold', fontSize: '16px'}}>
                                        {/* Имя пользователя не приходит в DTO отзыва, выводим заглушку или Title как имя, если подходит по логике */}
                                        Користувач
                                    </div>
                                    <div style={{color: '#999', fontSize: '13px'}}>{formatDate(review.createdAt)}</div>
                                </div>

                                <div style={{marginBottom: '10px'}}>
                                    {renderStars(review.rating)}
                                </div>

                                {review.title && (
                                    <div style={{fontWeight: '600', marginBottom: '5px', color: '#333'}}>
                                        {review.title}
                                    </div>
                                )}

                                <p style={{lineHeight: '1.5', margin: 0, color: '#555'}}>{review.text}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{textAlign: 'center', padding: '40px 0', color: '#888'}}>
                        <p>До цього товару ще немає відгуків.</p>
                        <p>Будьте першим, хто поділиться враженнями!</p>
                    </div>
                )}
            </div>

            {/* Модальное окно отзыва */}
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                productId={product.id}
                productTitle={product.title}
                onSuccess={fetchReviews}
            />
        </div>
    );
};

export default ProductDetailClient;