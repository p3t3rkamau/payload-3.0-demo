import { useEffect, useState } from 'react'
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

const Visualization = () => {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null) // To handle errors

  useEffect(() => {
    // Fetch data from the server
    const fetchData = async () => {
      try {
        const response = await fetch('/visualApi') // Adjust year or parameters as needed
        if (!response.ok) {
          console.error('Failed to fetch data')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error(err)
        setError('Error fetching data. Please try again later.')
      }
    }

    fetchData()
  }, [])

  if (error) return <div>{error}</div> // Display error message if any
  if (!data) return <div>Loading...</div> // Loading state while fetching data

  // Prepare data for charts
  const monthlyLabels = data.monthlyData ? Object.keys(data.monthlyData) : []
  const monthlyAmounts = data.monthlyData ? Object.values(data.monthlyData) : []

  const recipientLabels = data.recipientData ? Object.keys(data.recipientData) : []
  const recipientAmounts = data.recipientData ? Object.values(data.recipientData) : []

  const chartColors = recipientLabels.map(
    (_, index) => `hsl(${(index * 360) / recipientLabels.length}, 100%, 50%)`,
  ) // Dynamic colors

  const monthlyChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Monthly Amount',
        data: monthlyAmounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  const recipientChartData = {
    labels: recipientLabels,
    datasets: [
      {
        label: 'Recipient Amount',
        data: recipientAmounts,
        backgroundColor: chartColors,
      },
    ],
  }

  return (
    <div>
      <h2>Total Amount: Ksh {data.totalAmount?.toFixed(2)}</h2>
      <div>
        <h3>Monthly Metrics</h3>
        <Bar data={monthlyChartData} />
      </div>
      <div>
        <h3>Recipient Metrics</h3>
        <Bar data={recipientChartData} />
      </div>
    </div>
  )
}

export default Visualization
