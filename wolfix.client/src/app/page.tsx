"use client";

import { useState, useMemo } from 'react';
import Header from './components/Header/Header.client';
import Sidebar from './components/Sidebar/Sidebar.server';
import ProductList from './components/ProductList/ProductList.server';
import SearchResults from './components/ProductList/SearchResults.client';
import Footer from './components/Footer/Footer.server';
import Banner from './components/Banner/Banner.server';
import { allProducts } from './data/products';
import '../styles/page.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];

    const lowerCaseQuery = searchQuery.toLowerCase();
    
    return allProducts.filter(product => {
      const productName = product.name.toLowerCase();
      const productKeywords = product.keywords?.join(' ').toLowerCase() || '';

      return productName.includes(lowerCaseQuery) || productKeywords.includes(lowerCaseQuery);
    });
  }, [searchQuery]);

  return (
    <div className="page-container">
      <Header
        logoAlt="Wolfix Logo"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="main-content">
        <Sidebar className="sidebar" />
        <div className="divider" />
        <div className="content-area">
          <Banner />
          {searchQuery ? (
            <SearchResults products={filteredProducts} />
          ) : (
            <ProductList />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;