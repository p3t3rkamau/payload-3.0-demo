import React from 'react'
import Link from 'next/link'
import { Search, BarChart2, FolderOpen } from 'lucide-react'
import styles from './Home.module.scss'

const Page = () => {
  const cards = [
    {
      href: '/search-documents',
      title: 'Search Documents',
      description: 'Search through all your uploaded documents by various parameters.',
      icon: Search,
    },
    {
      href: '/visualize',
      title: 'Visualize Data',
      description: 'Visualize document data trends with charts and graphs.',
      icon: BarChart2,
    },
    {
      href: '/documents',
      title: 'Documents',
      description: 'View and organize documents in a folder-like structure.',
      icon: FolderOpen,
    },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Document Management System</h1>
        <div className={styles.cardGrid}>
          {cards.map((item, index) => (
            <Link href={item.href} key={index}>
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <item.icon size={24} />
                </div>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <p className={styles.cardDescription}>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Page
