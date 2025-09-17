// Only import cloudinary on server side
let cloudinary: typeof import('cloudinary').v2 | null = null;

if (typeof window === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { v2 } = require('cloudinary');
  cloudinary = v2;
  
  // Configure Cloudinary
  cloudinary!.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Use HTTPS
  });
}

export { cloudinary };

// Helper function to upload images
export const uploadImage = async (file: File | Buffer, folder: string = 'life-accessories'): Promise<string> => {
  if (!cloudinary) {
    throw new Error('Cloudinary not initialized');
  }
  
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
  if (!cloudinary) {
    throw new Error('Cloudinary not initialized');
  }
  
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
  quality: string = 'auto',
  options: {
    crop?: string;
    gravity?: string;
    format?: string;
    dpr?: string | number;
    responsive?: boolean;
  } = {}
): string => {
  if (!cloudinary) {
    throw new Error('Cloudinary not initialized');
  }
  
  const {
    crop = 'fill',
    gravity = 'auto',
    format = 'auto',
    dpr = 'auto',
    responsive = true
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    quality,
    fetch_format: format,
    crop,
    gravity,
    dpr,
    responsive,
    flags: 'progressive', // Progressive JPEG loading
    ...(width && height && { crop: 'fill', gravity: 'auto' }),
  });
};

// Helper function for responsive images
export const getResponsiveImageUrl = (
  publicId: string,
  baseWidth: number,
  baseHeight: number
): string => {
  if (!cloudinary) {
    throw new Error('Cloudinary not initialized');
  }
  
  return cloudinary.url(publicId, {
    width: baseWidth,
    height: baseHeight,
    quality: 'auto',
    fetch_format: 'auto',
    crop: 'fill',
    gravity: 'auto',
    dpr: 'auto',
    responsive: true,
    flags: 'progressive',
    transformation: [
      { width: baseWidth, height: baseHeight, crop: 'fill', quality: 'auto' },
      { if: 'w_lt_640', width: 640, height: Math.round((640 * baseHeight) / baseWidth), crop: 'fill' },
      { if: 'w_lt_768', width: 768, height: Math.round((768 * baseHeight) / baseWidth), crop: 'fill' },
      { if: 'w_lt_1024', width: 1024, height: Math.round((1024 * baseHeight) / baseWidth), crop: 'fill' },
      { if: 'w_lt_1280', width: 1280, height: Math.round((1280 * baseHeight) / baseWidth), crop: 'fill' },
      { if: 'w_lt_1920', width: 1920, height: Math.round((1920 * baseHeight) / baseWidth), crop: 'fill' },
    ]
  });
};
