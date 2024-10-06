import type { CollectionConfig } from 'payload';
import { handleImageKitUpload, handleImageKitDelete} from '../imagekitPlugin/index'; // Adjust the import path
import ImageKit from 'imagekit';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ()=> true,
    update:()=> true,
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      label: 'Image URL',
      admin: {
        readOnly: true, // Managed by ImageKit
      },
    },
    {
      name: 'imageKitFileId',
      type: 'text',
      label: 'ImageKit File ID',
      admin: {
        readOnly: true, // Managed by ImageKit for deletion purposes
      },
    },
    {
      name: 'altText',
      type: 'text',
      label: 'Alt Text',
      required: false,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Caption',
      required: false,
    },
  ],
  upload: {
    adminThumbnail: 'url',
    disableLocalStorage: true, // Disable local storage
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        const imageKit = new ImageKit({
          publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
          privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
          urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
      
        });
        return await handleImageKitUpload(data, imageKit);
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const imageKit = new ImageKit({
          publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
          privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
          urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
        });
        return await handleImageKitDelete(doc, imageKit);
      },
    ],
  },
};
