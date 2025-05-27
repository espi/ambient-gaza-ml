import { Share } from 'lucide-react'
import { useState } from 'react'

import CategoryColorBg from '@/components/CategoryColorBg'
import IframeHelper from '@/components/IframeHelper'
import CategoryDisplay from '@/components/TopBar/CategoryDisplay'
import { AppConfig } from '@/lib/AppConfig'
import useMapStore from '@/zustand/useMapStore'

import Logo from '../Logo'

const TopBar = () => {
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)
  const throttledViewState = useMapStore(state => state.throttledViewState)
  const selectedCategory = useMapStore(state => state.selectedCategory)
  const [showIframeHelper, setShowIframeHelper] = useState(false)

  return isMapGlLoaded ? (
    <div
      className="absolute left-0 top-0 w-full shadow-md"
      style={{ height: AppConfig.ui.barHeight }}
    >
      <CategoryColorBg className="absolute inset-0" />
      <div className="px-4 sm:px-6 md:px-8 relative flex items-center justify-between h-full">
        <div className="flex items-center gap-4 md:gap-8">
          <Logo />
          <div className="h-10 w-px bg-light/20 hidden md:block" />
          <CategoryDisplay />
        </div>

        {!selectedCategory && (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowIframeHelper(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-dark/80 text-sm font-medium"
              title="Embed this map"
            >
              <Share size={16} />
              <span className="hidden sm:inline">Embed</span>
            </button>

            <div className="text-right">
              <span className="inline-flex items-center gap-2 uppercase text-dark/80 font-medium">
                <div className="text-sm md:text-base overflow-visible w-[110px] md:w-auto">
                  <p className="leading-none truncate">
                    {throttledViewState?.latitude?.toFixed(4)}
                  </p>
                  <p className="leading-none truncate">
                    {throttledViewState?.longitude?.toFixed(4)}
                  </p>
                </div>
              </span>
            </div>
          </div>
        )}
      </div>

      <IframeHelper
        viewState={throttledViewState}
        isOpen={showIframeHelper}
        onClose={() => setShowIframeHelper(false)}
      />
    </div>
  ) : null
}

export default TopBar
