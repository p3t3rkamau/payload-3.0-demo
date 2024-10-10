import Image from 'next/image'
import styles from './Results.module.scss'
import pdfIcon from '../../../public/PDF_file_icon.svg.png' // Import your PDF icon image

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
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
    )
  }
  if (error) {
    return <p className={styles.error}>{error}</p>
  }

  if (documents?.length === 0) {
    return <p className={styles.noResults}>No results found.</p>
  }

  return (
    <div className={styles.results}>
      {documents?.map((doc) => (
        <div className={styles.document} key={doc.id}>
          <div className={styles.documentContent}>
            <h3 className={styles.title}>{doc.title}</h3>
            <div className={styles.details}>
              <p className={styles.amount}>
                Amount: {doc.amount.toLocaleString()} {doc.currency}
              </p>
              <p className={styles.date}>Date: {new Date(doc.date).toLocaleDateString()}</p>
              {doc.recipient && <p className={styles.recipient}>Recipient: {doc.recipient}</p>}
              {doc.refNo && <p className={styles.refNo}>Reference No: {doc.refNo}</p>}
              {doc.numberOfPages !== undefined && (
                <p className={styles.pages}>Number of Pages: {doc.numberOfPages}</p>
              )}
            </div>
            <a
              href={doc.pdfUrlUpload.url}
              target="_blank"
              rel="noreferrer"
              className={styles.viewPdf}
            >
              <Image
                src={pdfIcon}
                alt="PDF Document"
                width={100}
                height={150}
                className={styles.pdfIcon}
              />
              View PDF
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Results
