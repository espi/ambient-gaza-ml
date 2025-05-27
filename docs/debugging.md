# Debugging Guide

This guide covers debugging tools and techniques for the MapLibre GL Next.js project, with a focus on marker visibility issues and the built-in debug panel.

## Debug Panel

### Overview

The debug panel is a comprehensive debugging tool that provides real-time insights into map state, data loading, and rendering performance.

### Activation

Add `?debug=true` to any URL to enable the debug panel:

```
# Development
http://localhost:3000?debug=true

# Production
https://your-domain.com?debug=true

# Specific pages
http://localhost:3000/map/embed?debug=true
```

### Features

The debug panel displays the following information:

#### Map Status
- **Map Loaded**: ✅/❌ indicator for map initialization
- **Rendering Mode**: JSX (flexible) vs WebGL (performance)
- **Total Places**: Count of all available places
- **Filtered Places**: Count after applying filters/limits
- **Categories**: Number of active categories
- **Cluster Radius**: Current clustering configuration
- **Markers Limit**: Maximum markers to display

#### Viewport Information
- **Current Viewport**: Real-time lat/lng/zoom coordinates
- **Map Bounds**: Calculated visible area boundaries (SW/NE corners)

#### Data Analysis
- **Places by Category**: Breakdown showing count per category
- **Sample Coordinates**: First 3 places with coordinates
- **All Coordinates**: Complete scrollable list of all places

## Marker Visibility Debugging

### Common Issues and Solutions

#### 1. Markers Not Appearing

**Symptoms**: Map loads but no markers are visible

**Debug Steps**:
1. Enable debug panel (`?debug=true`)
2. Check "Map Loaded" shows ✅
3. Verify "Total Places" > 0
4. Ensure "Categories" > 0

**Common Causes**:

##### Category Access Bug
```tsx
// ❌ Wrong - accessing array as object
const category = categories[categoryId]

// ✅ Correct - find category in array  
const category = categories.find(cat => cat.id === categoryId)
```

##### Data Type Issues
```tsx
// ❌ Wrong - parseFloat for integer IDs
const categoryId = parseFloat(category)

// ✅ Correct - parseInt with radix
const categoryId = parseInt(category, 10)
```

##### Clustering Configuration
```tsx
// High cluster radius groups all markers
const { clusters } = useSupercluster({
  points,
  options: {
    radius: 160, // ❌ Too high - clusters everything
    radius: 40,  // ✅ Better - allows individual markers
    maxZoom: 16,
  },
})
```

#### 2. Markers Outside Viewport

**Symptoms**: Some markers missing when panning/zooming

**Debug Steps**:
1. Check "Current Viewport" coordinates
2. Compare with "All Coordinates" list
3. Verify "Map Bounds" include expected coordinates

**Solution**: Adjust initial map position or zoom level
```tsx
export const GAZA_COORDINATES: ViewState = {
  latitude: 31.46,  // Centered between Gaza City and Deir al-Balah
  longitude: 34.42,
  zoom: 9.0,        // Zoomed out to see all locations
  bearing: 0,
  pitch: 0,
}
```

#### 3. Viewport Filtering Issues

**Symptoms**: Markers disappear when moving map

**Debug Process**:
```tsx
const displayedItems = useMemo(() => {
  const { deadzone } = AppConfig.map
  
  // Debug: Log viewport calculations
  if (process.env.NODE_ENV === 'development') {
    console.log('Viewport bounds:', { minLng, maxLng, minLat, maxLat })
    console.log('Total clusters before filtering:', clusters.length)
  }
  
  const filtered = clusters.filter(cluster => {
    const [longitude, latitude] = cluster.geometry.coordinates
    return longitude >= minLng && longitude <= maxLng && 
           latitude >= minLat && latitude <= maxLat
  })
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Filtered clusters:', filtered.length)
  }
  
  return filtered
}, [clusters, map, throttledViewState])
```

## Development Debugging

### Console Logging

The project includes development-only console logging:

