import { CATEGORY_ID } from '@/lib/constants'
import { Place } from '@/lib/types/entityTypes'

/**
 * Gaza locations with ambient audio
 */
export const gazaPlaces: Place[] = [
  {
    id: 1000001,
    headline: 'Rashid Street',
    latitude: 31.52112337347405,
    longitude: 34.43139435582181,
    category: CATEGORY_ID.SPOKEN_WORD,
    audioFile: '/audio/gaza_rashid_street_ambient.mp3',
    audioDescription:
      "If we were in a different world, in a different era or a different time this would be one of the most visited places in the Middle East because it's very beautiful.",
  },
  {
    id: 1000002,
    headline: 'Al-Azhar University',
    latitude: 31.51461142566115,
    longitude: 34.440482323391706,
    category: CATEGORY_ID.SPOKEN_WORD,
    audioFile: '/audio/gaza_university_ambient.mp3',
    audioDescription:
      "The university is not where I learned English actually, it's where I continued my passion for literature and eductation.",
  },
  {
    id: 1000003,
    headline: 'Gaza Beach',
    latitude: 31.51922550317379,
    longitude: 34.427382084657445,
    category: CATEGORY_ID.SPOKEN_WORD,
    audioFile: '/audio/gaza_beach_ambient.mp3',
    audioDescription:
      "Sandy beaches, very beautiful, it's also home... now as I long for home I have nostalgia",
  },
  {
    id: 1000004,
    headline: 'Deir Al-Balah-City Cemetery',
    latitude: 31.416383489987656,
    longitude: 34.352655485865704,
    category: CATEGORY_ID.SPOKEN_WORD,
    audioFile: '/audio/gaza_cemetery_ambient.mp3',
    audioDescription:
      "That's where my family is buried right now. My mother, my brother... When I left Gaza 5 years ago only a third was occupied, now all of it is occupied.",
  },
  {
    id: 1000005,
    headline: 'Deir Al-Balah-City Mosque',
    latitude: 31.416983082463727,
    longitude: 34.352109079864825,
    category: CATEGORY_ID.SPOKEN_WORD,
    audioFile: '/audio/gaza_mosque_ambient.mp3',
    audioDescription: "It's the oldest mosque in the city.",
  },
  {
    id: 1000006,
    headline: 'Deir Al-Balah-City',
    latitude: 31.4167,
    longitude: 34.3526,
    category: CATEGORY_ID.SPOKEN_WORD,
    audioFile: '/audio/gaza_deir_al_balah_ambient.mp3',
    audioDescription:
      "They call us the chicken, because the chicken goes to bed very early... now my wife is laughing at me because she is not from Deir Al-Balah, she's from Gaza city :)",
  },
  {
    id: 1000007,
    headline: "Ahmed's House",
    latitude: 31.415679,
    longitude: 34.348473,
    category: CATEGORY_ID.SPOKEN_WORD,
    audioFile: '/audio/gaza_house_ambient.mp3',
    audioDescription:
      'We always eat together, no-one is allowed to eat alone. Even when we were kids, all of us would have dinner, lunch and breakfast together... Our bonds were very very strong.',
  },
  {
    id: 1000008,
    headline: 'Gaza Seaport',
    latitude: 31.5248136354735,
    longitude: 34.42822272883563,
    category: CATEGORY_ID.SPOKEN_WORD,
    audioFile: '/audio/gaza_seaport_ambient.mp3',
    audioDescription:
      "We'd go there and look at the horizon, see the infinity of the sea... it would remind us that we were free.",
  },

  // /////////////// SOUNDSCAPES ///////////////////////

  {
    id: 2000001,
    headline: 'Olive Harvest',
    latitude: 31.516456387179815,
    longitude: 34.51580727116436,
    category: CATEGORY_ID.SOUNDSCAPES,
    audioFile: '/audio/soundscape/1-olive-harvest.mp3',
    audioDescription: '',
  },
  {
    id: 2000002,
    headline: 'Streets',
    latitude: 31.51526095158495,
    longitude: 34.450082084657446,
    category: CATEGORY_ID.SOUNDSCAPES,
    audioFile: '/audio/soundscape/2-streets---gaza-city.mp3',
    audioDescription: '',
  },
  {
    id: 2000003,
    headline: 'Playground',
    latitude: 31.508391940483044,
    longitude: 34.47126818650692,
    category: CATEGORY_ID.SOUNDSCAPES,
    audioFile: '/audio/soundscape/3-playground---gaza-city.mp3',
    audioDescription: '',
  },
  {
    id: 2000004,
    headline: 'Beach',
    latitude: 31.51453936774826,
    longitude: 34.42281445767127,
    category: CATEGORY_ID.SOUNDSCAPES,
    audioFile: '/audio/soundscape/4-beach---gaza.mp3',
    audioDescription: '',
  },
  {
    id: 2000005,
    headline: 'Graduation',
    latitude: 31.512269846188218,
    longitude: 34.45167661878343,
    category: CATEGORY_ID.SOUNDSCAPES,
    audioFile: '/audio/soundscape/5-graduation---university-of-gaza.mp3',
    audioDescription: '',
  },
  {
    id: 2000006,
    headline: 'Date Harvest',
    latitude: 31.409286977465626,
    longitude: 34.37807518650691,
    category: CATEGORY_ID.SOUNDSCAPES,
    audioFile: '/audio/soundscape/6-date-harvest---deir-al-balah.mp3',
    audioDescription: '',
  },
  {
    id: 2000007,
    headline: 'Fish Market',
    latitude: 31.52448649081254,
    longitude: 34.43204272883564,
    category: CATEGORY_ID.SOUNDSCAPES,
    audioFile: '/audio/soundscape/7-fish-market---gaza-sea-port.mp3',
    audioDescription: '',
  },
]
