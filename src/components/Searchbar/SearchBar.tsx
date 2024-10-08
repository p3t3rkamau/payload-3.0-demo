import { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  onSearch: (filterType: string, value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [filterType, setFilterType] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null); // Reference for dropdown

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onSearch(filterType, searchValue);
  };

  const handleClickOutside = (event: MouseEvent) => {
    // Check if the clicked element is outside the dropdown
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false); // Close the dropdown if clicked outside
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside of the dropdown
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderInputField = () => {
    switch (filterType) {
      case 'date':
        return (
          <input
            type="date"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.input}
          />
        );
      case 'currency':
        return (
          <select
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.input}
          >
            <option value="">Select Currency</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="TZS">TZS</option>
            <option value="KES">KES</option>
          </select>
        );
      case 'refNumber':
        return (
          <input
            type="number"
            placeholder="Enter Reference Number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.input}
          />
        );
      default:
        return (
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={styles.input}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.searchBarContainer}>
        {renderInputField()}

        {/* Dropdown for selecting filter type */}
        <div className={styles.dropdown} ref={dropdownRef}>
          <button
            type="button"
            className={styles.dropdownButton}
            onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown on click
          >
            {filterType === 'all'
              ? 'All'
              : filterType === 'date'
              ? 'Date'
              : filterType === 'currency'
              ? 'Currency'
              : filterType === 'refNumber'
              ? 'Ref Number'
              : 'Filter'}
          </button>
          {dropdownOpen && (
            <ul className={styles.dropdownMenu}>
              <li onClick={() => { setFilterType('all'); setDropdownOpen(false); }}>All</li>
              <li onClick={() => { setFilterType('date'); setDropdownOpen(false); }}>Date</li>
              <li onClick={() => { setFilterType('currency'); setDropdownOpen(false); }}>Currency</li>
              <li onClick={() => { setFilterType('refNumber'); setDropdownOpen(false); }}>Reference Number</li>
            </ul>
          )}
        </div>
      </div>

      <button type="submit" className={styles.submitButton}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
