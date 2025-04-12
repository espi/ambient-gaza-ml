import useCategories from '@/hooks/useCategories'
import { AppConfig } from '@/lib/AppConfig'
import useMapStore from '@/zustand/useMapStore'

const CategoryDisplay = () => {
  const selectedCategory = useMapStore(state => state.selectedCategory)
  const { getCategoryById } = useCategories()

  if (!selectedCategory) return null

  const categoryColor = getCategoryById(selectedCategory.id)?.color

  return (
    <div className="relative">
      <div
        key={selectedCategory.id}
        className="absolute flex left-0 top-0 gap-1 md:gap-2 h-full items-center"
      >
        <span className="uppercase md:text-lg font-medium whitespace-nowrap flex items-center">
          <span
            className="inline-block w-2 h-2 md:w-3 md:h-3 rounded-full mr-2"
            style={{ backgroundColor: categoryColor }}
          />
          {selectedCategory.name}
        </span>
      </div>
    </div>
  )
}

export default CategoryDisplay
