import Results from '@/components/Results/Results'
import { useEffect, useState } from 'react'

interface Document {
  id: string
  title: string
  amount: number
  currency: string
  date: string
  pdfUrlUpload: {
    _key: string
  }
  recipient?: string
  numberOfPages?: number
  refNo?: string
}

async function fetchDocuments(year: string): Promise<Document[]> {
  const res = await fetch(`http://localhost:3000/api/documents?year=${year}`)
  if (!res.ok) {
    throw new Error('Failed to fetch documents')
  }
  const data = await res.json()
  return data.docs // Adjust this based on your API response structure
}

export default function CategoryYearPage({ params }: { params: { year: string } }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const fetchedDocuments = await fetchDocuments(params.year)
        setDocuments(fetchedDocuments)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadDocuments()
  }, [params.year])

  return <Results documents={documents} isLoading={isLoading} error={error} />
}
