"use client";

import { useState } from 'react';
import { useProducts } from '../../../contexts/ProductContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useGlobalContext } from '../../../contexts/GlobalContext';
import StarRatingInput from './StarRatingInput.client';
import styles from './page.module.css';
import { AddProductReviewDto } from '../../../types/review';

interface ReviewFormProps {
  productId: string;
  onReviewAdded: () => void;
}

export default function ReviewForm({ productId, onReviewAdded }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const { addProductReview } = useProducts();
  const { user } = useAuth();
  const { showNotification } = useGlobalContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.profileId) {
      showNotification("Будь ласка, увійдіть до акаунту, щоб залишити відгук.", "error");
      return;
    }
    if (rating === 0) {
      showNotification("Будь ласка, поставте оцінку.", "error");
      return;
    }

    const reviewData: AddProductReviewDto = {
      title,
      text,
      rating,
      customerId: user.profileId,
    };

    const response = await addProductReview(productId, reviewData);
    if (response && [200, 201, 204].includes(response.status)) {
      showNotification("Ваш відгук успішно додано!", "success");
      setTitle('');
      setText('');
      setRating(0);
      onReviewAdded();
    } else {
      showNotification("Не вдалося додати відгук.", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.reviewForm}>
      <h3>Ваш відгук</h3>
      <div className={styles.formGroup}>
        <label>Оцінка</label>
        <StarRatingInput rating={rating} setRating={setRating} />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="reviewTitle">Заголовок (необов'язково)</label>
        <input
          id="reviewTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.formInput}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="reviewText">Текст відгуку</label>
        <textarea
          id="reviewText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.formTextarea}
          required
        />
      </div>
      <button type="submit" className={styles.submitReviewBtn}>Надіслати відгук</button>
    </form>
  );
}