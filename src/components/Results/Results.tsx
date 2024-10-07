import styles from './Results.module.scss'

interface Document {
  id: string
  title: string
  amount: number
  currency: string
  date: string
  pdfUrlUpload: {
    url: string
  }
  recipient?: string // Optional field
  numberOfPages?: number // Optional field
  refNo?: string // Optional field
}

interface ResultsProps {
  documents: Document[]
  isLoading: boolean
  error: string | null
}

const Results: React.FC<ResultsProps> = ({ documents, isLoading, error }) => {
  if (isLoading) {
    return <p className={styles.loading}>Loading...</p>
  }

  if (error) {
    return <p className={styles.error}>{error}</p>
  }

  if (documents.length === 0) {
    return <p className={styles.noResults}>No results found.</p>
  }

  return (
    <div className={styles.results}>
      {documents.map((doc) => (
        <div className={styles.document} key={doc.id}>
          <h3>{doc.title}</h3>
          <p>Amount: {doc.amount.toLocaleString()}</p> {/* Format with commas */}
          <p>Currency: {doc.currency}</p>
          <p>Date: {new Date(doc.date).toLocaleDateString()}</p>
          {doc.recipient && <p>Recipient: {doc.recipient}</p>} {/* Optional recipient */}
          {doc.refNo && <p>Reference No: {doc.refNo}</p>} {/* Optional refNo */}
          {doc.numberOfPages !== undefined && <p>Number of Pages: {doc.numberOfPages}</p>} {/* Optional numberOfPages */}
          <a href={doc.pdfUrlUpload.url} target="_blank" rel="noreferrer">
            View PDF
          </a>
        </div>
      ))}
    </div>
  )
}

export default Results
