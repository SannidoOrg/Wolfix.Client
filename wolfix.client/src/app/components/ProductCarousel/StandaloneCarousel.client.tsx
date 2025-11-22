"use client";

import { FC, useState } from "react";
import ProductCarousel from "./ProductCarousel.client";
import { ProductShortDto } from "@/types/product";

interface IProps {
    products: ProductShortDto[];
}

const StandaloneCarousel: FC<IProps> = ({ products }) => {
    const [index, setIndex] = useState(0);

    const handlePrev = () => setIndex((prev) => (prev > 0 ? prev - 1 : products.length - 4));
    const handleNext = () => setIndex((prev) => (prev < products.length - 4 ? prev + 1 : 0));

    if (products.length === 0) return null;

    return (
        <ProductCarousel
            products={products}
            currentIndex={index}
            onPrev={handlePrev}
            onNext={handleNext}
        />
    );
};

export default StandaloneCarousel;