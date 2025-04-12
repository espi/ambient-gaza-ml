import useCategories from '@/hooks/useCategories'
import useAppTheme from '@/hooks/useTheme'
import useMapStore from '@/zustand/useMapStore'

interface CategoryColorBgProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  outerClassName?: string
}

const CategoryColorBg = ({ children, outerClassName }: CategoryColorBgProps) => {
  const selectedCategory = useMapStore(state => state.selectedCategory)
  const { getCategoryById } = useCategories()
  const { color } = useAppTheme()

  return (
    <div className={`${outerClassName ?? ''}`}>
      <div
        style={{
          backgroundColor: selectedCategory
            ? `${getCategoryById(selectedCategory.id)?.color}11` // Very subtle color with 11 hex opacity
            : color('mapBg'),
          boxShadow: selectedCategory ? 'inset 0 0 0 1px rgba(255,255,255,0.1)' : 'none',
        }}
        className="absolute inset-0 transition-all duration-300 ease-in-out"
      />
      {children}
    </div>
  )
}

export default CategoryColorBg
