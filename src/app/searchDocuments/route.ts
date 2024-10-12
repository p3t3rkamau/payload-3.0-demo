import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import NodeCache from 'node-cache' // For NodeCache

// Initialize cache
const cache = new NodeCache({ stdTTL: 600 }) // Cache TTL set to 600 seconds

export const GET = async (req: NextRequest) => {
  const payload = await getPayloadHMR({
    config: configPromise,
  })

  // Extract search parameters from the query string
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || ''
  const currency = searchParams.get('currency') || ''
  const date = searchParams.get('date') || '' // Keep date as a string for flexibility
  const refNo = searchParams.get('refNo') || ''
  const recipient = searchParams.get('recipient') || ''
  const amount = searchParams.get('amount') || '' // Add amount parameter
  const page = parseInt(searchParams.get('page') || '1', 10)

  // Create a cache key
  const cacheKey = `search:${title}:${currency}:${date}:${refNo}:${recipient}:${amount}:${page}`

  // Check if result exists in cache
  const cachedResult = cache.get(cacheKey)
  if (cachedResult) {
    console.log('Cache hit:', cachedResult)
    return NextResponse.json(cachedResult)
  }

  // Build the query object, allowing for flexible input matching
  const query = {
    where: {
      ...(title ? { title: { contains: title, caseSensitive: false } } : {}),
      ...(currency ? { currency: { contains: currency, caseSensitive: false } } : {}),
      ...(date ? { date: { equals: date } } : {}), // Strict date search
      ...(refNo ? { refNo: { equals: refNo } } : {}),
      ...(recipient ? { recipient: { contains: recipient, caseSensitive: false } } : {}),
      ...(amount ? { amount: { equals: amount } } : {}), // Add amount to query
    },
    page,
    limit: 6,
  }

  // Log the query to check what's being passed to Payload CMS
  console.log('Payload query:', JSON.stringify(query, null, 2))

  try {
    const data = await payload.find({
      collection: 'Documents',
      ...query,
    })

    // Store result in cache
    // cache.set(cacheKey, data)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Error fetching documents' }, { status: 500 })
  }
}
