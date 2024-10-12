import { useState } from 'react'
import { FaSearch } from 'react-icons/fa' // Import icon for the search button
import styles from './SearchBar.module.scss'

interface SearchBarProps {
  onSearch: (params: {
    title?: string
    currency?: 'USD' | 'EUR' | 'TZS' | 'KES' | '' // Include empty string as a valid type
    date?: string
    refNo?: string
    recipient?: string
    amount?: string // Include amount for search
  }) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('title') // Default to 'title'
  const [title, setTitle] = useState('')
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'TZS' | 'KES' | ''>('') // Allow empty string
  const [date, setDate] = useState('')
  const [refNo, setRefNo] = useState('')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('') // State for amount

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params: any = {} // Use any for flexible parameter typing

    // Include additional parameters based on search type
    switch (searchType) {
      case 'title':
        params.title = title
        break
      case 'currency':
        params.currency = currency // currency is now used from select
        break
      case 'date':
        params.date = date
        break
      case 'refNo':
        params.refNo = refNo
        break
      case 'recipient':
        params.recipient = recipient
        break
      case 'amount':
        params.amount = amount
        break
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

        {searchType === 'currency' ? (
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'USD' | 'EUR' | 'TZS' | 'KES' | '')} // Cast to expected currency type
            className={styles.input} // Use input styles for the select element
          >
            <option value="">Select Currency</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="TZS">TZS</option>
            <option value="KES">KES</option>
          </select>
        ) : (
          <input
            type={searchType === 'date' ? 'date' : 'text'} // Date input for date search
            placeholder={`Enter ${searchType === 'date' ? 'Date' : searchType.charAt(0).toUpperCase() + searchType.slice(1)}...`}
            value={
              searchType === 'title'
                ? title
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
              switch (searchType) {
                case 'title':
                  setTitle(e.target.value)
                  break
                case 'date':
                  setDate(e.target.value)
                  break
                case 'refNo':
                  setRefNo(e.target.value)
                  break
                case 'recipient':
                  setRecipient(e.target.value)
                  break
                case 'amount':
                  setAmount(e.target.value)
                  break // Handle amount input
              }
            }}
            className={styles.input}
          />
        )}

        <button type="submit" className={styles.submitButton}>
          <FaSearch />
        </button>
      </div>
    </form>
  )
}

export default SearchBar
