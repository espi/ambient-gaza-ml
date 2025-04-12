import CategoryColorBg from '@/components/CategoryColorBg'
import CategoryDisplay from '@/components/TopBar/CategoryDisplay'
import { AppConfig } from '@/lib/AppConfig'
import useMapStore from '@/zustand/useMapStore'

import Logo from '../Logo'

const TopBar = () => {
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)

  return isMapGlLoaded ? (
    <div
      className="absolute left-0 top-0 w-full shadow-md"
      style={{ height: AppConfig.ui.barHeight }}
    >
      <CategoryColorBg className="absolute inset-0" />
      <div className="px-6 md:px-8 relative flex items-center justify-between h-full">
        <div className="flex items-center gap-8">
          <Logo />
          <div className="h-10 w-px bg-light/30 hidden md:block" />
          <CategoryDisplay />
        </div>
        {/* <Nav variant={NavVariant.TOPNAV} /> */}
      </div>
    </div>
  ) : null
}

export default TopBar
