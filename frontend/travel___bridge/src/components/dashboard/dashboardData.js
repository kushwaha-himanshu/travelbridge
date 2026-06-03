import imageHero from '../../assets/image-hero.png'
import featureImage from '../../assets/feature-page-image.png'
import aboutImage from '../../assets/about-img.png'
import langImage from '../../assets/lang-img2.png'

export const sidebarItems = [
  { label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard', active: true },
  { label: 'Text Translate', icon: 'Languages', path: '/text-translate' },
  { label: 'Voice Translate', icon: 'Mic', path: '/voice-translate' },
  { label: 'Camera Translate', icon: 'ScanSearch', path: '/camera-translate' },
  { label: 'Trip Planner', icon: 'Route' },
  { label: 'Phrasebook', icon: 'NotebookText' },
  { label: 'History', icon: 'History' },
  { label: 'Emergency', icon: 'ShieldAlert' },
  { label: 'Pricing', icon: 'BadgePercent' },
  { label: 'Settings', icon: 'Settings2' },
  // {label: 'Logout', icon: 'X' },
]

export const quickActions = [
  {
    title: 'Text Translate',
    description: 'Translate text in 100+ languages',
    icon: 'Languages',
    accent: 'from-blue-100 to-blue-50 text-blue-600',
  },
  {
    title: 'Voice Translate',
    description: 'Real-time voice conversations',
    icon: 'Mic',
    accent: 'from-emerald-100 to-emerald-50 text-emerald-600',
  },
  {
    title: 'Camera Translate',
    description: 'Translate signs, menus and more',
    icon: 'Camera',
    accent: 'from-violet-100 to-violet-50 text-violet-600',
  },
  {
    title: 'Emergency',
    description: 'Get help in critical situations',
    icon: 'ShieldAlert',
    accent: 'from-rose-100 to-rose-50 text-rose-600',
  },
]

export const translations = [
  { original: 'Where is the train station?', translation: 'English → Spanish', time: '2 mins ago' },
  { original: '¿Dónde está la parada de autobús?', translation: 'Spanish → English', time: '15 mins ago' },
  { original: 'How much does this cost?', translation: 'English → French', time: '1 hour ago' },
  { original: 'सबसे नजदीकी फार्मेसी कहां है?', translation: 'Hindi → English', time: '2 hours ago' },
  { original: 'これはいくらですか？', translation: 'Japanese → English', time: '3 hours ago' },
]

export const assistantPrompts = [
  'Best places to visit in Tokyo',
  '3 day itinerary for Paris',
  'Budget trip to Thailand',
  'Local food recommendations',
]

export const trips = [
  {
    name: 'Bali, Indonesia',
    dates: '12 - 18 May 2025',
    status: 'Upcoming',
    image: imageHero,
  },
  {
    name: 'Paris, France',
    dates: '20 - 25 Jun 2025',
    status: 'Saved',
    image: featureImage,
  },
]

export const offlinePacks = [
  { language: 'Spanish', size: '120 MB', flag: '🇪🇸' },
  { language: 'French', size: '110 MB', flag: '🇫🇷' },
  { language: 'Japanese', size: '130 MB', flag: '🇯🇵' },
]

export const heroArtwork = imageHero
export const aiArtwork = langImage
export const premiumArtwork = aboutImage