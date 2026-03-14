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

// WhatsApp icon (official)
const WhatsAppIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.299-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.287 9.287 0 01-4.7-1.28l-.337-.2-3.486.915.93-3.4-.218-.35a9.253 9.253 0 01-1.417-4.926c.002-5.118 4.164-9.28 9.282-9.28a9.22 9.22 0 016.562 2.72 9.222 9.222 0 012.72 6.568c-.003 5.117-4.165 9.28-9.282 9.28m7.982-19.267C18.14.827 15.19-.02 12.047 0 5.432 0 .01 5.421.01 12.036a12.01 12.01 0 001.618 6.04L0 24l6.106-1.602a11.936 11.936 0 005.738 1.46h.005c6.615 0 11.988-5.372 11.99-11.987.004-3.203-1.244-6.212-3.508-8.476"/>
  </svg>
)

// Messenger icon (official)
const MessengerIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 0C5.373 0 0 5.037 0 11.25c0 3.297 1.613 6.248 4.15 8.17V24l3.794-2.087c1.306.358 2.688.554 4.056.554C18.627 22.467 24 17.43 24 11.25S18.627 0 12 0zm1.5 16.5l-3.75-4-7.5 4 8.25-8.75 3.75 4 7.5-4-8.25 8.75z"/>
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
    viewBox="0 0 960 960" 
    fill="currentColor" 
    className={className}
  >
    <path d="M804.6 960H155.4C69.58 960 0 890.42 0 804.6V155.4C0 69.58 69.58 0 155.4 0h649.2C890.42 0 960 69.58 960 155.4v649.2c0 85.82-69.58 155.4-155.4 155.4z"/>
    <path fill="#FFF" d="M404.63 392.13c-11.92-7.93-51.53-35.49-51.53-35.49 33.4-47.88 77.46-66.52 138.36-66.52 43.07 0 79.64 14.52 105.75 42 26.12 27.49 41.02 66.8 44.41 117.07 14.48 6.07 27.85 13.22 39.99 21.4 48.96 33 75.92 82.34 75.92 138.91 0 120.23-98.34 224.67-276.35 224.67-152.84 0-311.63-89.11-311.63-354.45 0-263.83 153.81-353.92 311.2-353.92 72.68 0 243.16 10.76 307.27 222.94l-60.12 15.63C678.33 213.2 574.4 189.14 479.11 189.14c-157.52 0-246.62 96.13-246.62 300.65 0 183.38 99.59 280.8 248.71 280.8 122.68 0 214.15-63.9 214.15-157.44 0-63.66-53.37-94.14-56.1-94.14-10.42 54.62-38.36 146.5-161.01 146.5-71.46 0-133.07-49.47-133.07-114.29 0-92.56 87.61-126.06 156.8-126.06 25.91 0 57.18 1.75 73.46 5.07 0-28.21-23.81-76.49-83.96-76.49-55.15-.01-69.14 17.92-86.84 38.39zm105.8 96.25c-90.13 0-101.79 38.51-101.79 62.7 0 38.86 46.07 51.74 70.65 51.74 45.06 0 91.35-12.52 98.63-107.31-22.85-5.14-39.88-7.13-67.49-7.13z"/>
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

// PayPal icon (official 2024 from Wikimedia Commons)
const PayPalIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 29} 
    viewBox="0 0 374 450" 
    fill="currentColor" 
    className={className}
  >
    <path d="M318.58,103.5c0,55.74-51.44,121.5-129.27,121.5h-74.97l-3.68,23.22-17.49,111.78H0L56.05,0h150.95c50.83,0,90.82,28.33,105.55,67.7,4.25,11.45,6.29,23.59,6.03,35.8Z"/>
  </svg>
)

