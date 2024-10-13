import { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  fields: [
    {
      name: 'year',
      type: 'number',
      required: true,
      admin: {
        description: 'Year folder (e.g., 2021)',
      },
    },
    {
      name: 'month',
      type: 'date',
      required: true,
      admin: {
        description: 'Select a month folder',
        date: {
          pickerAppearance: 'monthOnly', // This restricts the picker to select the month within a year
          displayFormat: 'MMMM yyyy', // Display the month and year (e.g., June 2021)
        },
      },
    },
    {
      name: 'currency',
      type: 'select',
      options: ['USD', 'EUR', 'TZS', 'KES'],
      required: true,
    },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'Documents', // Assuming your Documents collection is named 'Documents'
      hasMany: true,
      required: true,
    },
  ],
}