```tsx
// Cluster analysis (CategoryMarkerCluster.tsx)
if (process.env.NODE_ENV === 'development') {
  console.log(`${category?.name} - Total clusters:`, displayedItems.length)
  displayedItems.forEach((cluster, index) => {
    const [lng, lat] = cluster.geometry.coordinates
    const { cluster: isCluster, point_count, id } = cluster.properties
    console.log(`${index}: ${isCluster ? 'CLUSTER' : 'MARKER'} at [${lng}, ${lat}]`)
  })
}
```

### Browser DevTools

#### Console Tab
- Check for MapLibre GL errors
- Monitor cluster analysis logs
- Verify data loading messages

#### Network Tab
- Verify MapTiler API requests
- Check tile loading performance
- Monitor API key usage

#### Elements Tab
- Inspect marker DOM elements
- Verify CSS classes and styles
- Check z-index stacking issues

## Performance Debugging

### Rendering Mode Analysis

**JSX Rendering** (Flexible but slower):
- Use for complex interactions
- Monitor performance with many markers
- Check React DevTools for re-renders

**WebGL Rendering** (Fast but limited):
- Use for large datasets
- Limited to MapLibre layer types
- Better performance, less flexibility

### Clustering Performance

```tsx
// Monitor clustering effectiveness
const clusterStats = useMemo(() => {
  const totalPoints = places.length
  const totalClusters = clusters.length
  const clusterReduction = ((totalPoints - totalClusters) / totalPoints * 100).toFixed(1)
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Clustering: ${totalPoints} points → ${totalClusters} clusters (${clusterReduction}% reduction)`)
  }
  
  return { totalPoints, totalClusters, clusterReduction }
}, [places, clusters])
```

## Troubleshooting Workflow

### Step 1: Enable Debug Panel
```
Add ?debug=true to URL
```

### Step 2: Verify Basic Functionality
- [ ] Map Loaded: ✅
- [ ] Total Places > 0
- [ ] Categories > 0
- [ ] Rendering Mode appropriate for use case

### Step 3: Check Data Integrity
- [ ] Review "All Coordinates" for expected values
- [ ] Verify "Places by Category" breakdown
- [ ] Ensure coordinates are within expected geographic bounds

### Step 4: Analyze Viewport
- [ ] Check "Current Viewport" coordinates
- [ ] Verify "Map Bounds" include marker coordinates
- [ ] Test panning/zooming to see if markers appear

### Step 5: Examine Clustering
- [ ] Review "Cluster Radius" setting
- [ ] Check console logs for cluster analysis
- [ ] Adjust clustering parameters if needed

### Step 6: Performance Analysis
- [ ] Monitor rendering mode performance
- [ ] Check browser DevTools for errors
- [ ] Analyze network requests and timing

## Common Fixes

### Quick Fixes for Missing Markers

1. **Reduce Cluster Radius**:
   ```tsx
   // In settings or configuration
   clusterRadius: 40 // Instead of 80+
   ```

2. **Zoom Out Initially**:
   ```tsx
   zoom: 9.0 // Instead of 10.0+
   ```

3. **Center Map Properly**:
   ```tsx
   latitude: 31.46,  // Center of data range
   longitude: 34.42, // Center of data range
   ```

4. **Fix Category Access**:
   ```tsx
   // Use find() instead of array indexing
   const category = categories.find(cat => cat.id === categoryId)
   ```

### Emergency Debug Mode

If markers are completely missing, temporarily disable viewport filtering:

```tsx
// In CategoryMarkerCluster.tsx - TEMPORARY DEBUG ONLY
const displayedItems = useMemo(() => {
  // Return all clusters for debugging
  return clusters
}, [clusters])
```

Remember to restore proper filtering after identifying the issue.

## Getting Help

When reporting marker visibility issues, include:

1. **Debug Panel Screenshot**: With `?debug=true` enabled
2. **Console Logs**: Any error messages or debug output
3. **Data Sample**: Example of place coordinates
4. **Environment**: Browser, viewport size, zoom level
5. **Steps to Reproduce**: Exact sequence to trigger the issue

This information helps identify whether the issue is data-related, configuration-related, or a bug in the rendering logic. 