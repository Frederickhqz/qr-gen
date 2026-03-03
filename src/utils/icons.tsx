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

// Custom Threads icon (Meta)
const ThreadsIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.5 12.068V12c.015-3.58 1.205-6.419 3.538-8.439C7.054 1.788 9.744.785 12.51.785c2.464 0 4.754.748 6.614 2.161 1.683 1.16 2.913 2.786 3.632 4.793l.025.072-2.52.838-.019-.06c-.498-1.463-1.377-2.632-2.539-3.38-1.36-.857-3.029-1.31-4.962-1.31-2.284 0-4.256.789-5.78 2.295-1.62 1.592-2.464 3.89-2.481 6.778v.047c.017 2.9.848 5.182 2.474 6.784 1.528 1.517 3.498 2.31 5.784 2.325h.052c1.906 0 3.57-.47 4.915-1.387 1.154-.774 2.02-1.938 2.506-3.373l.018-.059 2.513.854-.023.07c-.703 1.988-1.914 3.61-3.583 4.784-1.843 1.426-4.122 2.18-6.57 2.18h-.038z"/>
  </svg>
)

// TikTok icon
const TikTokIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
)

// PayPal icon
const PayPalIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944 3.72a.77.77 0 01.76-.65h6.978c2.313 0 4.04.582 5.007 1.69.926 1.06 1.24 2.59.907 4.432-.016.088-.036.176-.058.264-.69 3.156-3.055 4.25-6.078 4.25H9.82a.76.76 0 00-.75.636l-.714 4.523a.641.641 0 01-.633.546l-.647-.074zm9.026-11.822c.06-.308.1-.61.12-.907.04-.468-.02-.878-.18-1.214-.38-.8-1.24-1.174-2.62-1.174h-1.31a.76.76 0 00-.75.636l-.75 4.76a.453.453 0 00.45.526h.85c1.86 0 3.25-.59 3.9-2.12.06-.15.12-.31.17-.48.05-.16.09-.33.12-.51v-.073z"/>
  </svg>
)

// Venmo icon
const VenmoIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M3.5 14.65c0-1.4.37-2.67 1.1-3.79.74-1.13 1.77-2.02 3.1-2.67l.43 1.16c-1.13.5-2.01 1.22-2.65 2.18-.63.95-.95 2.01-.95 3.18 0 .72.13 1.35.4 1.88.28.54.68.95 1.21 1.24.54.3 1.16.45 1.88.45.87 0 1.61-.26 2.22-.78.62-.52 1.07-1.23 1.35-2.14.28-.91.42-1.92.42-3.04 0-1.4-.24-2.65-.72-3.74-.48-1.09-1.15-1.95-2.02-2.58-.86-.62-1.85-.93-2.96-.93-1.26 0-2.35.41-3.26 1.24C4.15 8.21 3.5 9.44 3.5 11.07v3.58zm17 0c0-1.4-.37-2.67-1.1-3.79-.74-1.13-1.77-2.02-3.1-2.67l-.43 1.16c1.13.5 2.01 1.22 2.65 2.18.63.95.95 2.01.95 3.18 0 .72-.13 1.35-.4 1.88-.28.54-.68.95-1.21 1.24-.54.3-1.16.45-1.88.45-.87 0-1.61-.26-2.22-.78-.62-.52-1.07-1.23-1.35-2.14-.28-.91-.42-1.92-.42-3.04 0-1.4.24-2.65.72-3.74.48-1.09 1.15-1.95 2.02-2.58.86-.62 1.85-.93 2.96-.93 1.26 0 2.35.41 3.26 1.24.91.83 1.56 2.06 1.56 3.69v3.58z"/>
  </svg>
)

// Cash App icon
const CashAppIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 1.97-2.38-2.38-1.41 1.41 2.38 2.38-4.24 4.24-2.38-2.38-1.41 1.41 2.38 2.38-1.97 1.97L7.106 16l1.97-1.97-2.38-2.38 1.41-1.41 2.38 2.38 4.24-4.24-2.38-2.38 1.41-1.41 2.38 2.38 1.97-1.97L17.894 8.22z"/>
  </svg>
)

// App Store icon (Apple)
const AppStoreIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
)

