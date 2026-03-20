
import { NewsItem } from './types';
import { getBaseUrl } from './utils/urlUtils';

interface Metadata {
  image?: string;
  category?: string;
  title?: string;
  author?: string;
  readTime?: string;
}

// Track ongoing fetch to prevent race conditions
let fetchController: AbortController | null = null;

/**
 * Parses markdown content into a NewsItem
 * Extracts YAML frontmatter and article content
 * @param md - Raw markdown content with frontmatter
 * @param date - Publication date in ISO format (YYYY-MM-DD)
 * @param filename - Name of the markdown file (used for ID generation)
 * @returns Parsed NewsItem object
 * @throws Error if markdown format is invalid
 */
function parseMarkdown(md: string, date: string, filename: string): NewsItem {
  const trimmedMd = md.trim();
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/;
  const match = trimmedMd.match(frontmatterRegex);

  if (!match) {
    throw new Error(`Invalid markdown format in ${filename}. Ensure the file starts and ends the metadata with --- lines.`);
  }

  const yamlBlock = match[1];
  const content = match[2].trim();
  const metadata: Metadata = {};

  yamlBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      if (key === 'image' || key === 'category' || key === 'title' || key === 'author' || key === 'readTime') {
        metadata[key as keyof Metadata] = value;
      }
    }
  });

  const BASE = getBaseUrl();
  const imageUrl = metadata.image ? `${BASE}posts/${date}/${metadata.image}` : null;

  return {
    id: `${date}-${filename.replace('.md', '')}`,
    date: date,
    category: (metadata.category || 'GENERAL').toUpperCase(),
    title: metadata.title || 'Untitled Dispatch',
    author: metadata.author || undefined,
    readTime: metadata.readTime || '5 min read',
    image_url: imageUrl,
    content: content
  };
}

/**
 * Fetches all news articles from the manifest
 * Automatically aborts any previous in-flight requests to prevent race conditions
 * @returns Promise resolving to array of NewsItem objects
 * @throws Logs errors to console but returns empty array on failure
 */
export async function fetchAllNews(): Promise<NewsItem[]> {
  // Abort any previous in-flight requests
  fetchController?.abort();
  fetchController = new AbortController();
  
  const BASE = getBaseUrl(); 
  
  try {
    const manifestResponse = await fetch(`${BASE}posts/manifest.json`, {
      signal: fetchController.signal
    });
    if (!manifestResponse.ok) {
      throw new Error(`Failed to load manifest: ${manifestResponse.statusText}`);
    }
    
    const manifest = await manifestResponse.json();
    const allArticles: NewsItem[] = [];

    for (const edition of manifest.editions) {
      const date = edition.date;
      const promises = edition.articles.map(async (filename: string) => {
        try {
          const res = await fetch(`${BASE}posts/${date}/${filename}`, {
            signal: fetchController!.signal
          });
          if (!res.ok) {
            console.warn(`Failed to load article ${filename} (${res.statusText})`);
            return null;
          }
          const text = await res.text();
          return parseMarkdown(text, date, filename);
        } catch (e) {
          // Ignore abort errors - request was cancelled
          if (e instanceof DOMException && e.name === 'AbortError') {
            return null;
          }
          const errorMsg = e instanceof Error ? e.message : 'Unknown error';
          console.error(`Error loading article ${filename}: ${errorMsg}`);
          return null;
        }
      });
      
      const results = await Promise.all(promises);
      results.forEach(item => {
        if (item) allArticles.push(item);
      });
    }

    return allArticles;
  } catch (error) {
    // Ignore abort errors - request was cancelled
    if (error instanceof DOMException && error.name === 'AbortError') {
      return [];
    }
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Critical error fetching news data: ${errorMsg}`);
    return [];
  }
}
