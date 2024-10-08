'use client'; // Ensure this is at the top for React client-side rendering
import { useState, useEffect } from 'react';
import SearchBar from '../Searchbar/SearchBar';
import Results from '../Results/Results';
import Pagination from '../Pagination/index';
import { FaSearch } from 'react-icons/fa';
import styles from './SearchDocuments.module.scss';
import Image from 'next/image';

const SearchDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [filters, setFilters] = useState({
    title: '',
    currency: '',
    date: '',
    refNo: '',
    recipient: '',
  });

  // Handle search logic with optional parameters
  const handleSearch = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      // Construct search params dynamically
      const params = new URLSearchParams();
      if (filters.title) params.append('title', filters.title);
      if (filters.currency) params.append('currency', filters.currency);
      if (filters.date) params.append('date', filters.date);
      if (filters.refNo) params.append('refNo', filters.refNo);
      if (filters.recipient) params.append('recipient', filters.recipient);
      params.append('page', String(page));

      const res = await fetch(`/documents?${params}`);
      const data = await res.json();

      setDocuments(data.docs);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.page || 1);
    } catch (err) {
      setError('An error occurred while fetching the documents.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Search whenever current page or filters change
    handleSearch(currentPage);
  }, [currentPage, filters]); // Add filters as a dependency

  // Update filters based on user input
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    // Reset page to 1 when filters are changed
    setCurrentPage(1);
  };

  return (
    <div className={styles.Navcontainer}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <Image
          src="https://www.wcs.org/assets/wcsorg/logos/green-blue-bright-5d771b2f607411694529229adaab63679ef4acc34bf6db6d840b5f38908ac4fa.svg"
          alt="Logo"
          className={styles.logo}
          width={100}
          height={100}
        />
        <FaSearch
          className={styles.searchIcon}
          onClick={() => setIsSearchVisible((prev) => !prev)}
        />
      </nav>

      {!isSearchVisible && (
        <div className={styles.defaultView}>
          <h1 className={styles.heading}>WCS Doc Search</h1>
          <Image
            src="https://www.wcs.org/assets/wcsorg/logos/green-blue-bright-5d771b2f607411694529229adaab63679ef4acc34bf6db6d840b5f38908ac4fa.svg"
            alt="Faded Logo"
            className={styles.fadedLogo}
            width={600}
            height={600}
          />
        </div>
      )}

      {isSearchVisible && (
        <div className={styles.container}>
          <SearchBar
            onFocus={() => setIsSearchVisible(true)} // Show filter options on focus
            filters={filters} // Pass current filter state
            onFilterChange={handleFilterChange} // Update filter state
            onSearch={() => handleSearch(1)} // Start search on first page
          />
          <Results
            documents={documents}
            isLoading={isLoading}
            error={error}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage} // Change page
          />
        </div>
      )}
    </div>
  );
};

export default SearchDocuments;
