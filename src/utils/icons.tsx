import {
  Link, FileText, Wifi, Mail, Phone, MessageSquare,
  User, Calendar,
  MessageCircle, Instagram, Facebook, Linkedin, Music, Ghost,
  Bitcoin, CreditCard, Wallet,
  Youtube, Music2, Apple, Play, Package, Map, MapPin,
  Globe,
  type LucideIcon
} from 'lucide-react'

// Custom X (Twitter) icon since lucide uses old bird
const XIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

// Custom Discord icon
const DiscordIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
)

// Custom Threads icon
const ThreadsIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068V12c.015-3.58 1.205-6.419 3.538-8.439C7.054 1.788 9.744.785 12.51.785c2.464 0 4.754.748 6.614 2.161 1.683 1.16 2.913 2.786 3.632 4.793l.025.072-2.52.838-.019-.06c-.498-1.463-1.377-2.632-2.539-3.38-1.36-.857-3.029-1.31-4.962-1.31-2.284 0-4.256.789-5.78 2.295-1.62 1.592-2.464 3.89-2.481 6.778v.047c.017 2.9.848 5.182 2.474 6.784 1.528 1.517 3.498 2.31 5.784 2.325h.052c1.906 0 3.57-.47 4.915-1.387 1.154-.774 2.02-1.938 2.506-3.373l.018-.059 2.513.854-.023.07c-.703 1.988-1.914 3.61-3.583 4.784-1.843 1.426-4.122 2.18-6.57 2.18h-.038zm-.004-8.467c-.975 0-1.765-.285-2.35-.848-.596-.572-.898-1.353-.898-2.32 0-1.027.333-1.866.965-2.428.59-.525 1.372-.79 2.323-.79.966 0 1.748.27 2.324.802.617.57.93 1.401.93 2.47 0 .934-.3 1.697-.867 2.208-.574.516-1.387.787-2.352.787l-.075-.081zm-.007-8.486c-1.494 0-2.743.463-3.713 1.375-1.027.963-1.549 2.338-1.549 4.089 0 1.667.503 3.011 1.454 3.886.939.863 2.215 1.317 3.79 1.317h.044c1.534 0 2.791-.468 3.675-1.368.935-.95 1.409-2.272 1.409-3.929 0-1.644-.477-2.963-1.382-3.819-.879-.832-2.122-1.257-3.599-1.257l-.129.003z"/>
  </svg>
)

// Custom Pinterest icon
const PinterestIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
  </svg>
)

// Custom Reddit icon
const RedditIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.945 0 1.713.768 1.713 1.713 0 .607-.32 1.14-.796 1.447.067.303.1.61.1.92 0 2.836-2.96 5.135-6.612 5.135-3.652 0-6.612-2.299-6.612-5.135 0-.31.034-.618.102-.922-.475-.307-.793-.84-.793-1.445 0-.945.768-1.713 1.713-1.713.478 0 .9.185 1.21.495 1.194-.954 2.848-1.509 4.674-1.576l.894-4.186a.332.332 0 0 1 .13-.195.337.337 0 0 1 .23-.05l2.967.624a1.25 1.25 0 0 1 1.044-.555zm-5.01 5.193c-2.836 0-5.137 1.598-5.137 3.568 0 1.97 2.3 3.567 5.137 3.567 2.836 0 5.137-1.597 5.137-3.567 0-1.97-2.3-3.568-5.137-3.568zm-2.712 2.426c.528 0 .957.429.957.957s-.429.957-.957.957-.957-.429-.957-.957.429-.957.957-.957zm5.424 0c.528 0 .957.429.957.957s-.429.957-.957.957-.957-.429-.957-.957.429-.957.957-.957zm-2.712 2.926c.916 0 1.763.26 2.423.684a.332.332 0 0 1 .093.46.333.333 0 0 1-.46.094c-.527-.338-1.263-.545-2.056-.545-.793 0-1.53.207-2.056.545a.333.333 0 0 1-.46-.094.332.332 0 0 1 .093-.46c.66-.424 1.507-.684 2.423-.684z"/>
  </svg>
)

// Custom Twitch icon
const TwitchIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
  </svg>
)

export type QRType = 
  | 'url' | 'text' | 'wifi' | 'email' | 'phone' | 'sms' 
  | 'vcard' | 'event' 
  | 'whatsapp' | 'telegram' | 'messenger' | 'discord' | 'threads'
  | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok' | 'snapchat' 
  | 'youtube' | 'pinterest' | 'reddit' | 'twitch' | 'spotify' | 'medium' | 'github' | 'website'
  | 'crypto' | 'bitcoin' | 'ethereum' | 'solana' | 'xrp' | 'bnb' | 'ton'
  | 'paypal' | 'venmo' | 'cashapp'
  | 'appstore' | 'googleplay' | 'amazon' | 'googlemaps' | 'applemaps'
  | 'calendly' | 'zillow' | 'redfin' | 'realtor' | 'apartments' | 'googlereviews'

export interface QRTypeOption {
  id: QRType
  label: string
  icon: LucideIcon | ((props: { className?: string; size?: number }) => JSX.Element)
  category: 'core' | 'social' | 'payment' | 'platform' | 'business'
  placeholder: string
  fields: string[]
}