// Amazon icon
const AmazonIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M15.93 17.09c-.17.17-.43.17-.6 0l-1.12-1.12c-.17-.17-.17-.43 0-.6l.04-.04c.17-.17.43-.17.6 0l1.12 1.12c.17.17.17.43 0 .6l-.04.04zm-3.93-6.09c1.55 0 2.81 1.26 2.81 2.81 0 .28-.04.54-.11.79l-.02.07c-.06.18-.24.3-.43.3h-.07c-.22-.04-.37-.25-.33-.47l.02-.06c.05-.2.08-.41.08-.63 0-1.07-.87-1.94-1.94-1.94s-1.94.87-1.94 1.94c0 .22.04.43.09.63l.02.06c.04.22-.11.43-.33.47h-.07c-.19 0-.37-.12-.43-.3l-.02-.07c-.07-.25-.11-.51-.11-.79-.01-1.55 1.25-2.81 2.8-2.81zm6.5 5.68c-.25.23-.62.21-.85-.04l-.08-.08c-.23-.25-.21-.62.04-.85 1.34-1.21 2.15-2.82 2.15-4.58 0-3.42-3.22-6.2-7.19-6.2s-7.19 2.78-7.19 6.2c0 1.76.81 3.37 2.15 4.58.25.23.27.6.04.85l-.08.08c-.23.25-.6.27-.85.04-1.59-1.44-2.55-3.38-2.55-5.55 0-4.14 3.8-7.5 8.48-7.5s8.48 3.36 8.48 7.5c0 2.17-.96 4.11-2.55 5.55zm-13.41 2.95c.35-.26.82-.32 1.2-.12 1.48.77 3.19 1.19 5.03 1.19s3.55-.42 5.03-1.19c.38-.2.85-.14 1.2.12.45.33.45.99 0 1.32l-.02.02c-1.85 1.37-4.08 2.03-6.21 2.03s-4.36-.66-6.21-2.03l-.02-.02c-.45-.33-.45-.99 0-1.32z"/>
  </svg>
)

// Spotify icon
const SpotifyIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.66.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

// Calendly icon
const CalendlyIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.5 3h-1.5V1.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V3H7V1.5c0-.28-.22-.5-.5-.5S6 1.22 6 1.5V3H4.5C3.67 3 3 3.67 3 4.5v15c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5zm0 16.5h-15v-12h15v12zm-9-7.5v4.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-3.79l-.65.39c-.24.14-.54.06-.68-.18s-.06-.54.18-.68l1.25-.75c.15-.09.35-.1.51-.01.15.09.25.26.25.44v.08zm2.5 0v4.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-3.79l-.65.39c-.24.14-.54.06-.68-.18s-.06-.54.18-.68l1.25-.75c.15-.09.35-.1.51-.01.15.09.25.26.25.44v.08zm3 0c0-.55.45-1 1-1h1.5c.28 0 .5.22.5.5s-.22.5-.5.5H16v1h1c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1h-1.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5H16v-1h-1c-.55 0-1-.45-1-1v-1z"/>
  </svg>
)

// Zillow icon
const ZillowIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.5 2.5L2 9l.5 2 10-6.5L22.5 11l.5-2L12.5 2.5zM4 14v6.5c0 .83.67 1.5 1.5 1.5h13c.83 0 1.5-.67 1.5-1.5V14l-8 5-8-5z"/>
  </svg>
)

// Redfin icon
const RedfinIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
)

// Realtor.com icon
const RealtorIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm5 15h-2v-4H9v4H7v-7.17l5-5 5 5V18z"/>
  </svg>
)

// Apartments.com icon
const ApartmentsIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
  </svg>
)

