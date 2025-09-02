import BrandCardClient, { IBrandCardProps } from "./BrandCard.client";

const BrandCard = (props: IBrandCardProps) => {
  return <BrandCardClient {...props} />;
};

export default BrandCard;