import { Headphones } from 'lucide-react'
import { memo, useCallback } from 'react'
import { Marker as ReactMapGLMarker } from 'react-map-gl'
import { rsc } from 'react-styled-classnames'

import IconCircle from '@/components/IconCircle'
import { CATEGORY_ID } from '@/lib/constants'
import { Category, Place } from '@/lib/types/entityTypes'

const StyledBadge = rsc.span`
  flex
  z-20
  flex-col
  absolute
  -top-2
  -right-2
  border-2
  border-white
  bg-error
  text-white
  rounded-full
  h-6
  w-6
  text-xs
  items-center
  pt-0.5
`

const AudioBadge = rsc.span`
  flex
  z-20
  items-center
  justify-center
  absolute
  -bottom-2
  -right-2
  border-2
  border-white
  bg-brand-primary
  text-white
  rounded-full
  h-6
  w-6
  text-xs
`

interface handleClusterClickProps {
  clusterId: number
  latitude: number
  longitude: number
}

interface MarkerProps {
  latitude: number
  longitude: number
  clusterId: number
  category: Category
  markerId?: Place['id']
  markerSize: number
  handleClusterClick?: ({ clusterId, latitude, longitude }: handleClusterClickProps) => void
  handleMarkerClick?: (id: Place['id']) => void
  pointCount?: number
  color?: string
  hasAudio?: boolean
}

const Marker = memo(
  ({
    latitude,
    longitude,
    markerId,
    clusterId,
    markerSize,
    handleClusterClick,
    handleMarkerClick,
    pointCount,
    category,
    color,
    hasAudio,
  }: MarkerProps) => {
    const handleClick = useCallback(() => {
      if (handleMarkerClick && markerId) {
        handleMarkerClick(markerId)
      }
      if (handleClusterClick) {
        handleClusterClick({ clusterId, latitude, longitude })
      }
    }, [clusterId, handleClusterClick, handleMarkerClick, latitude, longitude, markerId])

    // Check if soundscape category
    const isSoundscape = category.id === CATEGORY_ID.SOUNDSCAPE

    return (
      <ReactMapGLMarker latitude={latitude} longitude={longitude} onClick={handleClick}>
        <div className="origin-bottom">
          {pointCount && (
            <span
              style={{ backgroundColor: category.color }}
              className="absolute -inset-2 bg-mapBg rounded-full opacity-40"
            />
          )}
          <div className="relative z-20">
            <IconCircle
              size={markerSize}
              path={!isSoundscape && category.iconMedium ? `/${category.iconMedium}` : ''}
              color={color}
              bgColor={category.color}
              shadow
            />
          </div>
          {pointCount && <StyledBadge>{pointCount}</StyledBadge>}
          {hasAudio && (
            <AudioBadge>
              <Headphones size={14} />
            </AudioBadge>
          )}
        </div>
      </ReactMapGLMarker>
    )
  },
)

Marker.displayName = 'Marker'

export default Marker