// Venmo icon (official from Wikimedia Commons)
const VenmoIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 512 512"
    fill="currentColor"
    className={className}
  >
    <path d="M444.17,32H70.28C49.85,32,32,46.7,32,66.89V441.6C32,461.91,49.85,480,70.28,480H444.06C464.6,480,480,461.8,480,441.61V66.89C480.12,46.7,464.6,32,444.17,32ZM278,387H174.32L132.75,138.44l90.75-8.62,22,176.87c20.53-33.45,45.88-86,45.88-121.87,0-19.62-3.36-33-8.61-44L365.4,124.1c9.56,15.78,13.86,32,13.86,52.57C379.25,242.17,323.34,327.26,278,387Z"/>
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
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.087 14.667c-.4.52-.96.88-1.68 1.08v.04c.96.24 1.68.64 2.16 1.2.48.56.72 1.28.72 2.16 0 .72-.16 1.36-.48 1.92-.32.56-.76 1.04-1.32 1.44-.56.4-1.24.68-2.04.84-.8.16-1.68.24-2.64.24h-4.8v-3.6h4.92c.64 0 1.12-.08 1.44-.24.32-.16.48-.44.48-.84 0-.32-.12-.56-.36-.72-.24-.16-.6-.24-1.08-.24H9.687v-3.36h2.52c.4 0 .72-.08.96-.24.24-.16.36-.4.36-.72 0-.28-.12-.48-.36-.6-.24-.12-.56-.2-.96-.2H8.247V8.48h4.44c.96 0 1.8.08 2.52.24.72.16 1.32.44 1.8.84.48.4.84.88 1.08 1.44.24.56.36 1.24.36 2 0 .96-.2 1.76-.6 2.4-.4.64-.92 1.12-1.56 1.44z"/>
  </svg>
)

// Apple Maps icon (official from Wikimedia Commons)
const AppleMapsIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 512 512" 
    fill="currentColor" 
    className={className}
  >
    <path d="M256 384c71.7 0 128-56.3 128-128s-56.3-128-128-128-128 56.3-128 128 56.3 128 128 128zm0-213.5l52.5 155-52.5-35-52.5 35 52.5-155z"/>
  </svg>
)

// Google Play icon (official from Simple Icons)
const GooglePlayIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="m22.018 13.298l-3.919 2.218l-3.515-3.493l3.543-3.521l3.891 2.202a1.49 1.49 0 0 1 0 2.594M1.337.924a1.5 1.5 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087zm12.207 10.065l3.258-3.238L3.45.195a1.47 1.47 0 0 0-.946-.179zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54z"/>
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

// Amazon icon (official from Simple Icons)
const AmazonIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M.045 18.02q.107-.174.348-.022q5.455 3.165 11.87 3.166q4.278-.001 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13c.226-.088.39-.046.525.13c.12.174.09.336-.12.48c-.256.19-.6.41-1.006.654q-1.867 1.113-4.185 1.726a17.6 17.6 0 0 1-10.951-.577a17.9 17.9 0 0 1-5.43-3.35q-.15-.113-.151-.22c0-.047.021-.09.051-.13zm6.565-6.218q0-1.507.743-2.577c.495-.71 1.17-1.25 2.04-1.615c.796-.335 1.756-.575 2.912-.72c.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875c-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46c-.35.27-.575.63-.675 1.096c-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39c0-.046.007-.09.022-.15q.372-1.935 1.82-2.88c.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29c.135.15.27.3.405.48c.12.165.224.314.283.45c.075.134.15.33.195.57c.06.254.105.42.135.51c.03.104.062.3.076.615c.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036q.157.471.315.674l.51.674q.136.204.136.36q0 .181-.18.314c-1.2 1.05-1.86 1.62-1.963 1.71q-.247.203-.63.045a6 6 0 0 1-.526-.496l-.31-.347a9 9 0 0 1-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665c-.494.15-1.093.227-1.83.227c-1.11 0-2.04-.343-2.76-1.034c-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438q-.001.848.425 1.364c.285.34.675.512 1.155.512c.045 0 .106-.007.195-.02c.09-.016.134-.023.166-.023c.614-.16 1.08-.553 1.424-1.178c.165-.28.285-.58.36-.91c.09-.32.12-.59.135-.8c.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18c-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17q.544-.365 1.05-.5a8 8 0 0 1 1.612-.24c.14-.012.28 0 .41.03c.65.06 1.05.168 1.172.33c.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8q-.418 1.034-1.156 1.68q-.11.09-.197.09c-.03 0-.06 0-.09-.012c-.09-.044-.107-.12-.064-.24c.54-1.26.806-2.143.806-2.64c0-.15-.03-.27-.087-.344c-.145-.166-.55-.257-1.224-.257q-.364 0-.87.046c-.363.045-.7.09-1 .135q-.134 0-.18-.044c-.03-.03-.036-.047-.02-.077c0-.017.006-.03.02-.063v-.06z"/>
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

