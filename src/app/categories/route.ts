import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import NodeCache from 'node-cache'
import { NextRequest, NextResponse } from 'next/server'

// Initialize cache
const cache = new NodeCache({ stdTTL: 600 }) // Cache TTL of 600 seconds

export const GET = async (req: NextRequest) => {
  const payload = await getPayloadHMR({
    config: configPromise,
  })

  // Use cache to improve performance
  const cacheKey = 'categoriesData'
  const cachedData = cache.get(cacheKey)

  if (cachedData) {
    console.log('Cache hit:', cachedData)
    return NextResponse.json(cachedData)
  }

  try {
    const data = await payload.find({
      collection: 'categories', // Adjust the collection name as per your schema
      where: {}, // Add any necessary filters here
    })

    // Cache the data to avoid hitting the database on every request
    cache.set(cacheKey, data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Error fetching categories' })
  }
}
