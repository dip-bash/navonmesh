
/**
 * Represents a single news dispatch item
 */
export interface NewsItem {
  /** Unique identifier (date-filename) */
  id: string;
  /** Publication date in ISO format: YYYY-MM-DD */
  date: string;
  /** News category (TECHNOLOGY, ECONOMY, etc.) */
  category: string;
  /** Article title */
  title: string;
  /** URL to article image or null if no image */
  image_url: string | null;
  /** Article body content in markdown */
  content: string;
  /** Optional author name */
  author?: string;
  /** Reading time estimate (e.g., "5 min read") */
  readTime: string;
}

/**
 * Valid application view states
 */
export type AppView = 'feed' | 'index' | 'archive';

/**
 * Represents a single day in the archive
 */
export interface ArchiveDay {
  /** Date in ISO format: YYYY-MM-DD */
  date: string;
  /** Headline for this edition */
  headline: string;
  /** URL to archive image or null if no image */
  image_url: string | null;
}
