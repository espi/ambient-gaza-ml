import { CATEGORY_ID } from '@/lib/constants'
import { Category } from '@/lib/types/entityTypes'

const apiCategories: Category[] = [
  {
    id: CATEGORY_ID.CAT1,
    name: 'Ahmed',
    iconPathSVG: '',
    iconSmall: '',
    iconMedium: '',
    color: '#E07A5F', // Warm terracotta
  },
  {
    id: CATEGORY_ID.CAT2,
    name: 'Category Two',
    iconPathSVG: 'icons/cassette-tape.svg',
    iconSmall: 'icons/cassette-tape-sm.png',
    iconMedium: 'icons/cassette-tape-md.png',
    color: '#3D5A80', // Muted blue-slate
  },
  {
    id: CATEGORY_ID.CAT3,
    name: 'Category Three',
    iconPathSVG: 'icons/pocket-knife.svg',
    iconSmall: 'icons/pocket-knife-sm.png',
    iconMedium: 'icons/pocket-knife-md.png',
    color: '#81B29A', // Sage green
  },
  {
    id: CATEGORY_ID.CAT4,
    name: 'Category Four',
    iconPathSVG: 'icons/package-plus.svg',
    iconSmall: 'icons/package-plus-sm.png',
    iconMedium: 'icons/package-plus-md.png',
    color: '#F2CC8F', // Muted gold
  },
  {
    id: CATEGORY_ID.SOUNDSCAPE,
    name: 'Soundscapes',
    iconPathSVG: 'icons/cassette-tape.svg',
    iconSmall: 'icons/cassette-tape-sm.png',
    iconMedium: 'icons/cassette-tape-md.png',
    color: '#6A7B82', // Slate blue-gray
  },
]

export default apiCategories
