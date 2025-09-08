import BannerClient from "./Banner.client";

const Banner = () => {
  const banners = [
    "/banners/Banner_1.png",
    "/banners/Banner_2.png",
    "/banners/Banner_3.png",
  ];

  return <BannerClient banners={banners} />;
};

export default Banner;