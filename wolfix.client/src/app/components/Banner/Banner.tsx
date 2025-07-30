import { FC } from "react";

interface IBannerProps {}

const Banner: FC<IBannerProps> = () => {
  return (
    <div className="banner">
      <div className="banner-content">
        <span className="banner-discount">Знижки до -60%</span>
        <span className="banner-text">На велику побутову техніку</span>
      </div>
    </div>
  );
};

export default Banner;