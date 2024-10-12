import React from 'react'
import Link from 'next/link'
import styles from './index.module.scss'

// Use the base URL from the environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

async function fetchCategories() {
  const res = await fetch(`${API_URL}/api/categories`) // Use the full URL
  if (!res.ok) {
    console.error('Failed to fetch categories') // Handle error, e.g., throw new Error('Failed to fetch categories');
  }
  const data = await res.json()
  return data.docs
}

const CategoriesPage = async () => {
  const categories = await fetchCategories()
  const uniqueYears = Array.from(
    new Set(categories?.map((cat: any) => new Date(cat.year).getFullYear())),
  ) as number[]

  return (
    <div>
      <h2>Select a Year</h2>
      <ul>
        {uniqueYears?.map((year) => (
          <li key={year}>
            <Link href={`/categories/${year}`}>{year}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CategoriesPage
