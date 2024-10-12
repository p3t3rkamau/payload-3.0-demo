'use client'
import React, { useEffect, useState } from 'react'
import Visualization from './Charts_Component/index'

const VisualizationPage: React.FC = () => {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/visualApi')
      const result = await response.json()
      setData(result)
    }

    fetchData()
  }, [])

  if (!data) return <div>Loading...</div>

  return <Visualization data={data} />
}

export default VisualizationPage
