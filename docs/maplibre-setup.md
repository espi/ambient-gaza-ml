# MapLibre Integration Guide

This guide covers MapLibre GL JS integration, customization, and best practices in the Next.js environment.

## MapLibre GL Overview

MapLibre GL JS is an open-source library for displaying interactive maps with vector tiles and WebGL rendering. It's a community-led fork of Mapbox GL JS.

### Key Features
- **Vector Tiles**: Efficient data transfer and rendering
- **WebGL Rendering**: Hardware-accelerated graphics
- **Style Specification**: Flexible map styling
- **Interactive Controls**: Zoom, pan, rotate controls
- **Custom Layers**: Extend with custom rendering

## Current Configuration

### Dependencies
- **maplibre-gl**: 3.6.2 (Core library)
- **react-map-gl**: 7.1.7 (React wrapper)

### MapBox Compatibility Layer
The project includes automatic aliasing of MapBox imports to MapLibre:

```javascript
// next.config.js
webpack: config => {
  config.resolve.alias['mapbox-gl'] = 'maplibre-gl'
  return config
}
```

This allows seamless migration from existing MapBox code.

## Map Setup

### Basic Map Component

```tsx
import Map, { NavigationControl, ScaleControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapComponent() {
  return (
    <Map
      initialViewState={{
        longitude: -74.5,
        latitude: 40,
        zoom: 9
      }}
      style={{width: 600, height: 400}}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`}
    >
      <NavigationControl position="top-left" />
      <ScaleControl />
    </Map>
  );
}
```

### Environment Configuration

MapTiler provides the map styles and tiles:

```env
MAPTILER_KEY=your_api_key_here
NEXT_PUBLIC_MAPTILER_KEY=your_api_key_here
```

### Available Map Styles

MapTiler provides several built-in styles:

- **Streets**: `https://api.maptiler.com/maps/streets/style.json?key=${API_KEY}`
- **Satellite**: `https://api.maptiler.com/maps/satellite/style.json?key=${API_KEY}`
- **Terrain**: `https://api.maptiler.com/maps/terrain/style.json?key=${API_KEY}`
- **Topo**: `https://api.maptiler.com/maps/topo/style.json?key=${API_KEY}`

## Layer Types

### 1. Built-in Layers

#### Point Layers
```tsx
import { Layer, Source } from 'react-map-gl/maplibre';

const pointLayer = {
  id: 'points',
  type: 'circle',
  paint: {
    'circle-radius': 6,
    'circle-color': '#007cbf'
  }
};

<Source id="points" type="geojson" data={pointData}>
  <Layer {...pointLayer} />
</Source>
```

#### Line Layers
```tsx
const lineLayer = {
  id: 'lines',
  type: 'line',
  paint: {
    'line-color': '#ff0000',
    'line-width': 2
  }
};
```

#### Fill Layers
```tsx
const fillLayer = {
  id: 'fills',
  type: 'fill',
  paint: {
    'fill-color': '#0080ff',
    'fill-opacity': 0.5
  }
};
```

### 2. Custom Layers

#### WebGL Custom Layer
```tsx
const customLayer = {
  id: 'custom-layer',
  type: 'custom',
  onAdd: function(map, gl) {
    // Initialize WebGL resources
  },
  render: function(gl, matrix) {
    // Custom rendering logic
  }
};
```

## Data Sources

### GeoJSON Source
```tsx
const geojsonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-74.5, 40]
      },
      properties: {
        title: 'Sample Point'
      }
    }
  ]
};

<Source id="geojson-data" type="geojson" data={geojsonData}>
  <Layer {...pointLayer} />
</Source>
```

### Vector Tile Source
```tsx
<Source
  id="vector-source"
  type="vector"
  url="mapbox://mapbox.mapbox-streets-v8"
>
  <Layer
    id="road-layer"
    source-layer="road"
    type="line"
    paint={{
      'line-color': '#888',
      'line-width': 1
    }}
  />
</Source>
```

## Performance Optimization

### 1. Clustering Large Datasets

```tsx
import Supercluster from 'supercluster';
import { useSupercluster } from 'use-supercluster';

function ClusteredMap({ points }) {
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 16 }
  });

  return (
    <Source id="clusters" type="geojson" data={{
      type: 'FeatureCollection',
      features: clusters
    }}>
      <Layer {...clusterLayer} />
      <Layer {...unclusteredPointLayer} />
    </Source>
  );
}
```

### 2. Data-Driven Styling

```tsx
const dataLayer = {
  id: 'data-driven',
  type: 'circle',
  paint: {
    'circle-radius': [
      'interpolate',
      ['linear'],
      ['get', 'magnitude'],
      1, 5,
      6, 20
    ],
    'circle-color': [
      'interpolate',
      ['linear'],
      ['get', 'magnitude'],
      1, '#ffffb2',
      6, '#fd8d3c',
      8, '#bd0026'
    ]
  }
};
```