export const qrTypes: QRTypeOption[] = [
  // Core
  { id: 'url', label: 'URL', icon: Link, category: 'core', placeholder: 'https://yoursite.com', fields: ['url'] },
  { id: 'text', label: 'Text', icon: FileText, category: 'core', placeholder: 'Your message here', fields: ['text'] },
  { id: 'wifi', label: 'WiFi', icon: Wifi, category: 'core', placeholder: 'Network credentials' },
  { id: 'email', label: 'Email', icon: Mail, category: 'core', placeholder: 'email@example.com' },
  { id: 'phone', label: 'Phone', icon: Phone, category: 'core', placeholder: '+1 555 123 4567' },
  { id: 'sms', label: 'SMS', icon: MessageSquare, category: 'core', placeholder: 'Text message' },
  
  // Business
  { id: 'vcard', label: 'vCard', icon: User, category: 'business', placeholder: 'Contact info' },
  { id: 'event', label: 'Event', icon: Calendar, category: 'business', placeholder: 'Calendar event' },
  
  // Social
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, category: 'social', placeholder: '@username' },
  { id: 'telegram', label: 'Telegram', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ), category: 'social', placeholder: '@username' },
  { id: 'messenger', label: 'Messenger', icon: MessageCircle, category: 'social', placeholder: '@username' },
  { id: 'discord', label: 'Discord', icon: DiscordIcon, category: 'social', placeholder: 'username#0000' },
  { id: 'threads', label: 'Threads', icon: ThreadsIcon, category: 'social', placeholder: '@username' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, category: 'social', placeholder: '@username' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, category: 'social', placeholder: 'username' },
  { id: 'twitter', label: 'X', icon: XIcon, category: 'social', placeholder: '@handle' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, category: 'social', placeholder: 'username' },
  { id: 'tiktok', label: 'TikTok', icon: Music, category: 'social', placeholder: '@username' },
  { id: 'snapchat', label: 'Snapchat', icon: Ghost, category: 'social', placeholder: '@username' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, category: 'social', placeholder: 'Channel URL' },
  { id: 'pinterest', label: 'Pinterest', icon: PinterestIcon, category: 'social', placeholder: '@username' },
  { id: 'reddit', label: 'Reddit', icon: RedditIcon, category: 'social', placeholder: 'u/username' },
  { id: 'twitch', label: 'Twitch', icon: TwitchIcon, category: 'social', placeholder: 'username' },
  { id: 'github', label: 'GitHub', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  ), category: 'social', placeholder: 'username' },
  { id: 'medium', label: 'Medium', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
    </svg>
  ), category: 'social', placeholder: '@username' },
  
  // Payment
  { id: 'crypto', label: 'Crypto', icon: Bitcoin, category: 'payment', placeholder: 'Wallet address' },
  { id: 'paypal', label: 'PayPal', icon: CreditCard, category: 'payment', placeholder: '@username' },
  { id: 'venmo', label: 'Venmo', icon: Wallet, category: 'payment', placeholder: '@username' },
  { id: 'cashapp', label: 'Cash App', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.485 16.085c-.315.54-.92.915-1.62.915h-5.73c-.7 0-1.305-.375-1.62-.915l-.165-.285L7.5 12.75V7.5c0-.69.56-1.25 1.25-1.25h6.5c.69 0 1.25.56 1.25 1.25v5.25l-.135.285-.885 1.05z"/>
    </svg>
  ), category: 'payment', placeholder: '$Cashtag' },
  
  // Platform
  { id: 'appstore', label: 'App Store', icon: Apple, category: 'platform', placeholder: 'App URL' },
  { id: 'googleplay', label: 'Play Store', icon: Play, category: 'platform', placeholder: 'App URL' },
  { id: 'amazon', label: 'Amazon', icon: Package, category: 'platform', placeholder: 'Product URL' },
  { id: 'googlemaps', label: 'Google Maps', icon: Map, category: 'platform', placeholder: 'Location' },
  { id: 'applemaps', label: 'Apple Maps', icon: MapPin, category: 'platform', placeholder: 'Location' },
  { id: 'spotify', label: 'Spotify', icon: Music2, category: 'platform', placeholder: 'Track/Playlist URL' },
  { id: 'website', label: 'Website', icon: Globe, category: 'platform', placeholder: 'https://...' },
  { id: 'calendly', label: 'Calendly', icon: Calendar, category: 'platform', placeholder: 'calendly.com/username' },
  { id: 'zillow', label: 'Zillow', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  ), category: 'platform', placeholder: 'zillow.com/profile' },
  { id: 'redfin', label: 'Redfin', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"/>
    </svg>
  ), category: 'platform', placeholder: 'redfin.com/agent' },
  { id: 'realtor', label: 'Realtor.com', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.08L12 15l5-2.09v3.08z"/>
    </svg>
  ), category: 'platform', placeholder: 'realtor.com/profile' },
  { id: 'apartments', label: 'Apartments.com', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16H3v2h18v-2h-2zm-2 0H7v-4h10v4zm0-6H7V5h10v10z"/>
    </svg>
  ), category: 'platform', placeholder: 'apartments.com/listing' },
  { id: 'googlereviews', label: 'Google Reviews', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
    </svg>
  ), category: 'platform', placeholder: 'Search for your business' },
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