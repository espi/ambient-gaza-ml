import { Headphones, Minimize2, X } from 'lucide-react'
import { Popup } from 'react-map-gl'

import Button from '@/components/Button'
import MobileAudioPlayer from '@/components/MobileAudioPlayer'
import useCategories from '@/hooks/useCategories'
import { AppConfig } from '@/lib/AppConfig'
import { Place } from '@/lib/types/entityTypes'
import useMapStore from '@/zustand/useMapStore'

interface PopupItemProps {
  place: Place
  handleBackToCluster: () => void
  isHoverMode?: boolean
}

const PopupItem = ({ place, handleBackToCluster, isHoverMode = false }: PopupItemProps) => {
  const { getCategoryById } = useCategories()
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const currentCat = getCategoryById(place.category)

  if (!currentCat) return null

  // Convert the audio path to a fully qualified URL if needed
  const getAudioUrl = (audioFile: string): string => {
    // If it already starts with http/https or a slash, return as is
    if (audioFile.startsWith('http') || audioFile.startsWith('/')) {
      return audioFile
    }

    // Otherwise, prepend with a slash to ensure it's a root-relative URL
    return `/${audioFile}`
  }

  return (
    <Popup
      className={isHoverMode ? 'w-auto pointer-events-none' : 'w-10/12'}
      closeOnClick={false}
      closeButton={false}
      longitude={place.longitude}
      latitude={place.latitude}
      maxWidth={isHoverMode ? '280px' : '320px'}
      anchor={isHoverMode ? 'left' : 'top'}
      offset={
        isHoverMode
          ? ([AppConfig.ui.markerIconSize + 15, 0] as never)
          : ([0, -AppConfig.ui.markerIconSize] as never)
      }
    >
      <div
        className={`bg-mapBg text-dark shadow-md rounded-md -mt-3 relative transition-opacity duration-200 ${
          isHoverMode ? 'p-3 border border-gray-200' : 'p-2'
        }`}
      >
        {isHoverMode ? (
          // Simplified hover version
          <div className="text-center">
            <h3 className="text-base font-semibold leading-tight m-0 mb-1">{place.headline}</h3>

            {place.audioFile && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <Headphones size={14} className="text-brand-primary" />
                <p className="text-xs text-dark/70 m-0">
                  {place.audioDescription || 'Audio available'}
                </p>
              </div>
            )}

            <p className="text-xs text-dark/60 mt-2 m-0">Click to view details</p>
          </div>
        ) : (
          // Full click version
          <>
            <Button
              className="absolute right-0 top-2 text-dark inline-block"
              onClick={() => setMarkerPopup(undefined)}
              small
            >
              <X size={AppConfig.ui.mapIconSizeSmall} />
            </Button>
            <div className="flex flex-row justify-center pt-3">
              <div className="flex flex-col justify-center p-3 text-center w-full">
                <h3 className="text-lg font-bold leading-none m-0">{place.headline}</h3>

                {place.audioFile && (
                  <div className="mt-4 border-t border-light/30 pt-3">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Headphones size={16} className="text-brand-primary" />
                      <p className="text-sm font-medium text-dark/80 m-0">
                        {place.audioDescription || 'Audio available'}
                      </p>
                    </div>
                    {typeof place.audioFile === 'string' && place.audioFile.trim() !== '' ? (
                      <MobileAudioPlayer audioSrc={getAudioUrl(place.audioFile)} />
                    ) : (
                      <div className="text-sm text-red-500">Audio file not available</div>
                    )}
                  </div>
                )}

                <div className="flex flex-row justify-between gap-2 mt-6">
                  <Button
                    className="bg-warning text-white gap-2"
                    onClick={() => handleBackToCluster()}
                    small
                  >
                    <Minimize2 size={AppConfig.ui.mapIconSizeSmall} />
                    Minimize
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Popup>
  )
}

export default PopupItem
