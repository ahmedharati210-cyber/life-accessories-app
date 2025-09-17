'use client';

import Image from 'next/image';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 80,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  style,
  onClick,
}: CloudinaryImageProps) {
  // Simple working optimization - don't overcomplicate it
  let optimizedSrc = src;
  
  // If it's a Cloudinary URL and doesn't have transformations, add basic ones
  if (src.includes('cloudinary.com') && !src.includes('w_') && !src.includes('q_')) {
    // Extract cloud name and public ID
    const urlParts = src.split('/');
    const cloudNameIndex = urlParts.findIndex(part => part === 'res.cloudinary.com');
    if (cloudNameIndex !== -1) {
      const cloudName = urlParts[cloudNameIndex + 1];
      const uploadIndex = urlParts.findIndex(part => part === 'upload');
      if (uploadIndex !== -1) {
        const publicIdParts = urlParts.slice(uploadIndex + 1);
        const publicId = publicIdParts.join('/');
        
        // Simple optimization that works
        optimizedSrc = `https://res.cloudinary.com/${cloudName}/image/upload/w_${width || 400},h_${height || 400},q_auto,f_auto/${publicId}`;
      }
    }
  }

  const imageProps = {
    src: optimizedSrc,
    alt: alt || '',
    className,
    priority,
    quality,
    sizes,
    style,
    onClick,
    ...(fill ? { fill: true } : { width: width || 400, height: height || 300 }),
  };

  return <Image {...imageProps} />;
}

// Preset components for common use cases
export function ProductImage({ 
  src, 
  alt, 
  className = '',
  priority = false 
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={400}
      height={400}
      className={`object-cover ${className}`}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

export function HeroImage({ 
  src, 
  alt, 
  className = '',
  priority = true 
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={1920}
      height={1080}
      className={`object-cover ${className}`}
      priority={priority}
      sizes="100vw"
    />
  );
}

export function CategoryImage({ 
  src, 
  alt, 
  className = '',
  priority = false 
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={600}
      height={450}
      className={`object-cover ${className}`}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

export function ThumbnailImage({ 
  src, 
  alt, 
  className = '',
  priority = false 
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <CloudinaryImage
      src={src}
      alt={alt}
      width={150}
      height={150}
      className={`object-cover ${className}`}
      priority={priority}
      sizes="(max-width: 768px) 80px, 150px"
    />
  );
}
