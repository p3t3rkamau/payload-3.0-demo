import ImageKit from 'imagekit';
import type { Config, Plugin } from 'payload';

// Define your ImageKit settings
interface ImageKitPluginOptions {
  publicKey: string;
  privateKey: string;
  urlEndpoint: string;
  folderPath?: string; // Optional: folder path where files will be uploaded
}

// Function to handle file upload to ImageKit with folder path
export const handleImageKitUpload = async (data: any, imageKit: ImageKit, folderPath?: string) => {
  if (data.file) {
    try {
      const uploadResponse = await imageKit.upload({
        file: data.file.data, // Base64 encoded file data
        fileName: data.file.filename, // Name of the file
        folder: folderPath || '/', // Use the folder path if provided, otherwise default to root folder
      });

      // Store ImageKit file URL and file ID
      data.url = uploadResponse.url;
      data.imageKitFileId = uploadResponse.fileId; // Store file ID for later deletion
    } catch (error) {
      console.error('ImageKit upload failed:', error);
      throw new Error('Image upload failed.');
    }
  }
  return data;
};

// Function to handle file deletion from ImageKit
export const handleImageKitDelete = async (doc: any, imageKit: ImageKit) => {
  const fileId = doc?.imageKitFileId;

  if (fileId) {
    try {
      await imageKit.deleteFile(fileId);
      console.log(`File with ID ${fileId} deleted from ImageKit.`);
    } catch (error) {
      console.error(`Failed to delete file from ImageKit: ${error}`);
    }
  }
};

// Main plugin function
export const imageKitPlugin =
  (pluginOptions: ImageKitPluginOptions): Plugin =>
  (incomingConfig: Config): Config => {
    // Initialize ImageKit
    const imageKit = new ImageKit({
      publicKey: pluginOptions.publicKey,
      privateKey: pluginOptions.privateKey,
      urlEndpoint: pluginOptions.urlEndpoint,
    });

    // Ensure collections are defined to avoid undefined errors
    const collections = incomingConfig.collections || [];

    // Modify the incoming Payload config
    return {
      ...incomingConfig,
      collections: collections.map((collection) => {
        if (collection.slug === 'media') {
          // Add hooks for uploading and deleting files from ImageKit
          return {
            ...collection,
            hooks: {
              ...collection.hooks,
              beforeChange: [
                ...(collection.hooks?.beforeChange || []),
                async ({ data }) => handleImageKitUpload(data, imageKit, pluginOptions.folderPath), // Upload hook with folder path
              ],
              afterDelete: [
                ...(collection.hooks?.afterDelete || []),
                async ({ doc }) => handleImageKitDelete(doc, imageKit), // Delete hook
              ],
            },
          };
        }
        return collection;
      }),
    };
  };
