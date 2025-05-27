# Troubleshooting Guide

This guide covers common issues and solutions when working with the MapLibre GL Next.js starter project.

## Installation Issues

### Node.js Version Compatibility

**Problem**: Build fails with version-related errors

**Solution**:
```bash
# Check your Node.js version
node --version

# Should be 18.18+ or 20.10+ for Next.js 15.1
# Use nvm to switch versions
nvm install 20.10.0
nvm use 20.10.0
```

### Package Installation Failures

**Problem**: `npm install` fails with dependency conflicts

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# If still failing, try legacy peer deps
npm install --legacy-peer-deps
```

## Map Display Issues

### Map Not Rendering

**Problem**: Map container is empty or shows error

**Solutions**:

1. **Check API Key Configuration**:
```javascript
// Verify environment variables are loaded
console.log('API Key:', process.env.NEXT_PUBLIC_MAPTILER_KEY);
```

2. **Verify CSS Import**:
```tsx
// Make sure MapLibre CSS is imported
import 'maplibre-gl/dist/maplibre-gl.css';
```

3. **Check Container Dimensions**:
```tsx
// Map container must have explicit dimensions
<div style={{ width: '100%', height: '400px' }}>
  <Map />
</div>
```

### Map Style Loading Errors

**Problem**: Map loads but style fails to load

**Solutions**:

1. **Verify Style URL**:
```javascript
// Correct format
const mapStyle = `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`;
```

2. **Check API Key Permissions**:
   - Verify key is active in MapTiler dashboard
   - Check usage limits
   - Ensure key has map access permissions

## Performance Issues

### Slow Map Loading

**Problem**: Map takes too long to load or is unresponsive

**Solutions**:

1. **Optimize Data Sources**:
```tsx
// Use clustering for large datasets
import { useSupercluster } from 'use-supercluster';

// Implement viewport-based data loading
const visibleData = useMemo(() => {
  return data.filter(point => 
    isPointInBounds(point, mapBounds)
  );
}, [data, mapBounds]);
```

2. **Optimize Layer Rendering**:
```tsx
// Use layer rendering instead of JSX for performance
<Source id="data" type="geojson" data={geojsonData}>
  <Layer {...layerStyle} />
</Source>
```

## Build Issues

### Next.js Build Failures

**Problem**: `npm run build` fails

**Solutions**:

1. **Check TypeScript Errors**:
```bash
# Run TypeScript check
npx tsc --noEmit

# Fix type errors before building
```

2. **Clear Build Cache**:
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

## Runtime Errors

### Component Hydration Errors

**Problem**: Hydration mismatch errors in browser

**Solutions**:

1. **Use Dynamic Imports for Map**:
```tsx
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});
```

## Environment Issues

### Environment Variables Not Loading

**Problem**: API keys or config not available

**Solutions**:

1. **Check File Names**:
```bash
# Files should be named exactly:
.env.local          # Local development
.env.production     # Production build
```

2. **Verify Variable Names**:
```bash
# Client-side variables must start with NEXT_PUBLIC_
NEXT_PUBLIC_MAPTILER_KEY=your_key_here

# Server-side only
MAPTILER_KEY=your_key_here
```

## Development Workflow Issues

### Hot Reload Not Working

**Problem**: Changes not reflecting in development

**Solutions**:

1. **Restart Development Server**:
```bash
# Kill existing process
pkill -f "next dev"

# Start fresh
npm run dev
```

2. **Check for Syntax Errors**:
```bash
# Check console for compilation errors
# Fix any TypeScript or ESLint errors
```

## Marker Visibility Issues

### Markers Not Appearing

**Problem**: Markers are not visible on the map despite data being loaded

**Common Causes & Solutions**:

1. **Category Access Bug**:
```tsx
// ❌ Wrong - accessing array as object
const category = categories[categoryId];

