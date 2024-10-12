// pages/api/visualize.ts
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import NodeCache from 'node-cache'

// Initialize cache
const cache = new NodeCache({ stdTTL: 600 }) // Cache TTL set to 600 seconds

export const GET = async (req: NextRequest) => {
  const payload = await getPayloadHMR({ config: configPromise })

  // Extract query parameters
  const { searchParams } = new URL(req.url)
  const year = searchParams.get('year') // You might want to fetch data for a specific year

  // Create a cache key
  const cacheKey = `visualize:${year || 'all'}`

  // Check if result exists in cache
  const cachedResult = cache.get(cacheKey)
  if (cachedResult) {
    console.log('Cache hit:', cachedResult)
    return NextResponse.json(cachedResult)
  }

  try {
    // Fetch documents from Payload CMS
    const data = await payload.find({
      collection: 'Documents',
      where: year ? { date: { contains: year } } : {}, // Filter by year if provided
      limit: 30,
      // Removed sorting
    })

    // Extract metrics for visualization
    const metrics = {
      totalAmount: 0,
      monthlyData: {} as { [key: string]: number },
      recipientData: {} as { [key: string]: number },
    }

    data.docs.forEach((doc: any) => {
      const date = new Date(doc.date)
      const month = date.toLocaleString('default', { month: 'long' })
      const recipient = doc.recipient || 'Unknown'

      // Update total amount
      metrics.totalAmount += doc.amount

      // Monthly data
      metrics.monthlyData[month] = (metrics.monthlyData[month] || 0) + doc.amount

      // Recipient data
      metrics.recipientData[recipient] = (metrics.recipientData[recipient] || 0) + doc.amount
    })

    // Store result in cache
    cache.set(cacheKey, metrics)

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Error fetching documents' }, { status: 500 })
  }
}
