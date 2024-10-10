import { useState } from 'react'
import { FaSearch } from 'react-icons/fa' // Import icon for the search button
import styles from './SearchBar.module.scss'

interface SearchBarProps {
  onSearch: (params: {
    title?: string
    currency?: string
    date?: string
    refNo?: string
    recipient?: string
    amount?: string // Include amount for search
  }) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('title') // Default to 'title'
  const [title, setTitle] = useState('')
  const [currency, setCurrency] = useState('')
  const [date, setDate] = useState('')
  const [refNo, setRefNo] = useState('')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('') // State for amount

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params: any = {} // Use any for flexible parameter typing

    // Include additional parameters based on search type
    if (searchType === 'title') {
      params.title = title
    } else if (searchType === 'currency') {
      params.currency = currency
    } else if (searchType === 'date') {
      params.date = date
    } else if (searchType === 'refNo') {
      params.refNo = refNo
    } else if (searchType === 'recipient') {
      params.recipient = recipient
    } else if (searchType === 'amount') {
      params.amount = amount
    }

    onSearch(params) // Pass search values to the parent
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.searchBarContainer}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className={styles.select}
        >
          <option value="title">Search by Title</option>
          <option value="currency">Search by Currency</option>
          <option value="date">Search by Date</option>
          <option value="refNo">Search by Reference Number</option>
          <option value="recipient">Search by Recipient</option>
          <option value="amount">Search by Amount</option>
        </select>

        <input
          type={searchType === 'date' ? 'date' : 'text'} // Date input for date search
          placeholder={`Enter ${searchType === 'date' ? 'Date' : searchType === 'amount' ? 'Amount' : searchType.charAt(0).toUpperCase() + searchType.slice(1)}...`}
          value={
            searchType === 'title'
              ? title
              : searchType === 'currency'
                ? currency
                : searchType === 'date'
                  ? date
                  : searchType === 'refNo'
                    ? refNo
                    : searchType === 'recipient'
                      ? recipient
                      : searchType === 'amount'
                        ? amount
                        : ''
          }
          onChange={(e) => {
            if (searchType === 'title') setTitle(e.target.value)
            else if (searchType === 'currency') setCurrency(e.target.value)
            else if (searchType === 'date') setDate(e.target.value)
            else if (searchType === 'refNo') setRefNo(e.target.value)
            else if (searchType === 'recipient') setRecipient(e.target.value)
            else if (searchType === 'amount') setAmount(e.target.value) // Handle amount input
          }}
          className={styles.input}
        />

        <button type="submit" className={styles.submitButton}>
          <FaSearch />
        </button>
      </div>
    </form>
  )
}

export default SearchBar
