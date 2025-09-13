import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

export { cloudinary };

// Helper function to upload images
export const uploadImage = async (file: File | Buffer, folder: string = 'life-accessories'): Promise<string> => {
  try {
    // Convert File to Buffer if needed
    let buffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = file;
    }

    const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${buffer.toString('base64')}`, {
      folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

// Helper function to delete images
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error('Failed to delete image');
  }
};

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  width?: number,
  height?: number,
  quality: string = 'auto'
): string => {
  return cloudinary.url(publicId, {
    width,
    height,
    quality,
    fetch_format: 'auto',
    crop: 'fill',
  });
};
