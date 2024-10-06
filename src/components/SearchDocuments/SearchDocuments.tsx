'use client'
import { useState, useEffect } from 'react'
import SearchBar from '../Searchbar/SearchBar'
import Results from '../Results/Results'
import Pagination from '../Pagination/index'
import { FaSearch } from 'react-icons/fa' // Import search icon from react-icons
import styles from './SearchDocuments.module.scss'
import Image from 'next/image'

const SearchDocuments = () => {
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isSearchVisible, setIsSearchVisible] = useState(false) // Track visibility of the search container

  const handleSearch = async (title: string, currency: string, date: string, page: number = 1) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        title: title || '',
        currency: currency || '',
        date: date || '',
        page: String(page),
      })

      const res = await fetch(`/api/Documents?${params}`)
      const data = await res.json()
      setDocuments(data.docs)
      setTotalPages(data.totalPages || 1)
      setCurrentPage(data.page || 1)
    } catch (err) {
      setError('An error occurred while fetching the documents.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Default search on load
    handleSearch('kenya', 'TZS', '01/19/2024', currentPage)
  }, [currentPage])

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
        {/* Search Icon */}
        <FaSearch
          className={styles.searchIcon}
          onClick={() => setIsSearchVisible((prev) => !prev)} // Toggle visibility on click
        />
      </nav>

      {/* Default View with Faded Logo and Heading */}
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

      {/* Search Container */}
      {isSearchVisible && (
        <div className={styles.container}>
          <SearchBar onSearch={(title, currency, date) => handleSearch(title, currency, date)} />
          <Results documents={documents} isLoading={isLoading} error={error} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}

export default SearchDocuments
