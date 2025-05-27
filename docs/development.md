# Development Guide

This guide covers the development workflow and project structure for the MapLibre GL Next.js starter.

## Project Structure

```
├── src/
│   ├── components/          # React components
│   ├── lib/                # Utilities and libraries
│   │   ├── hooks/          # Custom React hooks
│   │   ├── theme/          # Theme configuration
│   │   └── api/            # API utilities
│   ├── map/                # Map-related components and utilities
│   ├── pages/              # Next.js pages (if using pages router)
│   ├── app/                # Next.js app router (if using app router)
│   └── zustand/            # Zustand state management
├── public/                 # Static assets
├── docs/                   # Documentation
└── ...config files
```

## Technology Stack

### Core Framework
- **Next.js 15.1.0**: React framework with latest features
- **React 18.2.0**: UI library
- **TypeScript 5.1.6**: Type safety

### Map Integration
- **MapLibre GL JS 3.6.2**: Open-source map rendering engine
- **react-map-gl 7.1.7**: React wrapper for MapLibre GL

### State Management
- **Zustand 5.0.2**: Lightweight state management

### Styling
- **Tailwind CSS 3.4.16**: Utility-first CSS framework
- **Lucide Icons 0.259.0**: Icon library

## Development Workflow

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format

# Run lint-staged (pre-commit)
npm run lint-staged
```

### Code Quality Tools

#### ESLint Configuration
The project uses a comprehensive ESLint setup:
- **eslint-config-next**: Next.js specific rules
- **eslint-config-airbnb**: Airbnb JavaScript style guide
- **eslint-config-airbnb-typescript**: TypeScript-specific Airbnb rules
- **eslint-config-prettier**: Disables conflicting Prettier rules

#### Prettier Configuration
Automatic code formatting with:
- Import sorting via `@trivago/prettier-plugin-sort-imports`
- Tailwind class sorting via `prettier-plugin-tailwindcss`

#### Pre-commit Hooks
Husky and lint-staged ensure code quality:
- Automatic linting and formatting on commit
- Prevents commits with linting errors

### TypeScript Configuration

The project uses modern TypeScript features:
- **Target**: ES2017
- **Module Resolution**: Bundler (Next.js 15.1 compatible)
- **Strict Mode**: Enabled
- **Path Mapping**: Configured for clean imports

#### Import Aliases
- `@/components/*` → `./src/components/*`
- `@/lib/*` → `./src/lib/*`
- `@/map/*` → `./src/map/*`
- `@/hooks/*` → `./src/lib/hooks/*`
- `@/api/*` → `./src/lib/api/*`
- `@/zustand/*` → `./src/zustand/*`

## MapLibre Integration

### MapBox to MapLibre Migration
The project includes automatic resolution of MapBox imports to MapLibre:

```javascript
// In next.config.js
webpack: config => {
  config.resolve.alias['mapbox-gl'] = 'maplibre-gl'
  return config
}
```

### Rendering Approaches

#### 1. Layer Rendering (Performance Optimized)
- Uses MapLibre GL's native layer system
- Extremely fast rendering
- Limited to MapLibre GL layer types
- Best for large datasets

#### 2. JSX Rendering (Flexible)
- Uses React components as map overlays
- Full React ecosystem support
- Slightly slower performance
- Best for complex UI interactions

## State Management with Zustand

The project uses Zustand for lightweight state management:

```typescript
// Example store structure
interface MapStore {
  // Map state
  viewport: ViewState;
  mapStyle: string;
  
  // Actions
  setViewport: (viewport: ViewState) => void;
  setMapStyle: (style: string) => void;
}
```

## Best Practices

### Performance
1. **Use layer rendering for large datasets**
2. **Implement proper memoization for React components**
3. **Optimize re-renders with useCallback and useMemo**
4. **Use Zustand selectors to prevent unnecessary updates**

### Code Organization
1. **Separate map logic from UI components**
2. **Use custom hooks for reusable map functionality**
3. **Keep components small and focused**
4. **Use TypeScript interfaces for all props and state**

### Map Development
1. **Test with different viewport sizes**
2. **Implement proper error boundaries**
3. **Handle map loading states**
4. **Provide fallbacks for map failures**

## Environment Variables

### Required
- `MAPTILER_KEY`: Your MapTiler API key
- `NEXT_PUBLIC_MAPTILER_KEY`: Public-facing API key

### Optional
- `NEXT_PUBLIC_VERCEL_ANALYTICS_ID`: Vercel Analytics ID

## Common Development Tasks

### Adding a New Map Layer
1. Create layer configuration
2. Add to map component
3. Update TypeScript types
4. Test performance impact

### Adding a New Component
1. Create in appropriate `src/components` subdirectory
2. Export from index file
3. Add TypeScript interfaces
4. Update Storybook (if applicable)

### Updating Dependencies
1. Check for breaking changes
2. Update TypeScript types
3. Test map functionality
4. Update documentation

## Debugging

### Debug Panel

The project includes a comprehensive debug panel for development and troubleshooting.

#### **Activation**
Add `?debug=true` to any URL to enable the debug panel:
```
http://localhost:3000?debug=true
http://localhost:3000/map/embed?debug=true
```

#### **Implementation**
```tsx
// In MapCore.tsx
const router = useRouter()
const isDebugMode = router.query.debug === 'true'

// Conditional rendering
{isDebugMode && <DebugPanel />}
```

#### **Features**
- **Real-time Map State**: Loading status, rendering mode, viewport coordinates
- **Data Validation**: Place counts, category breakdown, coordinate verification
- **Performance Metrics**: Cluster settings, marker limits, bounds calculation
- **Development Logging**: Console output for cluster analysis (development only)

#### **Debug Panel Sections**
1. **Map Status**: Loading state, JSX vs WebGL rendering mode
2. **Data Counts**: Total places, filtered places, active categories
3. **Viewport Info**: Current lat/lng/zoom, calculated map bounds
4. **Category Analysis**: Places grouped by category with counts
5. **Coordinate List**: All place coordinates for data verification

#### **Common Debug Scenarios**

**Markers Not Visible**:
1. Check "Map Loaded" shows ✅
2. Verify "Total Places" matches expected count
3. Review "Current Viewport" coordinates
4. Ensure marker coordinates are within "Map Bounds"
5. Check "Cluster Radius" setting (lower = more individual markers)

**Performance Issues**:
1. Monitor cluster count vs total places
2. Check rendering mode (WebGL vs JSX)
3. Analyze viewport filtering effectiveness
4. Review console logs for clustering behavior

### Map Issues
- Check browser console for MapLibre errors
- Verify API key is correctly set
- Test with different map styles
- Check network requests in DevTools
- **Use debug panel** (`?debug=true`) for comprehensive diagnostics

### Build Issues
- Verify Node.js version compatibility
- Clear `.next` directory
- Check for TypeScript errors
- Verify all dependencies are installed

## Performance Monitoring

The project includes Vercel Analytics for performance tracking:
- Core Web Vitals monitoring
- User interaction tracking
- Error boundary reporting

## Implementation Details

### Hover/Focus Popup Functionality

Recent implementation added interactive hover and focus-triggered popups for map markers when using JSX rendering mode.

#### **State Management Extensions**
Extended `useMapStore` with new hover/focus state:
```typescript
interface MapStoreValues {
  // ... existing properties
  hoveredMarkerId?: number
  setHoveredMarkerId: (payload: number | undefined) => void
  focusedMarkerId?: number
  setFocusedMarkerId: (payload: number | undefined) => void
}
```

#### **Component Updates**

**Marker Component** (`src/map/Markers/Marker.tsx`):
- Enhanced with hover/focus event handlers
- Improved accessibility with proper button elements and ARIA labels
- Added Tailwind classes for smooth visual transitions:
  - `hover:scale-110 focus:scale-110` for interactive feedback
  - `transition-transform duration-200` for smooth animations

**New HoverPopup Component** (`src/map/Popups/HoverPopup.tsx`):
- Lightweight popup for hover/focus states
- Displays essential place information without heavy UI elements
- Uses `pointer-events-none` to prevent interaction interference

**Popups Container** (`src/map/Popups/index.tsx`):
- Integrated hover popup logic alongside existing click popups
- Smart display logic: hover popups only show when no full popup is active

#### **User Experience Features**
- **Mouse Interaction**: Hover over markers shows instant preview popup
- **Keyboard Navigation**: Tab through markers with focus-triggered popups
- **Accessibility**: Full WCAG compliance with proper ARIA labels and focus management
- **Performance**: Optimized for JSX rendering mode without affecting layer rendering

#### **Usage**
1. Enable "Marker Rendering: JSX" in the settings panel
2. Hover over any marker to see instant popup preview
3. Use Tab key for keyboard navigation with focus popups
4. Click markers for full popup experience (unchanged) 