// Calendly icon (official from Simple Icons)
const CalendlyIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.655 14.262c.281 0 .557.023.828.064 0 .005-.005.01-.005.014-.105.267-.234.534-.381.786l-1.219 2.106c-1.112 1.936-3.177 3.127-5.411 3.127h-2.432c-2.23 0-4.294-1.191-5.412-3.127l-1.218-2.106a6.251 6.251 0 0 1 0-6.252l1.218-2.106C6.736 4.832 8.8 3.641 11.035 3.641h2.432c2.23 0 4.294 1.191 5.411 3.127l1.219 2.106c.147.252.271.519.381.786 0 .004.005.009.005.014-.267.041-.543.064-.828.064-1.816 0-2.501-.607-3.291-1.306-.764-.676-1.711-1.517-3.44-1.517h-1.029c-1.251 0-2.387.455-3.2 1.278-.796.805-1.233 1.904-1.233 3.099v1.411c0 1.196.437 2.295 1.233 3.099.813.823 1.949 1.278 3.2 1.278h1.034c1.729 0 2.676-.841 3.439-1.517.791-.703 1.471-1.306 3.287-1.301Zm.005-3.237c.399 0 .794-.036 1.179-.11-.002-.004-.002-.01-.002-.014-.073-.414-.193-.823-.349-1.218.731-.12 1.407-.396 1.986-.819 0-.004-.005-.013-.005-.018-.331-1.085-.832-2.101-1.489-3.03-.649-.915-1.435-1.719-2.331-2.395-1.867-1.398-4.088-2.138-6.428-2.138-1.448 0-2.855.28-4.175.841-1.273.543-2.423 1.315-3.407 2.299S2.878 6.552 2.341 7.83c-.557 1.324-.842 2.726-.842 4.175 0 1.448.281 2.855.842 4.174.542 1.274 1.314 2.423 2.298 3.407s2.129 1.761 3.407 2.299c1.324.556 2.727.841 4.175.841 2.34 0 4.561-.74 6.428-2.137a10.815 10.815 0 0 0 2.331-2.396c.652-.929 1.158-1.949 1.489-3.03 0-.004.005-.014.005-.018-.579-.423-1.255-.699-1.986-.819.161-.395.276-.804.349-1.218.005-.009.005-.014.005-.023.869.166 1.692.506 2.404 1.035.685.505.552 1.075.446 1.416C22.184 20.437 17.619 24 12.221 24c-6.625 0-12-5.375-12-12s5.37-12 12-12c5.398 0 9.963 3.563 11.471 8.464.106.341.239.915-.446 1.421-.717.529-1.535.873-2.404 1.034.128.716.128 1.45 0 2.166-.387-.074-.782-.11-1.182-.11-4.184 0-3.968 2.823-6.736 2.823h-1.029c-1.899 0-3.15-1.357-3.15-3.095v-1.411c0-1.738 1.251-3.094 3.15-3.094h1.034c2.768 0 2.552 2.823 6.731 2.827Z"/>
  </svg>
)

// Zillow icon (official from Simple Icons)
const ZillowIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.006 0L1.086 8.627v3.868c3.386-2.013 11.219-5.13 14.763-6.015.11-.024.16.005.227.078.372.427 1.586 1.899 1.916 2.301a.128.128 0 0 1-.03.195 43.607 43.607 0 0 0-6.67 6.527c-.03.037-.006.043.012.03 2.642-1.134 8.828-2.94 11.622-3.452V8.627zm-.48 11.177c-2.136.708-8.195 3.307-10.452 4.576V24h21.852v-7.936c-2.99.506-11.902 3.16-15.959 5.246a.183.183 0 0 1-.23-.036l-2.044-2.429c-.055-.061-.062-.098.011-.208 1.574-2.3 4.789-5.899 6.833-7.418.042-.03.031-.06-.012-.042Z"/>
  </svg>
)

