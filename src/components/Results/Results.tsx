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
          <p>Amount: {doc.amount}</p>
          <p>Currency: {doc.currency}</p>
          <p>Date: {new Date(doc.date).toLocaleDateString()}</p>
          <a href={doc.pdfUrlUpload.url} target="_blank" rel="noreferrer">
            View PDF
          </a>
        </div>
      ))}
    </div>
  )
}

export default Results
