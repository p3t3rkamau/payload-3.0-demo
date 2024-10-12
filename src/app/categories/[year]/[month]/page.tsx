// app/categories/[year]/[month]/page.tsx

async function fetchDocuments(year: number, month: number) {
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
  const endDate = `${year}-${(month + 1).toString().padStart(2, '0')}-01`

  const res = await fetch(
    `${process.env.PAYLOAD_API_URL}/categories?where[year][gte]=${startDate}&where[year][lt]=${endDate}`,
  )
  const data = await res.json()
  return data.docs
}

export default async function MonthPage({ params }: { params: { year: string; month: string } }) {
  const year = parseInt(params.year)
  const month = parseInt(params.month)
  const documents = await fetchDocuments(year, month)

  return (
    <div>
      <h1>Documents for {`Month ${month}, ${year}`}</h1>
      <ul>
        {documents.map((doc: any) => (
          <li key={doc.id}>
            <a href={doc.pdfUrlUpload.url} target="_blank" rel="noopener noreferrer">
              {doc.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
