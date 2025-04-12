import { Headphones, Minimize2, X } from 'lucide-react'
import { Popup } from 'react-map-gl'

import Button from '@/components/Button'
import MobileAudioPlayer from '@/components/MobileAudioPlayer'
import useCategories from '@/hooks/useCategories'
import { AppConfig } from '@/lib/AppConfig'
import { CATEGORY_ID } from '@/lib/constants'
import { Place } from '@/lib/types/entityTypes'
import useMapStore from '@/zustand/useMapStore'

interface PopupItemProps {
  place: Place
  handleBackToCluster: () => void
}

const PopupItem = ({ place, handleBackToCluster }: PopupItemProps) => {
  const { getCategoryById } = useCategories()
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const currentCat = getCategoryById(place.category)

  if (!currentCat) return null

  // Format the audio description based on the place name or category
  const getAudioDescription = (): string => {
    // For soundscape category, use a specific description
    if (place.category === CATEGORY_ID.SOUNDSCAPE) {
      return 'Listen to Gaza soundscape'
    }

    // For other categories with specific places
    if (
      place.headline.includes('Beach') ||
      place.headline.includes('Mosque') ||
      place.headline.includes('University') ||
      place.headline.includes('Cemetery') ||
      place.headline.includes('Seaport') ||
      place.headline.includes('Home') ||
      place.headline.includes('Street') ||
      place.headline.includes('Deir al-Balah')
    ) {
      return 'Listen to Ahmed'
    }

    return 'Listen to ambient sounds from Gaza'
  }

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
      className="w-10/12"
      closeOnClick={false}
      closeButton={false}
      longitude={place.longitude}
      latitude={place.latitude}
      maxWidth="320px"
      anchor="top"
      offset={[0, -AppConfig.ui.markerIconSize] as never}
    >
      <div className="bg-mapBg text-dark shadow-md rounded-md p-2 -mt-3 relative">
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
                  <p className="text-sm font-medium text-dark/80 m-0">{getAudioDescription()}</p>
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
      </div>
    </Popup>
  )
}

export default PopupItem
