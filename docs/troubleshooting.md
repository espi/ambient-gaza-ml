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

## Debugging Tools

### Browser DevTools

1. **Console Debugging**:
```javascript
// Add debug logs
console.log('Map loaded:', map);
console.log('Data:', data);
console.log('Viewport:', viewport);
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