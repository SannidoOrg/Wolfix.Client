"use client";

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

interface StarRatingInputProps {
  rating: number;
  setRating: (rating: number) => void;
}

export default function StarRatingInput({ rating, setRating }: StarRatingInputProps) {
  const [hover, setHover] = useState(0);
  const totalStars = 5;

  return (
    <div className={styles.starRatingInput}>
      {[...Array(totalStars)].map((star, index) => {
        const ratingValue = index + 1;
        return (
          <label key={ratingValue}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              style={{ display: 'none' }}
            />
            <Image
              src={ratingValue <= (hover || rating) ? "/icons/star-filled.png" : "/icons/star-empty.png"}
              alt="star"
              width={24}
              height={24}
              className={styles.star}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
            />
          </label>
        );
      })}
    </div>
  );
}