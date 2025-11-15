/**
 * Event Categories Configuration
 * Default categories for Sanatana Dharma events
 */

export interface CategoryConfig {
  name: string
  description: string
  color: string
  icon: string
  defaultEventType: string
}

export const DEFAULT_CATEGORIES: CategoryConfig[] = [
  {
    name: 'Major Festivals',
    description: 'Major Hindu festivals celebrated throughout the year',
    color: 'red',
    icon: '🎉',
    defaultEventType: 'FESTIVAL'
  },
  {
    name: 'Ekadashi',
    description: 'The 11th day of each lunar fortnight, sacred to Lord Vishnu',
    color: 'blue',
    icon: '🌙',
    defaultEventType: 'VRAT'
  },
  {
    name: 'Purnima',
    description: 'Full moon days, auspicious for worship and meditation',
    color: 'yellow',
    icon: '🌕',
    defaultEventType: 'OBSERVANCE'
  },
  {
    name: 'Amavasya',
    description: 'New moon days, time for ancestor worship',
    color: 'indigo',
    icon: '🌑',
    defaultEventType: 'OBSERVANCE'
  },
  {
    name: 'Deity Days',
    description: 'Days dedicated to specific deities',
    color: 'purple',
    icon: '🕉️',
    defaultEventType: 'DEITY'
  },
  {
    name: 'Navaratri',
    description: 'Nine nights celebrating the Divine Mother',
    color: 'pink',
    icon: '🙏',
    defaultEventType: 'FESTIVAL'
  },
  {
    name: 'Solar Events',
    description: 'Solstices, equinoxes, and solar transitions',
    color: 'orange',
    icon: '☀️',
    defaultEventType: 'AUSPICIOUS'
  },
  {
    name: 'Sankranti',
    description: 'Solar month transitions',
    color: 'amber',
    icon: '🌅',
    defaultEventType: 'AUSPICIOUS'
  },
  {
    name: 'Vrats',
    description: 'Fasting days and spiritual observances',
    color: 'teal',
    icon: '🌙',
    defaultEventType: 'VRAT'
  },
  {
    name: 'Regional Festivals',
    description: 'Festivals specific to regions and communities',
    color: 'green',
    icon: '🎊',
    defaultEventType: 'FESTIVAL'
  }
]
