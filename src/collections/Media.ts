import type { CollectionConfig } from 'payload'
import { handleImageKitUpload, handleImageKitDelete } from '../imagekitPlugin/index' // Adjust the import path
import ImageKit from 'imagekit'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
