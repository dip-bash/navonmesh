# Feature Implementation Summary

## Features Implemented

### Feature 1: Auto-Delete Posts (30-60 Day Retention Policy)

**Implementation:** Manifest-based filtering in `generate-manifest.js`

**Logic:**
- Posts <= 30 days old: Always kept (recent content)
- Posts 31-60 days old: Kept (archive retention window)
- Posts > 60 days old: Excluded from manifest
- Date calculation: UTC-based, calculated from today's date

**How It Works:**
1. When `npm run build` or `npm run deploy` is executed
2. `generate-manifest.js` runs first (pre-build step)
3. Calculates age of each date folder in `/public/posts/`
4. Only includes editions within 60-day window in `manifest.json`
5. Old article files remain in `/public/posts/` (preserved, just hidden)

**Verification:**
```bash
npm run build
```

Output shows:
```
Excluding 2025-12-15 (94 days old - beyond 60 day limit)
Excluding 2026-01-06 (72 days old - beyond 60 day limit)
...
Including 2026-01-21 (57 days old - archive, kept up to 60 days)
Including 2026-02-15 (32 days old - archive, kept up to 60 days)
Including 2026-03-15 (4 days old - recent)
Manifest successfully generated
```

**Files Modified:**
- `generate-manifest.js`: Added `calculateAgeInDays()` function and filtering logic

---

### Feature 2: Category-Based Sorting (Alphabetical)

**Implementation:** `useMemo` hook in `src/App.tsx` + component integration

**Categories (Alphabetical Order):**
1. CULTURE
2. ECONOMY
3. ENVIRONMENT
4. GENERAL
5. GLOBAL AFFAIRS
6. TECHNOLOGY

**How It Works:**
1. `src/App.tsx` creates `sortedNews` useMemo that sorts `filteredNews` by category
2. Uses `localeCompare()` for case-insensitive alphabetical sorting
3. Both `FeedView` and `IndexOverlay` receive pre-sorted articles
4. Display order automatically respects category sorting
5. Index numbering remains sequential (01, 02, 03...)

**Sorting Logic:**
```typescript
const sortedNews = useMemo(() => {
  return [...filteredNews].sort((a, b) => a.category.localeCompare(b.category));
}, [filteredNews]);
```

**Files Modified:**
- `src/App.tsx`: 
  - Added `sortedNews` useMemo (line 55-58)
  - Updated FeedView to use `sortedNews` (line 114)
  - Updated IndexOverlay to use `sortedNews` (line 124)
- `src/components/FeedView.tsx`: No changes (uses sorted props)
- `src/components/IndexOverlay.tsx`: No changes (uses sorted props)

---

## Test Posts Created

### Recent Posts (0-30 days) - 2026-03-15
- `tech_quantum.md` (TECHNOLOGY)
- `economy_markets.md` (ECONOMY)
- `culture_film.md` (CULTURE)
- `environment_climate.md` (ENVIRONMENT)
- `global_diplomacy.md` (GLOBAL AFFAIRS)
- `general_community.md` (GENERAL)

### Archive Posts (31-60 days) - 2026-02-15
- `tech_security.md` (TECHNOLOGY)
- `economy_inflation.md` (ECONOMY)
- `culture_theater.md` (CULTURE)
- `environment_ocean.md` (ENVIRONMENT)
- `global_trade.md` (GLOBAL AFFAIRS)

### Old Posts (>60 days) - 2025-12-15
- `old_tech.md` (TECHNOLOGY) - EXCLUDED
- `old_economy.md` (ECONOMY) - EXCLUDED

---

## Testing Instructions

### Test 1: Verify Age Filtering
```bash
npm run build
```
Check output for:
- Posts from 2025-12-15 and 2026-01-06 to 2026-01-13 show "Excluding"
- Posts from 2026-01-21, 2026-01-24, 2026-02-15 show "Including"
- Posts from 2026-03-15 show "Including"

### Test 2: Verify Category Sorting
```bash
npm run dev
# Visit http://localhost:3000/navonmesh/
```
Check FeedView (feed tab):
- Articles displayed in order: CULTURE -> ECONOMY -> ENVIRONMENT -> GENERAL -> GLOBAL AFFAIRS -> TECHNOLOGY

Check IndexOverlay (index button):
- Articles listed in same category order with sequential numbering

### Test 3: Verify Manifest Content
```bash
cat public/posts/manifest.json
```
Should show 4 editions:
- 2026-03-15 (6 articles)
- 2026-02-15 (5 articles)
- 2026-01-24 (5 articles)
- 2026-01-21 (8 articles)

Should NOT include:
- 2025-12-15 (over 60 days)
- 2026-01-06 to 2026-01-13 (over 60 days)

---

## Edge Cases Handled

1. UTC Time Zone: All calculations use UTC to ensure consistency across timezones
2. Date Format Validation: Invalid date folders are skipped with warning
3. Category Name Case: Sorting uses `localeCompare()` for case-insensitive results
4. Manifest Regeneration: Safe to run multiple times (idempotent)
5. Backward Compatibility: No breaking changes to existing components

---

## Performance Notes

- `sortedNews` is memoized, so it only recalculates when `filteredNews` changes
- Sorting is O(n log n) but only runs on current date's articles (typically 1-10 articles)
- Age calculation in manifest generation only happens during build (not runtime)

---

## Deployment

When deploying:
```bash
npm run deploy
```

This automatically:
1. Runs `npm run build` (which executes manifest generation with age filtering)
2. Excludes posts older than 60 days from deployed manifest
3. Pushes to gh-pages with clean, recent content only
