'use client'
import React, { useState, useEffect } from 'react'
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react'
import styles from './index.module.scss' // Import your styles
import Spinner from '../Spinner'

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

interface CategoryItem {
  year: string
  month: string
  currency: string
  documents: Document[]
}

interface FetchData {
  docs: CategoryItem[]
}

interface ExpandedFolders {
  [key: string]: boolean
}

const FolderStructure: React.FC = () => {
  const [data, setData] = useState<FetchData | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<ExpandedFolders>({})

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '' // Default to empty string if the env is not set
    fetch(`${baseUrl}/categories`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  const renderFolder = (name: string, content: React.ReactNode, depth = 0) => {
    const folderId = `${depth}-${name}`
    const isExpanded = expandedFolders[folderId]

    return (
      <div key={folderId} style={{ marginLeft: `${depth * 20}px` }}>
        <div className={styles.folder} onClick={() => toggleFolder(folderId)}>
          {isExpanded ? (
            <ChevronDown size={16} className={styles.folderIcon} />
          ) : (
            <ChevronRight size={16} className={styles.folderIcon} />
          )}
          <Folder size={16} className={styles.folderIcon} />
          <span>{name}</span>
        </div>
        {isExpanded && content}
      </div>
    )
  }

  const renderDocument = (doc: Document, depth: number) => {
    const pdfUrl = `https://utfs.io/f/${doc.pdfUrlUpload._key}`

    return (
      <div className={styles.document} key={doc.id}>
        <File size={16} className={styles.folderIcon} />
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.documentLink}>
          {doc.title}
          {doc.refNo ? ` (${doc.refNo})` : ''}
        </a>
      </div>
    )
  }

  const renderStructure = () => {
    if (!data || !data.docs) return null

    const structure: { [year: string]: { [month: string]: { [currency: string]: Document[] } } } =
      {}

    // Organize data by year, month, and currency
    data.docs.forEach((item) => {
      const year = item.year
      const month = new Date(item.month).toLocaleString('default', { month: 'long' })
      const currency = item.currency || 'Unknown' // Fallback to 'Unknown' if currency is not present

      // Initialize nested structure
      if (!structure[year]) structure[year] = {}
      if (!structure[year][month]) structure[year][month] = {}
      if (!structure[year][month][currency]) structure[year][month][currency] = []

      structure[year][month][currency].push(...item.documents)
    })

    // Render the folder structure
    return Object.entries(structure).map(([year, months]) =>
      renderFolder(
        year,
        Object.entries(months).map(([month, currencies]) =>
          renderFolder(
            month,
            Object.entries(currencies).map(([currency, docs]) =>
              renderFolder(
                currency,
                docs.map((doc) => renderDocument(doc, 3)),
                3, // Depth 3 for documents
              ),
            ),
            2, // Depth 2 for currencies
          ),
        ),
        1, // Depth 1 for months
      ),
    )
  }

  return (
    <div className={styles.folderStructure}>
      <h2>Document Structure</h2>
      {data ? renderStructure() : <Spinner />}
    </div>
  )
}

export default FolderStructure
