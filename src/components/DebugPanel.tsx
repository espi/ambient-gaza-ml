import { useEffect, useState } from 'react'

import useCategories from '@/hooks/useCategories'
import usePlaces from '@/hooks/usePlaces'
import useMapContext from '@/map/useMapContext'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

const DebugPanel = () => {
  const { map } = useMapContext()
  const { placesGroupedByCategory, rawPlaces, markerData } = usePlaces()
  const { categories } = useCategories()
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)
  const throttledViewState = useMapStore(state => state.throttledViewState)
  const markerJSXRendering = useSettingsStore(state => state.markerJSXRendering)
  const clusterRadius = useMapStore(state => state.clusterRadius)
  const markersCount = useSettingsStore(state => state.markersCount)
  const [mapBounds, setMapBounds] = useState<number[]>([])

  useEffect(() => {
    if (map) {
      const updateBounds = () => {
        const bounds = map.getMap().getBounds().toArray().flat()
        setMapBounds(bounds)
      }

      map.on('move', updateBounds)
      updateBounds() // Initial bounds

      return () => {
        map.off('move', updateBounds)
      }
    }
    return undefined
  }, [map])

  const totalPlaces = rawPlaces?.length || 0
  const filteredPlaces = markerData?.length || 0
  const groupedCategories = placesGroupedByCategory
    ? Object.keys(placesGroupedByCategory).length
    : 0

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-sm text-sm">
      <h3 className="font-bold mb-2">🐛 Debug Panel</h3>
      <div className="text-xs text-gray-600 mb-2">
        Add <code>?debug=true</code> to URL to enable
      </div>

      <div className="space-y-1">
        <div>
          <strong>Map Loaded:</strong> {isMapGlLoaded ? '✅' : '❌'}
        </div>
        <div>
          <strong>Rendering Mode:</strong> {markerJSXRendering ? 'JSX' : 'WebGL'}
        </div>
        <div>
          <strong>Total Places:</strong> {totalPlaces}
        </div>
        <div>
          <strong>Filtered Places:</strong> {filteredPlaces}
        </div>
        <div>
          <strong>Categories:</strong> {groupedCategories}
        </div>
        <div>
          <strong>Cluster Radius:</strong> {clusterRadius}
        </div>
        <div>
          <strong>Markers Limit:</strong> {markersCount}
        </div>
      </div>

      <div className="mt-3">
        <strong>Current Viewport:</strong>
        {throttledViewState ? (
          <div className="text-xs">
            <div>Lat: {throttledViewState.latitude?.toFixed(4)}</div>
            <div>Lng: {throttledViewState.longitude?.toFixed(4)}</div>
            <div>Zoom: {throttledViewState.zoom?.toFixed(2)}</div>
          </div>
        ) : (
          <div>No viewport data</div>
        )}
      </div>

      <div className="mt-3">
        <strong>Map Bounds:</strong>
        {mapBounds.length === 4 ? (
          <div className="text-xs">
            <div>
              SW: [{mapBounds[0]?.toFixed(4)}, {mapBounds[1]?.toFixed(4)}]
            </div>
            <div>
              NE: [{mapBounds[2]?.toFixed(4)}, {mapBounds[3]?.toFixed(4)}]
            </div>
          </div>
        ) : (
          <div>No bounds data</div>
        )}
      </div>

      <div className="mt-3">
        <strong>Places by Category:</strong>
        {placesGroupedByCategory ? (
          <div className="text-xs">
            {Object.entries(placesGroupedByCategory).map(([catId, places]) => {
              const category = categories.find(cat => cat.id === parseInt(catId, 10))
              return (
                <div key={catId}>
                  {category?.name || `Cat ${catId}`}: {places.length}
                </div>
              )
            })}
          </div>
        ) : (
          <div>No grouped data</div>
        )}
      </div>

      <div className="mt-3">
        <strong>Sample Coordinates:</strong>
        {rawPlaces && rawPlaces.length > 0 ? (
          <div className="text-xs">
            {rawPlaces.slice(0, 3).map(place => (
              <div key={place.id}>
                {place.headline}: [{place.longitude.toFixed(4)}, {place.latitude.toFixed(4)}]
              </div>
            ))}
          </div>
        ) : (
          <div>No places data</div>
        )}
      </div>

      <div className="mt-3">
        <strong>All Coordinates:</strong>
        <div className="text-xs max-h-32 overflow-y-auto">
          {rawPlaces?.map(place => (
            <div key={place.id} className="text-xs">
              {place.id}: {place.headline} [{place.longitude.toFixed(4)},{' '}
              {place.latitude.toFixed(4)}]
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DebugPanel