// ✅ Correct - find category in array
const category = categories.find(cat => cat.id === categoryId);
```

2. **Clustering Configuration**:
```tsx
// Check cluster radius - high values cluster all markers
const { clusters } = useSupercluster({
  points,
  options: {
    radius: 80, // Lower values = less clustering
    maxZoom: 16,
  },
});
```

3. **Viewport Filtering**:
```tsx
// Ensure markers are within visible bounds
const displayedItems = useMemo(() => {
  const { deadzone } = AppConfig.map;
  // ... viewport bounds calculation
  return clusters.filter(cluster => {
    const [longitude, latitude] = cluster.geometry.coordinates;
    return longitude >= minLng && longitude <= maxLng && 
           latitude >= minLat && latitude <= maxLat;
  });
}, [clusters, map, throttledViewState]);
```

4. **Data Type Issues**:
```tsx
// Ensure proper type conversion
const categoryId = parseInt(category, 10); // Not parseFloat()
```

### Debug Panel

**Enable Debug Mode**: Add `?debug=true` to your URL to activate the debug panel.

**Example**: `http://localhost:3000?debug=true`

**Debug Panel Features**:
- **Map Status**: Loading state, rendering mode (JSX/WebGL)
- **Data Counts**: Total places, filtered places, categories
- **Viewport Info**: Current coordinates, zoom level, map bounds
- **Category Breakdown**: Places grouped by category with counts
- **Coordinate List**: All place coordinates for verification
- **Cluster Settings**: Current radius and marker limits

**Using the Debug Panel**:

1. **Check Data Loading**:
   - Verify "Total Places" matches expected count
   - Ensure "Categories" shows correct number
   - Check "Map Loaded" shows ✅

2. **Verify Coordinates**:
   - Review "Sample Coordinates" for expected lat/lng ranges
   - Check "All Coordinates" list for data accuracy

3. **Analyze Clustering**:
   - Monitor "Cluster Radius" setting
   - Adjust via settings panel if needed
   - Lower radius = more individual markers

4. **Viewport Debugging**:
   - Check "Current Viewport" coordinates
   - Verify "Map Bounds" include your marker coordinates
   - Pan/zoom to see if markers appear

## Debugging Tools

### Built-in Debug Panel

**Activation**: Add `?debug=true` to any URL
```
http://localhost:3000?debug=true
http://localhost:3000/map/embed?debug=true
```

**Features**:
- Real-time map state monitoring
- Data validation and counts
- Coordinate verification
- Performance metrics
- Clustering analysis

### Browser DevTools

1. **Console Debugging**:
```javascript
// Add debug logs
console.log('Map loaded:', map);
console.log('Data:', data);
console.log('Viewport:', viewport);

// Development-only logging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', debugData);
}
```

2. **Network Tab**:
   - Check for failed API requests
   - Verify MapTiler tile requests
   - Monitor request timing

### MapLibre GL Debugging

1. **Enable Debug Mode**:
```tsx
<Map
  mapStyle={mapStyle}
  onLoad={(evt) => {
    // Access map instance for debugging
    window.map = evt.target;
    console.log('Map loaded:', evt.target);
  }}
/>
```

2. **Marker Debugging**:
```tsx
// Log cluster information in development
if (process.env.NODE_ENV === 'development') {
  console.log(`${category?.name} - Total clusters:`, displayedItems.length);
  displayedItems.forEach((cluster, index) => {
    const [lng, lat] = cluster.geometry.coordinates;
    const { cluster: isCluster, point_count, id } = cluster.properties;
    console.log(`${index}: ${isCluster ? 'CLUSTER' : 'MARKER'} at [${lng}, ${lat}]`);
  });
}
```

## Getting Help

### Community Resources

- **MapLibre GL JS**: [GitHub Issues](https://github.com/maplibre/maplibre-gl-js/issues)
- **react-map-gl**: [GitHub Discussions](https://github.com/visgl/react-map-gl/discussions)
- **Next.js**: [GitHub Discussions](https://github.com/vercel/next.js/discussions)

### Creating Bug Reports

When reporting issues, include:

1. **Environment Information**:
```bash
node --version
npm --version
npx next --version
```

2. **Error Messages**:
   - Include complete error stack traces
   - Browser console errors
   - Build-time errors 