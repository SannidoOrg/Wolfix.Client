import { FC, useState } from "react";

interface ILoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading: boolean;
}

const LoadMoreButton: FC<ILoadMoreButtonProps> = ({ onLoadMore, isLoading }) => {
  return (
    <div className="button_more">
      <button onClick={onLoadMore} disabled={isLoading}>
        Показати ще
        <img src="/icons/arrow.png" alt="Arrow" />
      </button>
    </div>
  );
};

export default LoadMoreButton;