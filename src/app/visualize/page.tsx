'use client'

import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Define types for documents
interface Document {
  date: string
  amount: number // Assuming amount is a number in Payload CMS
}

export default function VisualizePage() {
  const [chartData, setChartData] = useState<any>(null) // Setting as `any` initially for dynamic data
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/documents') // Replace with your actual API endpoint
        const data = await res.json()

        // Ensure data is an array of documents
        const documents: Document[] = data.docs

        const labels: string[] = []
        const amounts: number[] = []

        // Extract labels (months) and amounts
        documents?.forEach((doc: Document) => {
          const date = new Date(doc.date)
          const month = date.toLocaleString('default', { month: 'long' }) // Get month name
          labels.push(month)
          amounts.push(doc.amount) // Push the document amount
        })

        setChartData({
          labels, // Labels for the x-axis (Months)
          datasets: [
            {
              label: 'Amount in USD',
              data: amounts, // Data for the y-axis
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
          ],
        })

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Monthly Money Trend' },
    },
  }

  if (loading || !chartData) {
    return <div>Loading chart...</div>
  }

  return (
    <div>
      <h1>Money Trend Visualization</h1>
      {/* @ts-ignore */}
      <Bar data={chartData} options={options} />
    </div>
  )
}
