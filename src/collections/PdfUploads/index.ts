// payload.config.ts
import type { CollectionConfig } from 'payload';
import AmountFieldServer from '../../components/AmountField/serverField'; // Adjust the import path

export const PdfUploads: CollectionConfig = {
  slug: 'Documents',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'currency',
      type: 'select',
      options: ['USD', 'EUR', 'TZS', 'KES'],
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      // admin: {
      //   // Use custom component for amount field
      //   components: {
      //     Field: AmountFieldServer,
      //   },
      // },
    },
    {
      name: 'recipient', // Optional field for recipient
      type: 'text',
      required: false,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'numberOfPages', // Optional field for number of pages
      type: 'number',
      required: false,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'refNo', // Optional field for reference number
      type: 'text',
      required: false,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'pdfUrlUpload',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        // If no title is provided, generate one using refNo, amount, or fallback
        if (!data.title) {
          if (data.refNo) {
            data.title = `Document Ref: ${data.refNo}`;
          } else if (data.amount) {
            data.title = `Document Amount: ${data.amount}`;
          } else {
            data.title = 'Untitled Document'; // Fallback if neither refNo nor amount is provided
          }
        }

        return data;
      },
    ],
  },
  access: {
    read: (): boolean => true,
  },
};
