import { AppConfig } from '@/lib/AppConfig'
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
          <span className="uppercase md:text-xl font-bold whitespace-nowrap border-l-4 border-white pl-2">
            {selectedCategory.name}
          </span>
        </div>
      )}
    </div>
  )
}

export default CategoryDisplay
