import dynamicImport from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import type { ViewState } from 'react-map-gl'

import { GAZA_COORDINATES } from '@/src/map/MapCore'

// Dynamic import of the embed-specific map container
const EmbedMapContainer = dynamicImport(() => import('@/src/map/EmbedMapContainer'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-mapBg flex justify-center items-center">Loading Map...</div>
  ),
})

// Force static generation
export const dynamic = 'force-static'

const EmbedPage = () => {
  const router = useRouter()
  const { lng, lat, z } = router.query

  // Parse and validate query parameters
  const initialViewState: ViewState = useMemo(() => {
    const longitude = lng ? parseFloat(lng as string) : GAZA_COORDINATES.longitude
    const latitude = lat ? parseFloat(lat as string) : GAZA_COORDINATES.latitude
    const zoom = z ? parseFloat(z as string) : GAZA_COORDINATES.zoom

    // Validate coordinates are within reasonable bounds
    const validLongitude =
      Number.isNaN(longitude) || longitude < -180 || longitude > 180
        ? GAZA_COORDINATES.longitude
        : longitude

    const validLatitude =
      Number.isNaN(latitude) || latitude < -90 || latitude > 90
        ? GAZA_COORDINATES.latitude
        : latitude

    const validZoom = Number.isNaN(zoom) || zoom < 0 || zoom > 22 ? GAZA_COORDINATES.zoom : zoom

    return {
      longitude: validLongitude,
      latitude: validLatitude,
      zoom: validZoom,
      bearing: 0,
      pitch: 0,
      padding: { top: 0, bottom: 0, left: 0, right: 0 },
    }
  }, [lng, lat, z])

  return (
    <>
      <Head>
        <title>Ambient Gaza - Map Embed</title>
        <meta name="description" content="Interactive map of Gaza locations" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <EmbedMapContainer initialViewState={initialViewState} />
    </>
  )
}

// Remove getStaticProps to avoid SSR issues with map components
// The page will be client-side rendered only

export default EmbedPage
