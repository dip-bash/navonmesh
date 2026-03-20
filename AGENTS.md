# Navonmesh Agentic Coding Guidelines

## Project Overview
Navonmesh is a React/TypeScript news editorial web application built with Vite. It displays curated news items organized by date with archive and index views. The app uses Tailwind CSS for styling and React 19 for UI.

## Build, Lint & Test Commands

### Development
```bash
npm run dev                    # Start dev server on http://localhost:3000/navonmesh/
```

### Production Build
```bash
npm run build                  # Build for production (includes manifest generation and .nojekyll copy)
npm run preview               # Preview production build locally
```

### Deployment
```bash
npm run deploy                # Deploy to gh-pages (runs build first)
```

**Note:** There are currently no test, lint, or type-check scripts. TypeScript is used for type safety but relies on IDE type checking and build-time compilation errors.

## Code Style Guidelines

### Imports & File Organization
- Use ES6 module imports with explicit file extensions (`import foo from './bar.ts'`)
- Group imports: React/external libs → types → local components → utilities
- Example pattern:
  ```typescript
  import React, { useState, useCallback } from 'react';
  import { AppView, NewsItem } from './types';
  import FeedView from './components/FeedView';
  import { fetchAllNews } from './data';
  ```

### TypeScript & Types
- Use strict TypeScript throughout (no `any` types)
- Always type component props with interfaces (not inline types)
- Export interfaces from `src/types.ts` for shared types
- Use `React.FC<PropsInterface>` for component declarations
- Example:
  ```typescript
  interface FeedViewProps {
    news: NewsItem[];
    date: string;
  }
  
  const FeedView: React.FC<FeedViewProps> = ({ news, date }) => { ... };
  ```

### Formatting & Naming
- **Files:** Use PascalCase for React components (`FeedView.tsx`), camelCase for utilities (`fetchAllNews.ts`)
- **Components:** PascalCase (e.g., `ScrollProgressBar`, `FeedItem`)
- **Functions:** camelCase (e.g., `getFallbackImage`, `handleScroll`)
- **Constants:** camelCase, use `as const` for type-safe constants
- **Line length:** Optimize for readability; Tailwind classes may be long
- **Spacing:** 2-space indentation (TypeScript/Vite default)

### React Patterns
- Use functional components with hooks (no class components)
- Memoize components that depend on filtered/derived data: `const Component = memo(({ props }) => ...)`
- Use `useCallback` for event handlers and functions passed as props to prevent unnecessary re-renders
- Use `useMemo` for expensive computations or derived state
- Use `useEffect` for side effects; always return cleanup functions for event listeners
- Keep components focused; extract helpers and sub-components using `memo` for performance

### Error Handling
- Wrap async operations in try-catch blocks
- Log errors to console for debugging (in dev mode)
- Provide user-friendly fallback UI (e.g., "No dispatches found for this date")
- Use optional chaining (`?.`) and nullish coalescing (`??`) to handle missing data gracefully
- Example:
  ```typescript
  const element = document.getElementById(`article-${id}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
  ```

### Styling
- Use Tailwind CSS utility classes exclusively for styling
- Keep inline styles minimal; prefer className objects for dynamic styles
- Use `clsx` or template literals for conditional classes:
  ```typescript
  className={`transition-opacity duration-300 ${
    currentView === 'feed' ? 'opacity-100' : 'opacity-0'
  }`}
  ```
- Responsive design: use Tailwind's responsive prefixes (`md:`, `lg:`)
- Custom animations in `<style>` tags when needed (e.g., loading bar)

### Comments & Documentation
- Add comments for complex logic, component purpose, or non-obvious behavior
- Use JSDoc for exported functions/components (optional but recommended)
- Example:
  ```typescript
  // Isolated Progress Bar to prevent FeedView re-renders
  const ScrollProgressBar = () => { ... };
  
  // Memoized FeedItem to prevent re-renders on scroll
  const FeedItem = memo(({ item, getFallback }) => { ... });
  ```

### State Management
- Use local component state (`useState`) for view-level state
- Lift state up only when necessary for sibling communication
- Avoid Redux/Context for this project; keep it lightweight
- Use URL hash for routing state (`window.location.hash`) to persist navigation

### Performance Considerations
- Memoize components and callbacks to avoid unnecessary re-renders
- Use event listener throttling where appropriate (e.g., `{ passive: true }` for scroll listeners)
- Lazy load images with placeholder/fallback strategy (see `ProgressiveImage` component)
- Split large lists into virtualized views if performance issues arise

## Project Structure
```
src/
  types.ts              # Shared TypeScript interfaces
  App.tsx              # Main app component with routing logic
  data.ts              # Data fetching functions
  index.tsx            # React DOM entry point
  components/
    FeedView.tsx       # News feed display
    ArchiveView.tsx    # Date archive view
    IndexOverlay.tsx   # Search/index overlay
    BottomNav.tsx      # Navigation component
    ProgressiveImage.tsx # Image loading with fallback
```

## Key Environment Variables
- `GEMINI_API_KEY`: Gemini API key (used for data generation/fetching)
- Defined in `.env` at project root; loaded by Vite

## Tailwind CSS Setup
- Configured in `tsconfig.json` and `vite.config.ts`
- Uses default Tailwind colors and utilities
- Custom keyframes defined inline in components when needed

