/**
 * URL utilities for the application
 */

/**
 * Get the base URL for asset paths
 * Used for constructing paths to posts, images, and manifest
 */
export const getBaseUrl = (): string => {
  return import.meta.env.BASE_URL;
};
