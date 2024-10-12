// src/app/visualize/Charts_Component/index.tsx
import React, { useEffect, useState } from 'react'
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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Define the props interface
interface VisualizationProps {
  data: {
    totalAmount: number
    monthlyData: { [key: string]: number }
    recipientData: { [key: string]: number }
  }
}

const Visualization: React.FC<VisualizationProps> = ({ data }) => {
  const monthlyLabels = Object.keys(data.monthlyData || {})
  const monthlyAmounts = Object.values(data.monthlyData || {})

  const recipientLabels = Object.keys(data.recipientData || {})
  const recipientAmounts = Object.values(data.recipientData || {})

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
