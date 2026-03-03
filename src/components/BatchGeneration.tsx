import { useState, useRef } from 'react'
import { Download, FileText, X, Loader2, CheckCircle, AlertCircle, CreditCard, FileArchive } from 'lucide-react'
import JSZip from 'jszip'

const PRICE_PER_QR = 1.99
const API_BASE = 'https://api.qrgen.studio'

interface BatchGenerationProps {
  isOpen: boolean
  onClose: () => void
  onBatchComplete?: () => void
}

interface BatchItem {
  id: string
  data: string
  status: 'pending' | 'generating' | 'success' | 'error'
  blob?: Blob
  error?: string
}

export function BatchGeneration({ isOpen, onClose, onBatchComplete }: BatchGenerationProps) {
  const [inputType, setInputType] = useState<'urls' | 'text'>('urls')
  const [inputText, setInputText] = useState('')
  const [items, setItems] = useState<BatchItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)
  const [showPayment, setShowPayment] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null
  
  const totalPrice = items.length * PRICE_PER_QR

  const parseInput = (text: string): string[] => {
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
    
    // Deduplicate
    return [...new Set(lines)]
  }

  const handleInputChange = (value: string) => {
    setInputText(value)
    const parsed = parseInput(value)
    setItems(parsed.map((data, index) => ({
      id: `item-${index}`,
      data,
      status: 'pending'
    })))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    handleInputChange(text)
  }

  const generateQRCode = async (data: string): Promise<Blob> => {
    const mod = await import('qr-code-styling')
    const QRCodeStyling = (mod as any).default || (mod as any)

    const qr = new QRCodeStyling({
      width: 800,
      height: 800,
      data,
      dotsOptions: {
        color: '#000000',
        type: 'square'
      },
      backgroundOptions: {
        color: '#ffffff'
      },
      cornersSquareOptions: {
        type: 'square',
        color: '#000000'
      },
      cornersDotOptions: {
        type: 'square',
        color: '#000000'
      }
    })

    // Create hidden container
    const hiddenContainer = document.createElement('div')
    hiddenContainer.style.position = 'absolute'
    hiddenContainer.style.left = '-9999px'
    hiddenContainer.style.top = '-9999px'
    hiddenContainer.style.width = '800px'
    hiddenContainer.style.height = '800px'
    document.body.appendChild(hiddenContainer)

    try {
      await qr.append(hiddenContainer)
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Get blob directly
      const blob = await new Promise<Blob>((resolve, reject) => {
        qr.getRawData('png').then((data: Blob) => {
          resolve(data)
        }).catch(reject)
      })
      
      return blob
    } finally {
      document.body.removeChild(hiddenContainer)
    }
  }

  const startBatch = () => {
    if (items.length === 0) return
    setShowPayment(true)
  }

  const processBatch = async () => {
    if (items.length === 0) return
    
    setShowPayment(false)
    setIsProcessing(true)
    
    try {
      // Create Stripe checkout session with quantity
      const response = await fetch(`${API_BASE}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: items.length,
          successUrl: `${window.location.origin}?payment=success&batch=true`,
          cancelUrl: `${window.location.origin}?payment=cancelled`
        })
      })
      
      const data = await response.json()
      
      if (data.url) {
        // Store batch data in sessionStorage for retrieval after payment
        sessionStorage.setItem('pendingBatch', JSON.stringify(items.map(i => i.data)))
        window.location.href = data.url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Batch checkout error:', error)
      alert('Failed to initiate payment. Please try again.')
    }
    
    setIsProcessing(false)
  }

  const downloadAll = async () => {
    const successfulItems = items.filter(item => item.status === 'success' && item.blob)
    
    if (successfulItems.length === 0) return
    
    // Create ZIP file
    const zip = new JSZip()
    
    for (let i = 0; i < successfulItems.length; i++) {
      const item = successfulItems[i]
      // Clean filename
      const filename = item.data
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 50) || `qr-${i + 1}`
      
      zip.file(`qr-${filename}.png`, item.blob!)
    }
    
    // Generate and download ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `qr-codes-${successfulItems.length}.zip`
    link.click()
    URL.revokeObjectURL(url)
  }

  const pendingCount = items.filter(i => i.status === 'pending').length
  const successCount = items.filter(i => i.status === 'success').length
  const errorCount = items.filter(i => i.status === 'error').length

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Batch QR Generation</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Input Type Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setInputType('urls')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputType === 'urls'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              URLs
            </button>
            <button
              onClick={() => setInputType('text')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputType === 'text'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
            >
              Plain Text
            </button>
          </div>

          {/* Text Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {inputType === 'urls' 
                ? 'Enter URLs (one per line)'
                : 'Enter text (one item per line)'}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={inputType === 'urls' 
                ? 'https://example1.com\nhttps://example2.com\nhttps://example3.com'
                : 'Item 1\nItem 2\nItem 3'}
              className="w-full h-40 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* File Upload */}
          <div className="mb-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              Or upload a .txt or .csv file
            </button>
          </div>

          {/* Items Preview */}
          {items.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Items ({items.length})
                </span>
                <div className="flex gap-3 text-xs">
                  {pendingCount > 0 && (
                    <span className="text-gray-500">{pendingCount} pending</span>
                  )}
                  {successCount > 0 && (
                    <span className="text-green-500">{successCount} success</span>
                  )}
                  {errorCount > 0 && (
                    <span className="text-red-500">{errorCount} errors</span>
                  )}
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                  >
                    {item.status === 'pending' && (
                      <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
                    )}
                    {item.status === 'generating' && (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    )}
                    {item.status === 'success' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {item.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                      {item.data}
                    </span>
                    {item.status === 'error' && item.error && (
                      <span className="text-xs text-red-500">{item.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          {isProcessing && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-400">Processing...</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {processedCount} / {items.length}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(processedCount / items.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">{items.length} items × ${PRICE_PER_QR.toFixed(2)} = </span>
            <span className="font-bold text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex gap-3">
            {successCount > 0 && !isProcessing && (
              <button
                onClick={downloadAll}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FileArchive className="w-4 h-4" />
                Download ZIP ({successCount})
              </button>
            )}
            <button
              onClick={startBatch}
              disabled={items.length === 0 || isProcessing}
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  Pay ${totalPrice.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Payment Confirmation Modal */}
        {showPayment && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirm Payment</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Generate {items.length} QR codes for ${totalPrice.toFixed(2)}
                </p>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Quantity</span>
                    <span className="font-medium text-gray-900 dark:text-white">{items.length} QR codes</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Price each</span>
                    <span className="font-medium text-gray-900 dark:text-white">${PRICE_PER_QR.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-blue-500 text-lg">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPayment(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processBatch}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Pay & Generate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}