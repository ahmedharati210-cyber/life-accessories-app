/**
 * Slug utility functions for URL-safe string handling
 */

/**
 * Generate a URL-safe slug from a string
 * Handles Arabic text and special characters
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  
  // For Arabic text, create a fallback slug
  if (/[\u0600-\u06FF]/.test(text)) {
    // If it's Arabic text, create a timestamp-based slug
    return `item-${Date.now()}`;
  }
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Encode a slug for URL usage
 * Handles special characters and ensures URL safety
 */
export function encodeSlug(slug: string): string {
  if (!slug) return '';
  return encodeURIComponent(slug);
}

/**
 * Decode a slug from URL
 * Handles URL-encoded characters
 */
export function decodeSlug(encodedSlug: string): string {
  if (!encodedSlug) return '';
  try {
    return decodeURIComponent(encodedSlug);
  } catch (error) {
    console.warn('Failed to decode slug:', encodedSlug, error);
    return encodedSlug; // Return original if decoding fails
  }
}

/**
 * Validate if a slug is properly formatted
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  
  // Check if slug contains only valid characters
  const validSlugRegex = /^[a-zA-Z0-9-_]+$/;
  return validSlugRegex.test(slug);
}

/**
 * Sanitize a slug for safe usage
 * Removes or replaces invalid characters
 */
export function sanitizeSlug(slug: string): string {
  if (!slug) return '';
  
  return slug
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace invalid characters with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}
