// QR Code Templates - Pre-designed styles for quick application

export interface QRTemplate {
  id: string
  name: string
  category: 'minimal' | 'branded' | 'artistic' | 'professional'
  description: string
  preview: string // Emoji or color swatch
  config: {
    dotsStyle: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'
    cornersStyle: 'square' | 'dot' | 'extra-rounded'
    fgColor: string
    bgColor: string
    bgTransparent: boolean
    gradientEnabled: boolean
    gradientColor1?: string
    gradientColor2?: string
    gradientType?: 'linear' | 'radial'
  }
}

export const qrTemplates: QRTemplate[] = [
  // Minimal category - Clean, simple designs
  {
    id: 'classic',
    name: 'Classic Black',
    category: 'minimal',
    description: 'Timeless black on white',
    preview: '⬛',
    config: {
      dotsStyle: 'square',
      cornersStyle: 'square',
      fgColor: '#000000',
      bgColor: '#ffffff',
      bgTransparent: false,
      gradientEnabled: false,
    }
  },
  {
    id: 'rounded-minimal',
    name: 'Rounded Minimal',
    category: 'minimal',
    description: 'Soft edges, clean look',
    preview: '⚪',
    config: {
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded',
      fgColor: '#1a1a1a',
      bgColor: '#ffffff',
      bgTransparent: false,
      gradientEnabled: false,
    }
  },
  {
    id: 'dotted',
    name: 'Dotted',
    category: 'minimal',
    description: 'Playful dot pattern',
    preview: '🔵',
    config: {
      dotsStyle: 'dots',
      cornersStyle: 'dot',
      fgColor: '#333333',
      bgColor: '#ffffff',
      bgTransparent: false,
      gradientEnabled: false,
    }
  },
  
  // Branded category - Popular brand colors
  {
    id: 'twitter',
    name: 'Twitter/X',
    category: 'branded',
    description: 'Official Twitter blue',
    preview: '🐦',
    config: {
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded',
      fgColor: '#1DA1F2',
      bgColor: '#ffffff',
      bgTransparent: false,
      gradientEnabled: false,
    }
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'branded',
    description: 'Instagram gradient style',
    preview: '📷',
    config: {
      dotsStyle: 'classy-rounded',
      cornersStyle: 'extra-rounded',
      fgColor: '#E4405F',
      bgColor: '#ffffff',
      bgTransparent: false,
      gradientEnabled: true,
      gradientColor1: '#F77737',
      gradientColor2: '#E4405F',
      gradientType: 'radial',
    }
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'branded',
    description: 'Spotify green',
    preview: '🎵',
    config: {
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded',
      fgColor: '#1DB954',
      bgColor: '#191414',
      bgTransparent: false,
      gradientEnabled: false,
    }
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'branded',
    description: 'YouTube red',
    preview: '▶️',
    config: {
      dotsStyle: 'square',
      cornersStyle: 'square',
      fgColor: '#FF0000',
      bgColor: '#ffffff',
      bgTransparent: false,
      gradientEnabled: false,
    }
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    category: 'branded',
    description: 'LinkedIn blue',
    preview: '💼',
    config: {
      dotsStyle: 'square',
      cornersStyle: 'square',
      fgColor: '#0A66C2',
      bgColor: '#ffffff',
      bgTransparent: false,
      gradientEnabled: false,
    }
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    category: 'branded',
    description: 'WhatsApp green',
    preview: '💬',
    config: {
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded',
      fgColor: '#25D366',
      bgColor: '#ffffff',
      bgTransparent: false,
      gradientEnabled: false,
    }
  },
  {
    id: 'telegram',
    name: 'Telegram',
    category: 'branded',
    description: 'Telegram blue',
    preview: '✈️',
    config: {
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded',
      fgColor: '#0088CC',
      bgColor: '#ffffff',
      bgTransparent: false,
      gradientEnabled: false,
    }
  },
  
  // Artistic category - Creative designs
  {
    id: 'sunset-gradient',
    name: 'Sunset Gradient',
    category: 'artistic',
    description: 'Warm sunset colors',
    preview: '🌅',
    config: {
      dotsStyle: 'classy',
      cornersStyle: 'extra-rounded',
      fgColor: '#FF6B6B',
      bgColor: '#ffffff',
      bgTransparent: false,
      gradientEnabled: true,
      gradientColor1: '#FF6B6B',
      gradientColor2: '#FFA500',
      gradientType: 'linear',
    }
  },
  {
    id: 'ocean-wave',
    name: 'Ocean Wave',
    category: 'artistic',
    description: 'Cool ocean blues',
    preview: '🌊',
    config: {
      dotsStyle: 'classy-rounded',
      cornersStyle: 'extra-rounded',
      fgColor: '#007AFF',
      bgColor: '#f0f8ff',
      bgTransparent: false,
      gradientEnabled: true,
      gradientColor1: '#007AFF',
      gradientColor2: '#00C7BE',
      gradientType: 'linear',
    }
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    category: 'artistic',
    description: 'Vibrant neon colors',
    preview: '💜',
    config: {
      dotsStyle: 'extra-rounded',
      cornersStyle: 'extra-rounded',
      fgColor: '#9B59B6',
      bgColor: '#1a1a2e',
      bgTransparent: false,
      gradientEnabled: true,
      gradientColor1: '#9B59B6',
      gradientColor2: '#E91E63',
      gradientType: 'radial',
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    category: 'artistic',
    description: 'Natural green tones',
    preview: '🌲',
    config: {
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded',
      fgColor: '#2ECC71',
      bgColor: '#f0fff4',
      bgTransparent: false,
      gradientEnabled: true,
      gradientColor1: '#27AE60',
      gradientColor2: '#2ECC71',
      gradientType: 'linear',
    }
  },
  {
    id: 'candy',
    name: 'Candy Pop',
    category: 'artistic',
    description: 'Sweet pink gradient',
    preview: '🍬',
    config: {
      dotsStyle: 'dots',
      cornersStyle: 'dot',
      fgColor: '#FF69B4',
      bgColor: '#FFF0F5',
      bgTransparent: false,
      gradientEnabled: true,
      gradientColor1: '#FF69B4',
      gradientColor2: '#FFB6C1',
      gradientType: 'linear',
    }
  },
  
  // Professional category - Business-ready
  {
    id: 'corporate',
    name: 'Corporate Blue',
    category: 'professional',
    description: 'Professional dark blue',
    preview: '🏢',
    config: {
      dotsStyle: 'square',
      cornersStyle: 'square',
      fgColor: '#003366',
      bgColor: '#ffffff',
      bgTransparent: false,
      gradientEnabled: false,
    }
  },
  {
    id: 'modern-business',
    name: 'Modern Business',
    category: 'professional',
    description: 'Clean corporate style',
    preview: '👔',
    config: {
      dotsStyle: 'classy',
      cornersStyle: 'extra-rounded',
      fgColor: '#2C3E50',
      bgColor: '#ECF0F1',
      bgTransparent: false,
      gradientEnabled: false,
    }
  },
  {
    id: 'tech-startup',
    name: 'Tech Startup',
    category: 'professional',
    description: 'Modern tech aesthetic',
    preview: '💻',
    config: {
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded',
      fgColor: '#667EEA',
      bgColor: '#ffffff',
      bgTransparent: false,
      gradientEnabled: true,
      gradientColor1: '#667EEA',
      gradientColor2: '#764BA2',
      gradientType: 'linear',
    }
  },
  {
    id: 'transparent',
    name: 'Transparent',
    category: 'professional',
    description: 'No background, overlay anywhere',
    preview: '🔲',
    config: {
      dotsStyle: 'square',
      cornersStyle: 'square',
      fgColor: '#000000',
      bgColor: '#ffffff',
      bgTransparent: true,
      gradientEnabled: false,
    }
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    category: 'professional',
    description: 'Perfect for dark themes',
    preview: '🌙',
    config: {
      dotsStyle: 'rounded',
      cornersStyle: 'extra-rounded',
      fgColor: '#ffffff',
      bgColor: '#1c1c1e',
      bgTransparent: false,
      gradientEnabled: false,
    }
  },
]

export const templateCategories = [
  { id: 'minimal', name: 'Minimal', description: 'Clean, simple designs' },
  { id: 'branded', name: 'Branded', description: 'Popular brand colors' },
  { id: 'artistic', name: 'Artistic', description: 'Creative designs' },
  { id: 'professional', name: 'Professional', description: 'Business-ready styles' },
] as const

export function getTemplatesByCategory(category: string): QRTemplate[] {
  return qrTemplates.filter(t => t.category === category)
}

export function getTemplateById(id: string): QRTemplate | undefined {
  return qrTemplates.find(t => t.id === id)
}