// Redfin icon (house with arrow - brand-appropriate)
// Redfin icon (official from brand assets)
const RedfinIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 23.5 23" 
    fill="currentColor" 
    className={className}
  >
    <path d="M23.313 12.928c0 4.26-2.274 7.985-5.673 10.025a.323.323 0 01-.4-.058l-3.913-4.172a.324.324 0 01.13-.528 5.568 5.568 0 003.755-5.267 5.561 5.561 0 00-5.651-5.566C8.515 7.412 6.1 9.967 6.1 13.019v9.618a.325.325 0 01-.495.275A11.673 11.673 0 010 13.077C-.08 6.665 5.09 1.339 11.49 1.25c6.513-.09 11.822 5.173 11.822 11.678z"/>
  </svg>
)

// Realtor.com icon (house with keyhole - brand-appropriate)
const RealtorIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12 3L2 12h3v8h6v-5h2v5h6v-8h3L12 3zm5 15h-2v-5H9v5H7v-6.5l5-4.5 5 4.5V18z"/>
    <circle cx="12" cy="13" r="1.5"/>
  </svg>
)

// Apartments.com icon (building with A - brand-appropriate)
const ApartmentsIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17 3H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-2h2v2zm0-4h-2V9h2v4zm4 4h-2v-2h2v2zm0-4h-2V9h2v4zM8 7h8v2H8V7z"/>
  </svg>
)

// Google Reviews icon (using Google G logo)
const GoogleReviewsIcon = ({ className, size }: { className?: string; size?: number }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
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
  { id: 'vcard', label: 'vCard', icon: User, category: 'business', placeholder: 'Contact info', fields: ['firstName', 'lastName', 'phone', 'email', 'company', 'title', 'website'] },
  { id: 'event', label: 'Event', icon: Calendar, category: 'business', placeholder: 'Calendar event', fields: ['title', 'location', 'start', 'end', 'description'] },
  
  // Social
  { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppIcon, category: 'social', placeholder: 'Phone number', fields: ['phone', 'message'] },
  { id: 'telegram', label: 'Telegram', icon: ({ className, size }) => (
    <svg width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ), category: 'social', placeholder: '@username', fields: ['handle'] },
  { id: 'messenger', label: 'Messenger', icon: MessengerIcon, category: 'social', placeholder: '@username', fields: ['handle'] },
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
  { id: 'paypal', label: 'PayPal', icon: PayPalIcon, category: 'payment', placeholder: '@username', fields: ['handle', 'amount'] },
  { id: 'venmo', label: 'Venmo', icon: VenmoIcon, category: 'payment', placeholder: '@username', fields: ['handle', 'message'] },
  { id: 'cashapp', label: 'Cash App', icon: CashAppIcon, category: 'payment', placeholder: '$Cashtag', fields: ['handle'] },
  
  // Platform
  { id: 'appstore', label: 'App Store', icon: AppStoreIcon, category: 'platform', placeholder: 'App URL', fields: ['url'] },
  { id: 'googleplay', label: 'Play Store', icon: GooglePlayIcon, category: 'platform', placeholder: 'App URL', fields: ['url'] },
  { id: 'amazon', label: 'Amazon', icon: AmazonIcon, category: 'platform', placeholder: 'Product URL', fields: ['url'] },
  { id: 'googlemaps', label: 'Google Maps', icon: GoogleMapsIcon, category: 'platform', placeholder: 'Location', fields: ['location'] },
  { id: 'applemaps', label: 'Apple Maps', icon: AppleMapsIcon, category: 'platform', placeholder: 'Location', fields: ['location'] },
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
}// Build trigger 1773078925
