export interface AddProductReviewDto {
  title: string;
  text: string;
  rating: number;
  customerId: string;
}

export interface ReviewDto {
  id: string;
  author: string;
  title: string;
  text: string;
  rating: number;
  createdAt: string; 
}

export interface ReviewsResponseDto {
    totalReviews: number;
    averageRating: number;
    ratingBreakdown: { [key: string]: number };
    reviews: ReviewDto[];
}