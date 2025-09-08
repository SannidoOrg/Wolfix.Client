"use client";

import { useState, useEffect, useRef } from 'react';
import '../../../styles/Search.css';

interface SearchProps {
  query?: string;
  onQueryChange?: (query: string) => void;
}

const searchHistory = [ "Смартфон Apple iPhone 15 256Gb Pink" ];
const popularSearches = [ "айфон 16", "телевізор", "ноутбуки" ];

const Search = ({ query: externalQuery, onQueryChange }: SearchProps) => {
  const [internalQuery, setInternalQuery] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const query = externalQuery !== undefined ? externalQuery : internalQuery;
  const setQuery = onQueryChange || setInternalQuery;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    console.log('Поиск по запросу:', query);
    setDropdownVisible(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  const onInputFocus = () => setDropdownVisible(true);

  return (
    <div className="search-container" ref={searchContainerRef}>
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Я шукаю..."
          className="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={onInputFocus}
          onKeyDown={handleKeyDown}
        />
        <button className="search-button" onClick={handleSearch}>
          <img src="/icons/Search.png" alt="Search Icon" />
        </button>
      </div>

      {isDropdownVisible && (
        <div className="search-dropdown">
            <div className="dropdown-section">
              <div className="section-header">
                <h3>Перелік запитів</h3>
                <button className="clear-button">Очистити</button>
              </div>
              {searchHistory.map((item, index) => (
                <div key={index} className="history-item">
                  <span>{item}</span>
                  <button className="remove-item-button">
                    <img src="/icons/close-icon.png" alt="Видалити" />
                  </button>
                </div>
              ))}
            </div>
            <div className="dropdown-section">
              <h3>Хіт-пошук</h3>
              <div className="popular-tags">
                {popularSearches.map((tag, index) => (
                  <a href="#" key={index} className="popular-tag">{tag}</a>
                ))}
              </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Search;