### 3. Layer Filtering

```tsx
const filteredLayer = {
  id: 'filtered-data',
  type: 'circle',
  filter: [
    'all',
    ['>=', ['get', 'magnitude'], 3],
    ['<', ['get', 'magnitude'], 7]
  ]
};
```

## Event Handling

### Map Events
```tsx
function InteractiveMap() {
  const onMapClick = useCallback((event) => {
    const { lng, lat } = event.lngLat;
    console.log('Clicked at:', lng, lat);
  }, []);

  const onMapLoad = useCallback(() => {
    console.log('Map loaded');
  }, []);

  return (
    <Map
      onClick={onMapClick}
      onLoad={onMapLoad}
      // ... other props
    />
  );
}
```

### Layer Events
```tsx
const onLayerClick = useCallback((event) => {
  const feature = event.features[0];
  if (feature) {
    console.log('Feature clicked:', feature.properties);
  }
}, []);

<Layer
  {...layerConfig}
  onClick={onLayerClick}
/>
```

## Controls and UI Components

### Built-in Controls
```tsx
import {
  NavigationControl,
  ScaleControl,
  FullscreenControl,
  GeolocateControl
} from 'react-map-gl/maplibre';

<Map>
  <NavigationControl position="top-left" />
  <ScaleControl position="bottom-left" />
  <FullscreenControl position="top-right" />
  <GeolocateControl position="top-right" />
</Map>
```

### Custom Controls
```tsx
import { useControl } from 'react-map-gl/maplibre';

class CustomControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'maplibregl-ctrl';
    this._container.textContent = 'Custom';
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

function CustomControlComponent() {
  useControl(() => new CustomControl(), {
    position: 'top-left'
  });
  return null;
}
```

## Popups and Markers

### Popup Component
```tsx
import { Popup } from 'react-map-gl/maplibre';

function MapWithPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [popupInfo, setPopupInfo] = useState(null);

  return (
    <Map>
      {showPopup && (
        <Popup
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          onClose={() => setShowPopup(false)}
        >
          <div>Popup content</div>
        </Popup>
      )}
    </Map>
  );
}
```

### Marker Component
```tsx
import { Marker } from 'react-map-gl/maplibre';

<Map>
  <Marker longitude={-74.5} latitude={40}>
    <div className="marker">📍</div>
  </Marker>
</Map>
```

## Styling and Theming

### Runtime Style Changes
```tsx
const [mapStyle, setMapStyle] = useState('streets');

const styleUrl = useMemo(() => 
  `https://api.maptiler.com/maps/${mapStyle}/style.json?key=${API_KEY}`,
  [mapStyle]
);

<Map mapStyle={styleUrl} />
```

### Custom Style Modifications
```tsx
const onMapLoad = useCallback((event) => {
  const map = event.target;
  
  // Add custom layer
  map.addLayer({
    id: 'custom-layer',
    type: 'circle',
    source: 'custom-source',
    paint: {
      'circle-radius': 8,
      'circle-color': '#ff0000'
    }
  });
}, []);
```

## Error Handling

### Map Error Boundaries
```tsx
import { ErrorBoundary } from 'react-error-boundary';

function MapErrorFallback({ error }) {
  return (
    <div className="map-error">
      <h2>Map failed to load</h2>
      <p>{error.message}</p>
    </div>
  );
}

<ErrorBoundary FallbackComponent={MapErrorFallback}>
  <Map />
</ErrorBoundary>
```

### Loading States
```tsx
function MapContainer() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          Loading map...
        </div>
      )}
      <Map
        onLoad={() => setIsLoaded(true)}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </div>
  );
}
```

## Best Practices

### Performance
1. **Use clustering for large point datasets**
2. **Implement viewport-based data fetching**
3. **Optimize layer paint properties**
4. **Use appropriate zoom-level filtering**

### Accessibility
1. **Provide keyboard navigation**
2. **Add ARIA labels to controls**
3. **Ensure sufficient color contrast**
4. **Provide alternative data views**

### Mobile Optimization
1. **Test touch interactions**
2. **Optimize for different screen sizes**
3. **Consider performance on mobile devices**
4. **Implement appropriate gesture handling**

## Troubleshooting

### Common Issues

#### Map Not Displaying
- Check API key configuration
- Verify network connectivity
- Check browser console for errors
- Ensure CSS is imported

#### Performance Issues
- Reduce data complexity
- Implement clustering
- Optimize layer paint properties
- Use appropriate zoom-level filtering

#### Style Loading Errors
- Verify style URL format
- Check API key permissions
- Test with different styles
- Monitor network requests

### Debug Tools
- MapLibre GL JS debug mode
- Browser DevTools Network tab
- React DevTools for component state
- Performance profiling tools 