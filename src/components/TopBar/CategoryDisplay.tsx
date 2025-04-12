import Icon from '@/components/Icon'
import IconCircle from '@/components/IconCircle'
import { AppConfig } from '@/lib/AppConfig'
import { ICON } from '@/theme/iconCollection'
import useMapStore from '@/zustand/useMapStore'

const CategoryDisplay = () => {
  const selectedCategory = useMapStore(state => state.selectedCategory)

  return (
    <div className="relative">
      {selectedCategory && (
        <div
          key={selectedCategory.id}
          className="absolute flex left-0 top-0 gap-1 md:gap-2 text-white h-full items-center"
        >
          <IconCircle path={selectedCategory.iconPathSVG} size={AppConfig.ui.markerIconSize} />
          <span className="uppercase md:text-xl font-bold whitespace-nowrap ">
            {selectedCategory.name}
          </span>
        </div>
      )}
    </div>
  )
}

export default CategoryDisplay
