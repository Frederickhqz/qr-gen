import { useState } from 'react'
import { qrTemplates, templateCategories, getTemplatesByCategory, type QRTemplate } from '../utils/templates'

interface TemplateSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (template: QRTemplate) => void
  currentStyle?: {
    dotsStyle: string
    cornersStyle: string
    fgColor: string
    bgColor: string
    bgTransparent: boolean
    gradientEnabled: boolean
    gradientColor1?: string
    gradientColor2?: string
    gradientType?: string
  }
}

export function TemplateSelector({ isOpen, onClose, onSelect, currentStyle }: TemplateSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  if (!isOpen) return null

  const filteredTemplates = activeCategory === 'all' 
    ? qrTemplates 
    : getTemplatesByCategory(activeCategory)

  // Check if current style matches a template
  const currentTemplateId = qrTemplates.find(t => {
    const c = t.config
    return (
      c.dotsStyle === currentStyle?.dotsStyle &&
      c.cornersStyle === currentStyle?.cornersStyle &&
      c.fgColor === currentStyle?.fgColor &&
      c.bgColor === currentStyle?.bgColor &&
      c.bgTransparent === currentStyle?.bgTransparent &&
      c.gradientEnabled === currentStyle?.gradientEnabled
    )
  })?.id

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">QR Templates</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Choose a pre-designed style</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            All ({qrTemplates.length})
          </button>
          {templateCategories.map(cat => {
            const count = getTemplatesByCategory(cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.name} ({count})
              </button>
            )
          })}
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTemplates.map(template => {
              const isSelected = template.id === currentTemplateId
              const config = template.config
              
              return (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelect(template)
                    onClose()
                  }}
                  className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  {/* Preview */}
                  <div 
                    className="w-full aspect-square rounded-lg mb-3 flex items-center justify-center text-4xl"
                    style={{
                      background: config.bgTransparent 
                        ? 'repeating-conic-gradient(#e5e7eb 0% 25%, white 0% 50%) 50% / 16px 16px'
                        : config.bgColor,
                    }}
                  >
                    <span style={{ 
                      color: config.gradientEnabled && config.gradientColor1 
                        ? config.gradientColor1 
                        : config.fgColor 
                    }}>
                      {template.preview}
                    </span>
                  </div>
                  
                  {/* Name & Description */}
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {template.description}
                  </p>
                  
                  {/* Selected Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                      {templateCategories.find(c => c.id === template.category)?.name}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}