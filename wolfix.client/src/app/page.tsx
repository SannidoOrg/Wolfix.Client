"use client";

import { useState, useEffect } from 'react';
import Header from './components/Header/Header.client';
// ИЗМЕНЕНИЕ ЗДЕСЬ: Импортируем клиентскую версию
import Sidebar from './components/Sidebar/Sidebar.client';
import ProductList from './components/ProductList/ProductList.client'; // Убедитесь, что здесь .client
import SearchResults from './components/ProductList/SearchResults.client';
import Footer from './components/Footer/Footer.server';
import Banner from './components/Banner/Banner.server';
import { useProducts } from '@/contexts/ProductContext';
import '../styles/page.css';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { searchResults, searchProducts, clearSearch } = useProducts();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                searchProducts(searchQuery);
            } else {
                clearSearch();
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
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
                        <SearchResults products={searchResults} />
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