import Button from '@/components/Button'
import { AppConfig } from '@/lib/AppConfig'
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

  return (
    <Button
      key={category.id}
      className={`relative p-1 gap-2 md:p-2 w-full flex ${
        selectedCategory ? 'text-white' : ''
      } justify-start`}
      noGutter
      style={{ ...(!selectedCategory ? { color: category.color } : {}) }}
      onClick={() => handleClick(selected ? undefined : category.id)}
      noBorderRadius
    >
      <div
        className={`md:text-lg ${
          selectedCategory?.id === category.id ? 'underline' : ''
        } w-full pl-2`}
        style={{
          borderLeft: `4px solid ${
            selectedCategory?.id === category.id ? 'white' : category.color
          }`,
        }}
      >
        {category.name}
      </div>
    </Button>
  )
}

export default SidebarMenuItem
