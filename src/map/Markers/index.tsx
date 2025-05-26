import { useCallback, useMemo } from 'react'

import useCategories from '@/hooks/useCategories'
import usePlaces from '@/hooks/usePlaces'
import { Place } from '@/lib/types/entityTypes'
import useMapActions from '@/map/useMapActions'
import useMapContext from '@/map/useMapContext'
import CategoryMarkerCluster from '@/src/map/Markers/CategoryMarkerCluster'
import useMapStore from '@/zustand/useMapStore'

const MarkersContainer = () => {
  const { placesGroupedByCategory } = usePlaces()
  const { map } = useMapContext()

  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const clusterRadius = useMapStore(state => state.clusterRadius)

  const { getPlaceById } = usePlaces()
  const { handleMapMove } = useMapActions()
  const { getCategoryById } = useCategories()

  const mapBounds = useMemo(() => (map ? map.getMap().getBounds().toArray().flat() : []), [map])

  const handleMarkerClick = useCallback(
    (id: Place['id']) => {
      const place = getPlaceById(id)
      if (!place || !map) return

      // Always reset the popup first, even if it's the same ID
      setMarkerPopup(undefined)

      // Use a small timeout to ensure the state is fully reset before initializing a new popup
      setTimeout(() => {
        setMarkerPopup(id)

        handleMapMove({
          latitude: place.latitude,
          longitude: place.longitude,
          zoom: map.getZoom(),
          offset: [0, -30],
        })
      }, 50)
    },
    [getPlaceById, handleMapMove, map, setMarkerPopup],
  )

  return (
    placesGroupedByCategory &&
    Object.entries(placesGroupedByCategory).map(catGroup => {
      const [category, places] = catGroup

      return (
        <CategoryMarkerCluster
          handleMapMove={handleMapMove}
          handleMarkerClick={handleMarkerClick}
          key={category}
          mapBounds={mapBounds}
          map={map}
          places={places}
          clusterRadius={clusterRadius}
          category={getCategoryById(parseFloat(category))}
        />
      )
    })
  )
}

export default MarkersContainer
