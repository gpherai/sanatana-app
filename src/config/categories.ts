// Event categories configuration

export const EVENT_CATEGORIES = [
  {
    name: 'Ganesha',
    description: 'Events related to Lord Ganesha',
    icon: '🐘',
  },
  {
    name: 'Durga',
    description: 'Events related to Goddess Durga',
    icon: '⚔️',
  },
  {
    name: 'Shiva',
    description: 'Events related to Lord Shiva',
    icon: '🔱',
  },
  {
    name: 'Devi',
    description: 'Events related to Goddess/Devi',
    icon: '🪷',
  },
  {
    name: 'Krishna',
    description: 'Events related to Lord Krishna',
    icon: '🪈',
  },
  {
    name: 'Rama',
    description: 'Events related to Lord Rama',
    icon: '🏹',
  },
  {
    name: 'Hanuman',
    description: 'Events related to Lord Hanuman',
    icon: '🐵',
  },
  {
    name: 'General',
    description: 'General religious events',
    icon: '🕉️',
  },
] as const

export type CategoryName = (typeof EVENT_CATEGORIES)[number]['name']
