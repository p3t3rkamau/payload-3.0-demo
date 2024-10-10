'use client'
import { useState, useEffect } from 'react'
import SearchBar from '../Searchbar/SearchBar'
import Results from '../Results/Results'
import Pagination from '../Pagination/index'
import { FaSearch } from 'react-icons/fa'
import styles from './SearchDocuments.module.scss'
import Image from 'next/image'

const SearchDocuments = () => {
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  // Handle search logic with all parameters, including amount
  const handleSearch = async (searchParams: {
    title?: string // Made optional
    currency?: string // Made optional
    date?: string // Made optional
    refNo?: string // Made optional
    recipient?: string // Made optional
    amount?: string // Added amount parameter
  }) => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (searchParams.title) params.append('title', searchParams.title)
      if (searchParams.currency) params.append('currency', searchParams.currency)
      if (searchParams.date) params.append('date', searchParams.date)
      if (searchParams.refNo) params.append('refNo', searchParams.refNo)
      if (searchParams.recipient) params.append('recipient', searchParams.recipient)
      if (searchParams.amount) params.append('amount', searchParams.amount)
      params.append('page', String(currentPage))

      console.log('Search params:', params.toString())

      const res = await fetch(`/searchDocuments?${params}`)
      if (!res.ok) throw new Error('Failed to fetch documents')
      const data = await res.json()

      setDocuments(data.docs)
      setTotalPages(data.totalPages || 1)
      setCurrentPage(data.page || 1)
    } catch (err) {
      console.error(err)
      setError('An error occurred while fetching the documents.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Only call handleSearch when currentPage changes
    handleSearch({}) // Adjust based on initial requirements if needed
    // @ts-ignore
  }, [currentPage])

  return (
    <div className={styles.Navcontainer}>
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

      {isSearchVisible && (
        <div className={styles.container}>
          <SearchBar onSearch={handleSearch} /> {/* Pass the updated handleSearch */}
          <Results documents={documents} isLoading={isLoading} error={error} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage} // Change page
          />
        </div>
      )}
    </div>
  )
}

export default SearchDocuments
