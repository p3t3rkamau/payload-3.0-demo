import { getPayloadHMR } from '@payloadcms/next/utilities';
import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const payload = await getPayloadHMR({
    config: configPromise,
  });

  // Extract search parameters from the query string
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || '';
  const currency = searchParams.get('currency') || '';
  const date = searchParams.get('date') || '';
  const refNo = searchParams.get('refNo') || '';
  const recipient = searchParams.get('recipient') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Construct query for Payload find
  const query = {
    where: {
      ...(title && { title: { contains: title } }), // Partial matching for title
      ...(currency && { currency: { equals: currency } }), // Exact matching for currency
      ...(date && { date: { equals: date } }), // Exact matching for date
      ...(refNo && { refNo: { equals: refNo } }), // Exact matching for refNo
      ...(recipient && { recipient: { contains: recipient } }), // Partial matching for recipient
    },
    page,
    limit: 10, // Adjust this according to your pagination needs
  };

  try {
    // Fetch documents from the 'Documents' collection
    const data = await payload.find({
      collection: 'Documents',
      ...query,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Error fetching documents' }, { status: 500 });
  }
};
