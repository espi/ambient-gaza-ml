import { throttle } from 'lodash'
import dynamic from 'next/dynamic'
import { useCallback, useMemo } from 'react'
import type { ErrorEvent, ViewState, ViewStateChangeEvent } from 'react-map-gl'
import Map from 'react-map-gl'

import useDetectScreen from '@/hooks/useDetectScreen'
import usePlaces from '@/hooks/usePlaces'
import { AppConfig } from '@/lib/AppConfig'
import MapContextProvider from '@/src/map/MapContextProvider'
import MapControls from '@/src/map/MapControls'
import useMapActions from '@/src/map/useMapActions'
import useMapContext from '@/src/map/useMapContext'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

/** error handle */
const onMapError = (evt: ErrorEvent) => {
  const { error } = evt
  throw new Error(`Map error: ${error.message}`)
}

// bundle splitting
const Popups = dynamic(() => import('@/src/map/Popups'))
const Markers = dynamic(() => import('@/src/map/Markers'))
const Layers = dynamic(() => import('@/src/map/Layers'))
const Sidebar = dynamic(() => import('@/components/Sidebar'))
const SettingsBox = dynamic(() => import('@/components/SettingsBox'))
const TopBar = dynamic(() => import('@/components/TopBar'))

// Gaza Strip coordinates and zoom level
const GAZA_COORDINATES = {
  latitude: 31.58, // Center point between Gaza City and Deir al-Balah
  longitude: 34.4,
  zoom: 10.0, // Slightly zoomed out to see more locations
}

const MapInner = () => {
  const setViewState = useMapStore(state => state.setViewState)
  const setThrottledViewState = useMapStore(state => state.setThrottledViewState)
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)
  const markerJSXRendering = useSettingsStore(state => state.markerJSXRendering)
  const setIsMapGlLoaded = useMapStore(state => state.setIsMapGlLoaded)
  const { setMap, map } = useMapContext()
  const { viewportWidth, viewportHeight, viewportRef } = useDetectScreen()
  usePlaces()

  const { handleMapMove } = useMapActions()

  const throttledSetViewState = useMemo(
    () => throttle((state: ViewState) => setThrottledViewState(state), 50),
    [setThrottledViewState],
  )

  const onLoad = useCallback(() => {
    if (!isMapGlLoaded) {
      setIsMapGlLoaded(true)
      // Focus on Gaza when the map loads
      if (map) {
        handleMapMove(GAZA_COORDINATES)
      }
    }
  }, [isMapGlLoaded, setIsMapGlLoaded, map, handleMapMove])

  const onMapMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      throttledSetViewState(evt.viewState)
      setViewState(evt.viewState)
    },
    [setViewState, throttledSetViewState],
  )

  return (
    <div className="absolute overflow-hidden inset-0 bg-mapBg" ref={viewportRef}>
      {/*
        Use Gaza coordinates as the initial view state instead of the allPlacesBounds
        This ensures the map centers on Gaza when it first loads
      */}
      <Map
        initialViewState={GAZA_COORDINATES}
        ref={e => setMap && setMap(e || undefined)}
        onError={e => onMapError(e)}
        onLoad={onLoad}
        onMove={onMapMove}
        style={{ width: viewportWidth, height: viewportHeight }}
        mapStyle={`https://api.maptiler.com/maps/basic-v2/style.json?key=${AppConfig.map.tileKey}`}
        reuseMaps
        // disable map rotation since it's not correctly calculated into the bounds atm :')
        dragRotate={false}
      >
        <Popups />
        {markerJSXRendering ? <Markers /> : <Layers />}
        <MapControls />
        <SettingsBox />
        <Sidebar />
        <TopBar />
      </Map>
      {!isMapGlLoaded && (
        <div className="absolute inset-0 bg-mapBg flex justify-center items-center">
          Loading Map...
        </div>
      )}
    </div>
  )
}

// context pass through
const MapContainer = () => (
  <MapContextProvider>
    <MapInner />
  </MapContextProvider>
)

export default MapContainer
