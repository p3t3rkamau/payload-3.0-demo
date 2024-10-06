import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const payload = await getPayloadHMR({
    config: configPromise,
  })

  // Extract search parameters from the query string
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || ''
  const currency = searchParams.get('currency') || ''
  const date = searchParams.get('date') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)

  // Construct query for Payload find
  const query = {
    where: {
      ...(title && { title: { contains: title } }),
      ...(currency && { currency: { equals: currency } }),
      ...(date && { date: { equals: date } }),
    },
    page,
    limit: 10, // Adjust this according to your pagination needs
  }

  // Fetch documents from the 'Documents' collection
  try {
    const data = await payload.find({
      // @ts-ignore
      collection: 'Documents',
      ...query,
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching documents' }, { status: 500 })
  }
}
