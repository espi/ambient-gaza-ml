import dynamicImport from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import type { ViewState } from 'react-map-gl'

import { GAZA_COORDINATES } from '@/src/map/MapCore'

// Dynamic import of the embed-specific map container
const EmbedMapContainer = dynamicImport(() => import('@/src/map/EmbedMapContainer'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-mapBg flex justify-center items-center">
      <div className="text-white">Loading Map...</div>
    </div>
  ),
})

// Force static generation
export const dynamic = 'force-static'

const EmbedPage = () => {
  const router = useRouter()
  const { lng, lat, z } = router.query

  // Debug logging for mobile issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isProduction = process.env.NODE_ENV === 'production'

      if (!isProduction) {
        // eslint-disable-next-line no-console
        console.log('📱 Embed page loaded:', {
          width: window.innerWidth,
          height: window.innerHeight,
          userAgent: navigator.userAgent,
          params: { lng, lat, z },
          viewport: {
            devicePixelRatio: window.devicePixelRatio,
            // eslint-disable-next-line no-restricted-globals
            orientation: screen.orientation?.type || 'unknown',
          },
        })
      }

      // Fix for iOS Safari iframe issues
      const handleTouchStart = (e: TouchEvent) => {
        // Prevent default behavior that might interfere with map interaction
        if (e.target && (e.target as Element).closest('.maplibregl-canvas')) {
          e.stopPropagation()
        }
      }

      document.addEventListener('touchstart', handleTouchStart, { passive: true })

      return () => {
        document.removeEventListener('touchstart', handleTouchStart)
      }
    }

    return undefined
  }, [lng, lat, z])

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
        {/* Enhanced mobile viewport */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
        />
        {/* iOS Safari specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />

        <style>{`
          /* Reset and base styles for iframe */
          * {
            box-sizing: border-box;
          }
          
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #1a1a1a;
            /* Prevent iOS bounce/zoom */
            position: fixed;
            -webkit-overflow-scrolling: touch;
          }
          
          #__next {
            width: 100%;
            height: 100%;
            position: relative;
          }
          
          /* Mobile-specific fixes */
          @media screen and (max-width: 768px) {
            html, body {
              /* Force mobile browsers to use available space */
              height: 100vh !important;
              height: -webkit-fill-available !important;
            }
            
            /* Prevent zooming on input focus (iOS Safari) */
            input, select, textarea {
              font-size: 16px !important;
            }
          }
          
          /* iOS Safari specific fixes */
          @supports (-webkit-touch-callout: none) {
            html, body {
              /* Fix height issues on iOS Safari */
              height: -webkit-fill-available;
            }
          }
          
          /* Map container mobile fixes */
          .maplibregl-map {
            /* Improve touch handling on mobile */
            touch-action: pan-x pan-y;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          /* Iframe-specific optimizations */
          .embed-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #1a1a1a;
          }
        `}</style>
      </Head>

      <div className="embed-container">
        <EmbedMapContainer initialViewState={initialViewState} />
      </div>
    </>
  )
}

// Remove getStaticProps to avoid SSR issues with map components
// The page will be client-side rendered only

export default EmbedPage
