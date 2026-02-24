import {
  Link, FileText, Wifi, Mail, Phone, MessageSquare,
  User, Calendar,
  MessageCircle, Instagram, Facebook, Twitter, Linkedin, Music, Ghost,
  Bitcoin, CreditCard, Wallet,
  Youtube, Music2, Apple, Play, Package, Map, MapPin,
  type LucideIcon
} from 'lucide-react'

export type QRType = 
  | 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' 
  | 'vcard' | 'event' 
  | 'whatsapp' | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'snapchat'
  | 'bitcoin' | 'paypal' | 'venmo' 
  | 'youtube' | 'spotify' | 'appstore' | 'googleplay' | 'amazon' | 'googlemaps' | 'applemaps'

export interface QRTypeOption {
  id: QRType
  label: string
  icon: LucideIcon
  category: 'core' | 'social' | 'payment' | 'platform' | 'business'
  placeholder: string
}

export const qrTypes: QRTypeOption[] = [
  { id: 'url', label: 'URL', icon: Link, category: 'core', placeholder: 'https://yoursite.com' },
  { id: 'text', label: 'Text', icon: FileText, category: 'core', placeholder: 'Your message here' },
  { id: 'wifi', label: 'WiFi', icon: Wifi, category: 'core', placeholder: 'Network credentials' },
  { id: 'email', label: 'Email', icon: Mail, category: 'core', placeholder: 'email@example.com' },
  { id: 'phone', label: 'Phone', icon: Phone, category: 'core', placeholder: '+1 555 123 4567' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, category: 'core', placeholder: 'Text message' },
  { id: 'vcard', label: 'vCard', icon: User, category: 'business', placeholder: 'Contact info' },
  { id: 'event', label: 'Event', icon: Calendar, category: 'business', placeholder: 'Calendar event' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, category: 'social', placeholder: '@username' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, category: 'social', placeholder: '@username' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, category: 'social', placeholder: 'username' },
  { id: 'twitter', label: 'X / Twitter', icon: Twitter, category: 'social', placeholder: '@handle' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, category: 'social', placeholder: 'username' },
  { id: 'tiktok', label: 'TikTok', icon: Music, category: 'social', placeholder: '@username' },
  { id: 'snapchat', label: 'Snapchat', icon: Ghost, category: 'social', placeholder: '@username' },
  { id: 'bitcoin', label: 'Bitcoin', icon: Bitcoin, category: 'payment', placeholder: 'Wallet address' },
  { id: 'paypal', label: 'PayPal', icon: CreditCard, category: 'payment', placeholder: '@username' },
  { id: 'venmo', label: 'Venmo', icon: Wallet, category: 'payment', placeholder: '@username' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, category: 'platform', placeholder: 'Video URL' },
  { id: 'spotify', label: 'Spotify', icon: Music2, category: 'platform', placeholder: 'Track/Playlist URL' },
  { id: 'appstore', label: 'App Store', icon: Apple, category: 'platform', placeholder: 'App URL' },
  { id: 'googleplay', label: 'Play Store', icon: Play, category: 'platform', placeholder: 'App URL' },
  { id: 'amazon', label: 'Amazon', icon: Package, category: 'platform', placeholder: 'Product URL' },
  { id: 'googlemaps', label: 'Google Maps', icon: Map, category: 'platform', placeholder: 'Location' },
  { id: 'applemaps', label: 'Apple Maps', icon: MapPin, category: 'platform', placeholder: 'Location' },
]

export const categories = [
  { id: 'core', label: 'Basic', description: 'Links & text' },
  { id: 'business', label: 'Business', description: 'Contacts & events' },
  { id: 'social', label: 'Social', description: 'Share profiles' },
  { id: 'payment', label: 'Payment', description: 'Accept payments' },
  { id: 'platform', label: 'Platforms', description: 'Apps & media' },
] as const

export function getQRTypeInfo(type: QRType): QRTypeOption {
  return qrTypes.find(t => t.id === type) || qrTypes[0]
}