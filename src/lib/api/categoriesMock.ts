import { CATEGORY_ID } from '@/lib/constants'
import { Category } from '@/lib/types/entityTypes'

const apiCategories: Category[] = [
  {
    id: CATEGORY_ID.SPOKEN_WORD,
    name: 'Spoken Word',
    color: '#E07A5F',
    iconPathSVG: '',
    iconSmall: '',
    iconMedium: '',
  },
  {
    id: CATEGORY_ID.SOUNDSCAPES,
    name: 'Music and Soundscapes',
    color: '#6A7B82',
    iconPathSVG: '',
    iconSmall: '',
    iconMedium: '',
  },
]

export default apiCategories
