
import { NewsItem } from './types';

function parseMarkdown(md: string, date: string, filename: string): NewsItem {
  const trimmedMd = md.trim();
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/;
  const match = trimmedMd.match(frontmatterRegex);

  if (!match) {
    throw new Error(`Invalid markdown format in ${filename}. Ensure the file starts and ends the metadata with --- lines.`);
  }

  const yamlBlock = match[1];
  const content = match[2].trim();
  const metadata: any = {};

  yamlBlock.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      metadata[key] = value;
    }
  });

  // If no image metadata is present, set imageUrl to null
  // Inside parseMarkdown function
  const BASE = import.meta.env.BASE_URL;
  const imageUrl = metadata.image ? `${BASE}posts/${date}/${metadata.image}` : null;

  return {
    id: `${date}-${filename.replace('.md', '')}`,
    date: date,
    category: (metadata.category || 'GENERAL').toUpperCase(),
    title: metadata.title || 'Untitled Dispatch',
    author: metadata.author || undefined, // Remove "Editorial Staff" fallback
    readTime: metadata.readTime || '5 min read',
    image_url: imageUrl,
    content: content
  };
}

export async function fetchAllNews(): Promise<NewsItem[]> {
  const BASE = import.meta.env.BASE_URL; 
  
  try {
    const manifestResponse = await fetch(`${BASE}posts/manifest.json`);
    if (!manifestResponse.ok) throw new Error("Failed to load manifest");
    
    const manifest = await manifestResponse.json();
    const allArticles: NewsItem[] = [];

    for (const edition of manifest.editions) {
      const date = edition.date;
      const promises = edition.articles.map(async (filename: string) => {
        try {
          const res = await fetch(`${BASE}posts/${date}/${filename}`);
          if (!res.ok) return null;
          const text = await res.text();
          return parseMarkdown(text, date, filename);
        } catch (e) {
          console.error(`Error loading article ${filename}:`, e);
          return null;
        }
      });
      
      const results = await Promise.all(promises);
      results.forEach(item => {
        if (item) allArticles.push(item);
      });
    }

    return allArticles.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error("Critical error fetching news data:", error);
    return [];
  }
}
