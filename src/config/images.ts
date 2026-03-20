/**
 * Configuration for fallback images used throughout the application
 */

/**
 * Maps news categories to their respective fallback image URLs
 * These are used when the primary image fails to load
 */
export const FALLBACK_IMAGES: Record<string, string> = {
  'GLOBAL AFFAIRS': 'https://images.unsplash.com/photo-1569163139394-de4798aa62b2?w=800&h=1000&fit=crop',
  'TECHNOLOGY': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=1000&fit=crop',
  'ECONOMY': 'https://images.unsplash.com/photo-1460925895917-adf4e565db13?w=800&h=1000&fit=crop',
  'CULTURE': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop',
  'ENVIRONMENT': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1000&fit=crop',
  'GENERAL': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=1000&fit=crop'
};

/**
 * Get the fallback image URL for a given category
 * @param category - News category
 * @returns URL string for the fallback image
 */
export const getFallbackImage = (category: string): string => {
  return FALLBACK_IMAGES[category] || FALLBACK_IMAGES['GENERAL'];
};
