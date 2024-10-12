import Image from 'next/image'
import path from 'path'
import styles from './Results.module.scss'
import pdfIcon from '../../../public/PDF_file_icon.svg.png' // Import your PDF icon image
import noResultsImage from '../../../public/noresults.png'
interface Document {
  id: string
  title: string
  amount: number
  currency: string
  date: string
  pdfUrlUpload: {
    _key: string // UploadThing _key for constructing the URL
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
    return (
      <div className={styles.noResultsContainer}>
        <Image
          src={noResultsImage}
          alt="No results found"
          layout="fill" // Make the image fill the parent container
          objectFit="contain" // Keep aspect ratio
          className={styles.noResultsImage}
        />
        <p className={styles.noResultsText}>No results found.</p>
      </div>
    )
  }
  return (
    <div className={styles.results}>
      {documents?.map((doc) => {
        // Construct the URL using the _key from UploadThing
        const pdfUrl = `https://utfs.io/f/${path.posix.join(doc.pdfUrlUpload._key || '')}`

        return (
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
              <a href={pdfUrl} target="_blank" rel="noreferrer" className={styles.viewPdf}>
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
        )
      })}
    </div>
  )
}

export default Results
