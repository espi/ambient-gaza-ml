import Button from '@/components/Button'
import { CATEGORY_ID } from '@/lib/constants'
import { Category } from '@/lib/types/entityTypes'
import useMapStore from '@/zustand/useMapStore'

interface SidebarMenuItemProps {
  handleClick: (categoryId?: CATEGORY_ID) => void
  selected: boolean
  category: Category
}

const SidebarMenuItem = ({ handleClick, selected, category }: SidebarMenuItemProps) => {
  const selectedCategory = useMapStore(state => state.selectedCategory)
  const isSelected = selectedCategory?.id === category.id

  return (
    <Button
      key={category.id}
      className="relative p-1 gap-2 md:p-2 w-full flex justify-start transition-all duration-200"
      noGutter
      style={{
        color: category.color,
        backgroundColor: isSelected ? `${category.color}22` : 'transparent',
      }}
      onClick={() => handleClick(selected ? undefined : category.id)}
      noBorderRadius
    >
      <div
        className="md:text-lg w-full pl-2 py-1 transition-all duration-200"
        style={{
          borderLeft: `3px solid ${category.color}`,
          opacity: isSelected ? 1 : 0.8,
          fontWeight: isSelected ? 600 : 400,
        }}
      >
        {category.name}
      </div>
    </Button>
  )
}

export default SidebarMenuItem
