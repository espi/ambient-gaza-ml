import { rsc } from 'react-styled-classnames'

import Icon from '@/components/Icon'
import { AppConfig, NavVariant } from '@/lib/AppConfig'
import { ICON } from '@/theme/iconCollection'
import useMapStore from '@/zustand/useMapStore'

import NavItem from './NavItem'

interface StyledListProps {
  $variant: NavVariant
  $isSelectedCategory?: boolean
}

const StyledList = rsc.ul<StyledListProps>`
  flex
  h-full
  ${list => {
    const textColor = list.$isSelectedCategory ? `text-white` : `text-dark`

    return list.$variant === NavVariant.TOPNAV
      ? `gap-4 text-lg text-sm md:text-base items-center ${textColor}`
      : 'flex-col justify-between gap-1 w-fit text-primary'
  }}
`

interface NavProps {
  variant?: NavVariant
}

const Nav = ({ variant = NavVariant.INTRO }: NavProps) => {
  const selectedCategory = useMapStore(state => state.selectedCategory)

  return (
    <StyledList $variant={variant} $isSelectedCategory={!!selectedCategory}>
      <NavItem
        href="/"
        label="Ambient Gaza"
        icon={<Icon size={AppConfig.ui.barIconSize} icon={ICON.COMPASS} />}
      />
    </StyledList>
  )
}

export default Nav
