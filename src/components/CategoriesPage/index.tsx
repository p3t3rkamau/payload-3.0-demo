// app/components/CategoriesPage.tsx
import React from 'react'
import Link from 'next/link'
import styles from './index.module.scss'
async function fetchCategories() {
  const res = await fetch(`http://localhost:3000/api/categories?limit=100`)
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
