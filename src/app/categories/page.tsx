import Link from 'next/link'

async function fetchCategories() {
  const res = await fetch('/api/categories')
  const data = await res.json()
  return data.docs // Adjust based on your actual API response
}

export default async function CategoriesPage() {
  const categories = await fetchCategories()

  // Extract unique years from the categories
  const uniqueYears = Array.from(
    new Set(categories?.map((cat: any) => new Date(cat.date).getFullYear())),
  ) as number[] // Adjusted to use the date field correctly

  return (
    <div>
      <h1>Select a Year</h1>
      <ul>
        {uniqueYears?.map((year: number) => (
          <li key={year}>
            <Link href={`/categories/${year}`}>{year}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
