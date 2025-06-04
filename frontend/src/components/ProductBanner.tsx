// src/components/ProductBanner.tsx
import React from 'react';
import './ProductBanner.css';

interface ProductBannerProps {
  desktopImage: string;
  mobileImage: string;
  altText: string;
}

const ProductBanner: React.FC<ProductBannerProps> = ({ desktopImage, mobileImage, altText }) => {
  return (
    <div className="product-banner">
      <img src={desktopImage} alt={altText + " - Desktop"} className="banner-desktop" />
      <img src={mobileImage} alt={altText + " - Mobile"} className="banner-mobile" />
    </div>
  );
};

export default ProductBanner;