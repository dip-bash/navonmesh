
export interface NewsItem {
  id: string;
  date: string; // ISO format: YYYY-MM-DD
  category: string;
  title: string;
  image_url: string | null;
  content: string;
  author?: string;
  readTime: string;
}

export type AppView = 'feed' | 'index' | 'archive';

export interface ArchiveDay {
  date: string;
  headline: string;
  image_url: string | null;
}
