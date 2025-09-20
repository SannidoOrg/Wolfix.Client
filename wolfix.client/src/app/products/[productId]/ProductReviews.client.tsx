"use client";

import { useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import { useProducts } from '../../../contexts/ProductContext';
import { useAuth } from '../../../contexts/AuthContext';
import ReviewForm from './ReviewForm.client';
import { ReviewDto, ReviewsResponseDto } from '../../../types/review';

const StarRating = ({ rating }: { rating: number }) => {
    const totalStars = 5;
    const filledStars = Math.round(rating);
    let stars = [];
    for (let i = 1; i <= totalStars; i++) {
        stars.push(
            <Image 
                key={i}
                src={i <= filledStars ? "/icons/star-filled.png" : "/icons/star-empty.png"}
                alt="star"
                width={20}
                height={20}
            />
        );
    }
    return <div className={styles.starRating}>{stars}</div>;
};

interface ProductReviewsProps {
    productId: string;
    initialSummary: Omit<ReviewsResponseDto, 'reviews'>;
    initialReviews: ReviewDto[];
}

export default function ProductReviews({ productId, initialSummary, initialReviews }: ProductReviewsProps) {
  const { fetchProductReviews } = useProducts();
  const { isAuthenticated } = useAuth();
  
  const [summary, setSummary] = useState(initialSummary);
  const [reviews, setReviews] = useState<ReviewDto[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [hasMore, setHasMore] = useState(initialReviews.length === 10);
  const [isLoading, setIsLoading] = useState(false);
  
  const PAGE_SIZE = 10;

  const loadMoreReviews = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    const lastId = reviews.length > 0 ? reviews[reviews.length - 1].id : undefined;
    const data: ReviewsResponseDto | null = await fetchProductReviews(productId, { pageSize: PAGE_SIZE, lastId });

    if (data && data.reviews && data.reviews.length > 0) {
        setReviews(prev => [...prev, ...data.reviews]);
        if (data.reviews.length < PAGE_SIZE) {
            setHasMore(false);
        }
    } else {
        setHasMore(false);
    }
    setIsLoading(false);
  }, [productId, fetchProductReviews, reviews, isLoading, hasMore]);

  const refreshReviews = async () => {
    setIsLoading(true);
    const data: ReviewsResponseDto | null = await fetchProductReviews(productId, { pageSize: PAGE_SIZE });
    if (data) {
        setSummary({
            totalReviews: data.totalReviews,
            averageRating: data.averageRating,
            ratingBreakdown: data.ratingBreakdown,
        });
        setReviews(data.reviews || []);
        setHasMore((data.reviews || []).length === PAGE_SIZE);
    }
    setShowForm(false);
    setIsLoading(false);
  };

  if (!summary) {
    return <div className={styles.reviewsBox}>Завантаження відгуків...</div>;
  }

  return (
    <div className={styles.reviewsBox}>
      <h2 className={styles.reviewsTitle}>Відгуки та питання ({summary.totalReviews})</h2>
      <div className={styles.reviewsLayout}>
        <div className={styles.reviewsSummary}>
            <div className={styles.summaryRating}>
                <span className={styles.summaryRatingValue}>{summary.averageRating.toFixed(1)}</span>
                <StarRating rating={summary.averageRating} />
            </div>
            <div className={styles.summaryTotal}>Кількість відгуків: {summary.totalReviews}</div>
            
            {summary.ratingBreakdown && (
                <div className={styles.ratingBreakdown}>
                    {Object.entries(summary.ratingBreakdown).reverse().map(([stars, count]) => (
                        <div key={stars} className={styles.breakdownRow}>
                            <span>{stars}</span>
                            <Image src="/icons/star-filled.png" alt="star" width={16} height={16} />
                            <div className={styles.ratingBar}><div style={{ width: `${(Number(count) / (summary.totalReviews || 1)) * 100}%` }}></div></div>
                            <span>{count}</span>
                        </div>
                    ))}
                </div>
            )}

            {isAuthenticated && (
                <button onClick={() => setShowForm(!showForm)} className={styles.writeReviewBtn}>
                    {showForm ? 'Закрити форму' : 'Написати відгук'}
                </button>
            )}
            {showForm && <ReviewForm productId={productId} onReviewAdded={refreshReviews} />}
        </div>

        <div className={styles.reviewsList}>
            {reviews.length > 0 ? reviews.map(review => (
                <div key={review.id} className={styles.reviewCard}>
                    <div className={styles.reviewHeader}>
                        <span className={styles.reviewAuthor}>{review.author}</span>
                        <span className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString('uk-UA')}</span>
                    </div>
                    <StarRating rating={review.rating} />
                    <h4 className={styles.reviewCardTitle}>{review.title}</h4>
                    <p className={styles.reviewText}>{review.text}</p>
                </div>
            )) : <p>Для цього товару ще немає відгуків. Будьте першим!</p>}
             {hasMore && reviews.length > 0 && (
                <button onClick={loadMoreReviews} disabled={isLoading} className={styles.showAllButton}>
                    {isLoading ? 'Завантаження...' : 'Показати ще'}
                </button>
            )}
        </div>
      </div>
    </div>
  );
}