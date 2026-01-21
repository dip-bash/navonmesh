import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// In ES Modules, __dirname does not exist. We must define it manually.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const postsDir = path.join(__dirname, 'public', 'posts');
const manifestPath = path.join(postsDir, 'manifest.json');

function generateManifest() {
  try {
    if (!fs.existsSync(postsDir)) {
      throw new Error(`Directory not found: ${postsDir}. Ensure 'posts' is inside 'public'.`);
    }

    const editions = fs.readdirSync(postsDir)
      .filter(file => {
        const fullPath = path.join(postsDir, file);
        return fs.statSync(fullPath).isDirectory();
      })
      .map(dateFolder => {
        const folderPath = path.join(postsDir, dateFolder);
        const articles = fs.readdirSync(folderPath)
          .filter(file => file.endsWith('.md'));

        return {
          date: dateFolder,
          articles: articles
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    fs.writeFileSync(manifestPath, JSON.stringify({ editions }, null, 2));
    console.log(`✅ Manifest successfully generated at: ${manifestPath}`);
  } catch (error) {
    console.error(`❌ Build Error: ${error.message}`);
    process.exit(1);
  }
}

generateManifest();
