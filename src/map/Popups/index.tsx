import { useCallback, useEffect, useState } from 'react'

import usePlaces from '@/hooks/usePlaces'
import { Place } from '@/lib/types/entityTypes'
import PopupItem from '@/src/map/Popups/PopupItem'
import useMapActions from '@/src/map/useMapActions'
import useMapStore from '@/zustand/useMapStore'

const PopupsContainer = () => {
  const markerPopup = useMapStore(state => state.markerPopup)
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const { getPlaceById } = usePlaces()
  const { currentBounds } = usePlaces()
  const { handleMapMove } = useMapActions()
  const [currentPlace, setCurrentPlace] = useState<Place | undefined>(undefined)

  // Update the current place when markerPopup changes
  useEffect(() => {
    if (markerPopup) {
      const place = getPlaceById(markerPopup)
      setCurrentPlace(place)
    } else {
      setCurrentPlace(undefined)
    }
  }, [markerPopup, getPlaceById])

  const handleBackToCluster = useCallback(() => {
    setMarkerPopup(undefined)

    if (!currentBounds) return

    handleMapMove({
      latitude: currentBounds.latitude,
      longitude: currentBounds.longitude,
      zoom: currentBounds.zoom,
      fly: false,
    })
  }, [currentBounds, handleMapMove, setMarkerPopup])

  return (
    <>
      {markerPopup && <div className="bg-dark opacity-30 absolute inset-0 pointer-events-none" />}
      {currentPlace && (
        <PopupItem
          key={`popup-${markerPopup}`}
          handleBackToCluster={handleBackToCluster}
          place={currentPlace}
        />
      )}
    </>
  )
}

export default PopupsContainer