// Google Reviews icon
const GoogleReviewsIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
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
  { id: 'wifi', label: 'WiFi', icon: Wifi, category: 'core', placeholder: 'Network credentials', fields: ['ssid', 'password', 'security', 'hidden'] },
  { id: 'email', label: 'Email', icon: Mail, category: 'core', placeholder: 'email@example.com', fields: ['to', 'subject', 'body'] },
  { id: 'phone', label: 'Phone', icon: Phone, category: 'core', placeholder: '+1 555 123 4567', fields: ['phone'] },
  { id: 'sms', label: 'SMS', icon: MessageSquare, category: 'core', placeholder: 'Text message', fields: ['phone', 'message'] },

  // Business
  { id: 'vcard', label: 'vCard', icon: User, category: 'business', placeholder: 'Contact info', fields: ['name', 'phone', 'email', 'company', 'title', 'address', 'website'] },
  { id: 'event', label: 'Event', icon: Calendar, category: 'business', placeholder: 'Calendar event', fields: ['title', 'location', 'start', 'end', 'description'] },
  
  // Social
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, category: 'social', placeholder: '@username', fields: ['handle'] },
  { id: 'telegram', label: 'Telegram', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ), category: 'social', placeholder: '@username', fields: ['handle'] },
  { id: 'messenger', label: 'Messenger', icon: MessageCircle, category: 'social', placeholder: '@username', fields: ['handle'] },
  { id: 'discord', label: 'Discord', icon: DiscordIcon, category: 'social', placeholder: 'username#0000', fields: ['handle'] },
  { id: 'threads', label: 'Threads', icon: ThreadsIcon, category: 'social', placeholder: '@username', fields: ['handle'] },
  { id: 'instagram', label: 'Instagram', icon: Instagram, category: 'social', placeholder: '@username', fields: ['handle'] },
  { id: 'facebook', label: 'Facebook', icon: Facebook, category: 'social', placeholder: 'username', fields: ['handle'] },
  { id: 'twitter', label: 'X', icon: XIcon, category: 'social', placeholder: '@handle', fields: ['handle'] },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, category: 'social', placeholder: 'username', fields: ['handle'] },
  { id: 'tiktok', label: 'TikTok', icon: TikTokIcon, category: 'social', placeholder: '@username', fields: ['handle'] },
  { id: 'snapchat', label: 'Snapchat', icon: Ghost, category: 'social', placeholder: '@username', fields: ['handle'] },
  { id: 'youtube', label: 'YouTube', icon: Youtube, category: 'social', placeholder: 'Channel URL', fields: ['url'] },
  { id: 'pinterest', label: 'Pinterest', icon: PinterestIcon, category: 'social', placeholder: '@username', fields: ['handle'] },
  { id: 'reddit', label: 'Reddit', icon: RedditIcon, category: 'social', placeholder: 'u/username', fields: ['handle'] },
  { id: 'twitch', label: 'Twitch', icon: TwitchIcon, category: 'social', placeholder: 'username', fields: ['handle'] },
  { id: 'github', label: 'GitHub', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  ), category: 'social', placeholder: 'username', fields: ['handle'] },
  { id: 'medium', label: 'Medium', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
    </svg>
  ), category: 'social', placeholder: '@username', fields: ['handle'] },
  
  // Payment
  { id: 'crypto', label: 'Crypto', icon: Bitcoin, category: 'payment', placeholder: 'Wallet address', fields: ['symbol', 'address'] },
  { id: 'paypal', label: 'PayPal', icon: PayPalIcon, category: 'payment', placeholder: '@username', fields: ['handle'] },
  { id: 'venmo', label: 'Venmo', icon: VenmoIcon, category: 'payment', placeholder: '@username', fields: ['handle'] },
  { id: 'cashapp', label: 'Cash App', icon: CashAppIcon, category: 'payment', placeholder: '$Cashtag', fields: ['handle'] },
  
  // Platform
  { id: 'appstore', label: 'App Store', icon: AppStoreIcon, category: 'platform', placeholder: 'App URL', fields: ['url'] },
  { id: 'googleplay', label: 'Play Store', icon: Play, category: 'platform', placeholder: 'App URL', fields: ['url'] },
  { id: 'amazon', label: 'Amazon', icon: AmazonIcon, category: 'platform', placeholder: 'Product URL', fields: ['url'] },
  { id: 'googlemaps', label: 'Google Maps', icon: Map, category: 'platform', placeholder: 'Location', fields: ['location'] },
  { id: 'applemaps', label: 'Apple Maps', icon: MapPin, category: 'platform', placeholder: 'Location', fields: ['location'] },
  { id: 'spotify', label: 'Spotify', icon: SpotifyIcon, category: 'platform', placeholder: 'Track/Playlist URL', fields: ['url'] },
  { id: 'website', label: 'Website', icon: Globe, category: 'platform', placeholder: 'https://...', fields: ['url'] },
  { id: 'calendly', label: 'Calendly', icon: CalendlyIcon, category: 'platform', placeholder: 'calendly.com/username', fields: ['handle'] },
  { id: 'zillow', label: 'Zillow', icon: ZillowIcon, category: 'platform', placeholder: 'zillow.com/profile', fields: ['handle'] },
  { id: 'redfin', label: 'Redfin', icon: RedfinIcon, category: 'platform', placeholder: 'redfin.com/agent', fields: ['handle'] },
  { id: 'realtor', label: 'Realtor.com', icon: RealtorIcon, category: 'platform', placeholder: 'realtor.com/profile', fields: ['handle'] },
  { id: 'apartments', label: 'Apartments.com', icon: ApartmentsIcon, category: 'platform', placeholder: 'apartments.com/listing', fields: ['url'] },
  { id: 'googlereviews', label: 'Google Reviews', icon: GoogleReviewsIcon, category: 'platform', placeholder: 'Search for your business', fields: ['query'] },
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