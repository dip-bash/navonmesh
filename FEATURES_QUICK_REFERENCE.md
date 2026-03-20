# Features Quick Reference

## Feature 1: Auto-Delete Posts

### What it does
Automatically excludes posts older than 60 days from the published manifest during build/deploy.

### Timeline
- **Days 0-30:** Recent (always included)
- **Days 31-60:** Archive (included for reference)
- **Days 61+:** Expired (excluded from manifest)

### How to use
Just deploy normally:
```bash
npm run deploy
```

The filtering happens automatically. Old posts are hidden from the UI but files remain on disk.

### Where it runs
- `generate-manifest.js` → runs during `npm run build`
- Automatic pre-step before deployment

### Configuration
Edit these constants in `generate-manifest.js` to adjust:
```javascript
const MIN_AGE_DAYS = 30;  // Keep if <= 30 days
const MAX_AGE_DAYS = 60;  // Delete if > 60 days
```

---

## Feature 2: Category Sorting (Alphabetical)

### What it does
Displays all articles sorted alphabetically by category in both Feed and Index views.

### Sort Order
1. CULTURE
2. ECONOMY
3. ENVIRONMENT
4. GENERAL
5. GLOBAL AFFAIRS
6. TECHNOLOGY

### Where it appears
- **Feed View:** Articles displayed top-to-bottom in category order
- **Index View:** Numbered list (01, 02, 03...) in category order

### How it works
Invisible to users - happens in real-time when you switch dates:
```typescript
// In src/App.tsx
const sortedNews = useMemo(() => {
  return [...filteredNews].sort((a, b) => 
    a.category.localeCompare(b.category)
  );
}, [filteredNews]);
```

### To customize
If you want a different sort order, edit `src/App.tsx` line 57:
```typescript
// Example: Sort by title instead
.sort((a, b) => a.title.localeCompare(b.title))

// Example: Reverse alphabetical
.sort((a, b) => b.category.localeCompare(a.category))

// Example: Custom order
const order = ['TECHNOLOGY', 'ECONOMY', 'CULTURE', 'ENVIRONMENT', 'GLOBAL AFFAIRS', 'GENERAL'];
.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category))
```

---

## Testing

### Test Feature 1 (Auto-Delete)
```bash
npm run build
```
Look for build output showing which posts are included/excluded

### Test Feature 2 (Category Sorting)
```bash
npm run dev
# Visit http://localhost:3000/navonmesh/
# Click through dates and check article order
```

### Test with Real Data
1. Add new posts to `/public/posts/YYYY-MM-DD/`
2. Run `npm run build`
3. Check `manifest.json` to verify posts appear (if age ≤ 60 days)

---

## Adding New Posts

### File Structure
```
/public/posts/
├── 2026-03-20/          ← Date folder (YYYY-MM-DD format)
│   ├── article1.md
│   ├── article2.md
│   └── article3.md
└── manifest.json        ← Auto-generated (don't edit manually)
```

### Article Format
```markdown
---
title: "Article Title Here"
category: "TECHNOLOGY"  ← Must be one of the known categories
readTime: "5 min read"
author: "Author Name"   ← Optional
image: "filename.jpg"   ← Optional (in same folder)
---

Article content goes here. Markdown is fully supported.
Multiple paragraphs are separated by blank lines.
```

### Available Categories
- CULTURE
- ECONOMY
- ENVIRONMENT
- GENERAL (default if omitted)
- GLOBAL AFFAIRS
- TECHNOLOGY

### After Adding Posts
1. Run `npm run build` to regenerate manifest
2. Check console output to verify posts are included
3. Run `npm run dev` to preview
4. Run `npm run deploy` to publish

---

## Troubleshooting

### Posts not appearing?
1. Check date format: must be `YYYY-MM-DD`
2. Check if post is older than 60 days (excluded by design)
3. Run `npm run build` to regenerate manifest
4. Check `manifest.json` to verify post is listed

### Wrong category order?
- Sorting is automatic alphabetically
- To change order, edit `src/App.tsx` line 57
- Restart dev server after changes

### Deployment not cleaning old posts?
- Ensure you're running `npm run deploy` (not just `npm run build`)
- Old posts are excluded from manifest but files remain
- To delete files from disk, remove them manually from `/public/posts/`

---

## Deployment Checklist

Before running `npm run deploy`:
- [ ] All posts have valid dates (YYYY-MM-DD format)
- [ ] All posts have valid categories
- [ ] Markdown files have correct frontmatter
- [ ] Run `npm run build` and check output
- [ ] Test locally with `npm run dev`
- [ ] Verify manifest.json looks correct

Then deploy:
```bash
npm run deploy
```

That's it! Auto-cleanup happens automatically.
