export const dotStyles = [
  { id: 'square', name: 'Square' },
  { id: 'dots', name: 'Dots' },
  { id: 'rounded', name: 'Rounded' },
  { id: 'extra-rounded', name: 'Extra Rounded' },
  { id: 'classy', name: 'Classy' },
  { id: 'classy-rounded', name: 'Classy Rounded' },
] as const

export const cornerStyles = [
  { id: 'square', name: 'Square' },
  { id: 'dot', name: 'Dot' },
  { id: 'extra-rounded', name: 'Extra Rounded' },
] as const

export const presets = [
  { name: 'Classic', fg: '#000000', bg: '#ffffff', dots: 'square', corners: 'square' },
  { name: 'Modern', fg: '#1a1a1a', bg: '#ffffff', dots: 'rounded', corners: 'extra-rounded' },
  { name: 'Ocean', fg: '#007AFF', bg: '#f0f8ff', dots: 'dots', corners: 'dot' },
  { name: 'Forest', fg: '#30d158', bg: '#f0fff0', dots: 'rounded', corners: 'extra-rounded' },
  { name: 'Sunset', fg: '#FF9500', bg: '#fff8f0', dots: 'classy', corners: 'extra-rounded' },
  { name: 'Purple', fg: '#AF52DE', bg: '#faf0ff', dots: 'classy-rounded', corners: 'extra-rounded' },
  { name: 'Dark', fg: '#ffffff', bg: '#1c1c1e', dots: 'square', corners: 'square' },
  { name: 'Midnight', fg: '#0A84FF', bg: '#1c1c1e', dots: 'rounded', corners: 'extra-rounded' },
] as const

export type DotStyle = typeof dotStyles[number]['id']
export type CornerStyle = typeof cornerStyles[number]['id']
export type Preset = typeof presets[number]