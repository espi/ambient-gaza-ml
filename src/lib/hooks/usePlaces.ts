import { FitBoundsOptions, fitBounds } from '@math.gl/web-mercator'
import { useCallback, useMemo, useRef } from 'react'

import useCategories from '@/hooks/useCategories'
import useDetectScreen from '@/hooks/useDetectScreen'
// import { apiPlaces } from '@/lib/api/placesMock' // We don't need the original places anymore
import { CATEGORY_ID } from '@/lib/constants'
import { gazaPlaces } from '@/lib/placeData'
import { Place } from '@/lib/types/entityTypes'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

const limitPlacesLength = (arr: Place[], length: number) => {
  if (arr.length > length) {
    return arr.slice(0, length)
  }
  return arr
}

/** hook to use the places from a cached api request */
const usePlaces = () => {
  const selectedCategory = useMapStore(state => state.selectedCategory)
  const markersCount = useSettingsStore(state => state.markersCount)
  const { viewportWidth, viewportHeight } = useDetectScreen()
  const { categories } = useCategories()

  // Use only Gaza places instead of combining with API places
  const { current: rawPlaces } = useRef(gazaPlaces)

  /** returns places by id input */
  const getCatPlaces = useCallback(
    (id: CATEGORY_ID) => rawPlaces.filter(place => place.category === id),
    [rawPlaces],
  )

  /** this mostly internally used memo contains the limiter - remove it in your application on demand */
  const markerData = useMemo(
    () =>
      limitPlacesLength(
        !selectedCategory ? gazaPlaces : getCatPlaces(selectedCategory.id),
        markersCount,
      ),
    [getCatPlaces, markersCount, selectedCategory],
  )

  /** get unique category ids for all markers */
  const markerCategoryIDs = useMemo(
    () => (markerData ? [...new Set(markerData.map(x => x.category))] : undefined),
    [markerData],
  )

  /** returns category objects for all markers */
  const markerCategories = useMemo(
    () =>
      markerCategoryIDs
        ? markerCategoryIDs.map((key: CATEGORY_ID) => categories.find(cat => cat.id === key))
        : undefined,
    [categories, markerCategoryIDs],
  )

  /** returns places by selected category from store */
  const catPlaces = useMemo(
    () => markerData.filter(place => place.category === selectedCategory?.id),

    [selectedCategory, markerData],
  )

  /** record of places grouped by category ID */
  const placesGroupedByCategory = useMemo(() => {
    // Initialize an empty object to store the grouped places
    const group: Record<CATEGORY_ID, Place[]> = {} as Record<CATEGORY_ID, Place[]>

    // If no category is selected, use all places
    const displayPlaces = !selectedCategory ? rawPlaces : getCatPlaces(selectedCategory.id)

    // Group the places by category
    displayPlaces.forEach(place => {
      const { category } = place
      if (!group[category]) {
        group[category] = []
      }
      group[category].push(place)
    })

    return group
  }, [selectedCategory, rawPlaces, getCatPlaces])

  /** get place object by id input */
  const getPlaceById = useCallback(
    (id: Place['id']) => rawPlaces.find(place => place.id === id),
    [rawPlaces],
  )

  const getPlacesBounds = useCallback(
    (places: Place[], options?: FitBoundsOptions) => {
      // Enhanced validation to prevent @math.gl/web-mercator assertion errors
      if (!viewportWidth || !viewportHeight) return undefined

      // Additional validation for minimum viable viewport dimensions
      const minDimension = 50 // Minimum width/height for fitBounds to work properly
      if (viewportWidth < minDimension || viewportHeight < minDimension) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('Viewport too small for bounds calculation:', {
            viewportWidth,
            viewportHeight,
          })
        }
        return undefined
      }

      // Validate places array
      if (!places || places.length === 0) return undefined

      const lat = places.map(p => p.latitude)
      const lng = places.map(p => p.longitude)

      // Validate coordinates
      const validLat = lat.filter(l => !Number.isNaN(l) && Number.isFinite(l))
      const validLng = lng.filter(l => !Number.isNaN(l) && Number.isFinite(l))

      if (validLat.length === 0 || validLng.length === 0) return undefined

      const bounds: FitBoundsOptions['bounds'] = [
        [Math.min.apply(null, validLng), Math.min.apply(null, validLat)],
        [Math.max.apply(null, validLng), Math.max.apply(null, validLat)],
      ]

      // Additional bounds validation
      if (bounds[0][0] === Infinity || bounds[0][1] === Infinity) return undefined
      if (bounds[1][0] === -Infinity || bounds[1][1] === -Infinity) return undefined
      if (
        Number.isNaN(bounds[0][0]) ||
        Number.isNaN(bounds[0][1]) ||
        Number.isNaN(bounds[1][0]) ||
        Number.isNaN(bounds[1][1])
      )
        return undefined

      try {
        return fitBounds({
          bounds,
          width: viewportWidth,
          height: viewportHeight,
          padding: {
            bottom: 120,
            left: 60,
            right: 60,
            top: 180,
          },
          ...options,
        } as FitBoundsOptions)
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn('fitBounds calculation failed:', {
            error: error instanceof Error ? error.message : String(error),
            bounds,
            viewportWidth,
            viewportHeight,
          })
        }
        return undefined
      }
    },
    [viewportHeight, viewportWidth],
  )

  // calc bounds of all input markers
  const catPlacesBounds = useMemo(() => {
    if (!viewportWidth || !viewportHeight || !selectedCategory) return undefined

    return getPlacesBounds(catPlaces)
  }, [catPlaces, getPlacesBounds, selectedCategory, viewportHeight, viewportWidth])

  // calc bounds of all selected category markers
  const allPlacesBounds = useMemo(() => {
    if (!markerData) return undefined

    return getPlacesBounds(markerData)
  }, [markerData, getPlacesBounds])

  const currentBounds = useMemo(
    () => (selectedCategory ? catPlacesBounds : allPlacesBounds),

    [selectedCategory, catPlacesBounds, allPlacesBounds],
  )

  return {
    rawPlaces,
    markerData,
    catPlaces,
    markerCategoryIDs,
    markerCategories,
    allPlacesBounds,
    currentBounds,
    placesGroupedByCategory,
    getCatPlaces,
    getPlaceById,
  } as const
}

export default usePlaces
