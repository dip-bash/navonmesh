import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// In ES Modules, __dirname does not exist. We must define it manually.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDir = path.join(__dirname, 'public', 'posts');
const manifestPath = path.join(postsDir, 'manifest.json');

function calculateAgeInDays(dateString) {
  const postDate = new Date(dateString + 'T00:00:00Z'); // Parse as UTC
  const today = new Date();
  const utcTodayDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const ageInMs = utcTodayDate - postDate;
  return Math.floor(ageInMs / (1000 * 60 * 60 * 24));
}

function generateManifest() {
  try {
    if (!fs.existsSync(postsDir)) {
      throw new Error(`Directory not found: ${postsDir}. Ensure 'posts' is inside 'public'.`);
    }

    const MIN_AGE_DAYS = 30;  // Keep posts <= 30 days old
    const MAX_AGE_DAYS = 60;  // Delete posts > 60 days old

    const editions = fs.readdirSync(postsDir)
      .filter(file => {
        const fullPath = path.join(postsDir, file);
        return fs.statSync(fullPath).isDirectory();
      })
      .map(dateFolder => {
        // Validate date format (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateFolder)) {
          console.warn(`⚠️  Skipping invalid date folder: ${dateFolder}`);
          return null;
        }

        const ageInDays = calculateAgeInDays(dateFolder);
        
        // Filter: Keep if age <= 30 days OR (age <= 60 days)
        // In other words: Keep if age <= 60 days
        if (ageInDays > MAX_AGE_DAYS) {
          console.log(`⏭️  Excluding ${dateFolder} (${ageInDays} days old - beyond 60 day limit)`);
          return null;
        }

        const folderPath = path.join(postsDir, dateFolder);
        const articles = fs.readdirSync(folderPath)
          .filter(file => file.endsWith('.md'));

        if (ageInDays <= MIN_AGE_DAYS) {
          console.log(`✓ Including ${dateFolder} (${ageInDays} days old - recent)`);
        } else {
          console.log(`✓ Including ${dateFolder} (${ageInDays} days old - archive, kept up to 60 days)`);
        }

        return {
          date: dateFolder,
          articles: articles
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.date.localeCompare(a.date));

    fs.writeFileSync(manifestPath, JSON.stringify({ editions }, null, 2));
    console.log(`✅ Manifest successfully generated at: ${manifestPath}`);
  } catch (error) {
    console.error(`❌ Build Error: ${error.message}`);
    process.exit(1);
  }
}

generateManifest();
