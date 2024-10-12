import path from 'path'
// import { postgresAdapter } from '@payloadcms/db-postgres'
import { en } from 'payload/i18n/en'
import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  ChecklistFeature,
  HeadingFeature,
  IndentFeature,
  InlineCodeFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'
import { PdfUploads } from './src/collections/PdfUploads'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
// import { s3Storage } from '@payloadcms/storage-s3'
import { imageKitPlugin } from './src/imagekitPlugin'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import imagekitPlugin from './src/ImageKit_V_001'
export default buildConfig({
  //editor: slateEditor({}),
  editor: lexicalEditor(),
  collections: [Users, Media, PdfUploads],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // db: postgresAdapter({
  //   pool: {
  //     connectionString: process.env.POSTGRES_URI || ''
  //   }
  // }),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),

  /**
   * Payload can now accept specific translations from 'payload/i18n/en'
   * This is completely optional and will default to English if not provided
   */
  i18n: {
    supportedLanguages: { en },
  },

  admin: {
    autoLogin: {
      email: 'dev@payloadcms.com',
      password: 'test',
      prefillOnly: true,
    },
  },
  async onInit(payload) {
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'dev@payloadcms.com',
          password: 'test',
        },
      })
    }
  },

  // sharp,
  plugins: [
    // imageKitPlugin({
    //   publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    //   privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    //   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
    //   folderPath: '/Wcs_Docs',
    // }),
    // imagekitPlugin({
    //   config: {
    //     publicKey: process.env.IK_PUBLIC_KEY || '',
    //     privateKey: process.env.IK_PRIVATE_KEY || '',
    //     endpoint: process.env.IK_ENDPOINT || '',
    //   },
    //   collections: {
    //     media: {
    //       uploadOption: {
    //         folder: 'test',
    //       },
    //       savedProperties: ['url'],
    //     },
    //   },
    // }),
    uploadthingStorage({
      collections: {
        [Media.slug]: true,
      },
      options: {
        apiKey: process.env.UPLOADTHING_SECRET,
        acl: 'public-read',
      },
    }),

    // s3Storage({
    //   collections: {
    //     ['media.slug']: true,
    //   },
    //   bucket: process.env.S3_BUCKET || '',
    //   config: {
    //     credentials: {
    //       accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    //       secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    //     },
    //     region: process.env.S3_REGION,
    //     // ... Other S3 configuration
    //   },
    // }),
  ],
})
