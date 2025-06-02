import { useEffect, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import useMapStore from '@/zustand/useMapStore'

const useDetectScreen = () => {
  const setViewportWidth = useMapStore(state => state.setViewportWidth)
  const setViewportHeight = useMapStore(state => state.setViewportHeight)
  const viewportWidth = useMapStore(state => state.viewportWidth)
  const viewportHeight = useMapStore(state => state.viewportHeight)

  // Track if we're in a transition state to provide more stable dimensions
  const [isTransitioning, setIsTransitioning] = useState(false)

  const {
    width,
    height,
    ref: viewportRef,
  } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 400,
  })

  // Helper function to validate and sanitize dimensions
  const validateDimension = (dimension: number | undefined, fallback: number): number => {
    if (!dimension || !Number.isFinite(dimension) || dimension < 1) {
      return fallback
    }
    return Math.max(dimension, 50) // Ensure minimum viable dimension
  }

  useEffect(() => {
    if (width && viewportRef.current) {
      const validWidth = validateDimension(width, window.innerWidth || 1024)
      setViewportWidth(validWidth)
    } else if (typeof window !== 'undefined' && !width) {
      // Fallback to window dimensions if resize detector fails
      const fallbackWidth = validateDimension(window.innerWidth, 1024)
      setViewportWidth(fallbackWidth)
    }
  }, [width, viewportRef, setViewportWidth])

  useEffect(() => {
    if (height && viewportRef.current) {
      const validHeight = validateDimension(height, window.innerHeight || 768)
      setViewportHeight(validHeight)
    } else if (typeof window !== 'undefined' && !height) {
      // Fallback to window dimensions if resize detector fails
      const fallbackHeight = validateDimension(window.innerHeight, 768)
      setViewportHeight(fallbackHeight)
    }
  }, [height, setViewportHeight, viewportRef])

  // Initialize with window dimensions on mount if available
  useEffect(() => {
    if (typeof window !== 'undefined' && (!viewportWidth || !viewportHeight)) {
      const initialWidth = validateDimension(window.innerWidth, 1024)
      const initialHeight = validateDimension(window.innerHeight, 768)

      if (!viewportWidth) setViewportWidth(initialWidth)
      if (!viewportHeight) setViewportHeight(initialHeight)
    }
  }, [viewportWidth, viewportHeight, setViewportWidth, setViewportHeight])

  // Handle resize events with transition detection
  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    let resizeTimeout: NodeJS.Timeout

    const handleResize = () => {
      setIsTransitioning(true)

      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        setIsTransitioning(false)

        // Ensure dimensions are valid after transition
        const currentWidth = validateDimension(window.innerWidth, 1024)
        const currentHeight = validateDimension(window.innerHeight, 768)

        setViewportWidth(currentWidth)
        setViewportHeight(currentHeight)
      }, 500) // Wait for transition to complete
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(resizeTimeout)
    }
  }, [setViewportWidth, setViewportHeight])

  // Provide stable fallback dimensions during transitions
  const stableWidth = validateDimension(
    viewportWidth,
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  )
  const stableHeight = validateDimension(
    viewportHeight,
    typeof window !== 'undefined' ? window.innerHeight : 768,
  )

  return {
    viewportRef,
    viewportWidth: stableWidth,
    viewportHeight: stableHeight,
    isTransitioning,
  } as const
}

export default useDetectScreen
