/**
 * Compress and resize logo images for QR code embedding
 * Max recommended logo size for QR codes is ~100x100px
 */

export interface CompressedLogo {
  dataUrl: string
  originalWidth: number
  originalHeight: number
  newWidth: number
  newHeight: number
  wasCompressed: boolean
}

const MAX_LOGO_SIZE = 150 // pixels
const MAX_FILE_SIZE = 100 * 1024 // 100KB

export async function compressLogo(
  file: File | string,
  maxSize: number = MAX_LOGO_SIZE
): Promise<CompressedLogo> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const inputUrl = typeof file === 'string' ? file : URL.createObjectURL(file)
    
    img.onload = () => {
      const originalWidth = img.width
      const originalHeight = img.height
      
      // Calculate new dimensions maintaining aspect ratio
      let newWidth = originalWidth
      let newHeight = originalHeight
      
      if (originalWidth > maxSize || originalHeight > maxSize) {
        const ratio = Math.min(maxSize / originalWidth, maxSize / originalHeight)
        newWidth = Math.round(originalWidth * ratio)
        newHeight = Math.round(originalHeight * ratio)
      }
      
      const wasCompressed = newWidth !== originalWidth || newHeight !== originalHeight
      
      // Create canvas and draw resized image
      const canvas = document.createElement('canvas')
      canvas.width = newWidth
      canvas.height = newHeight
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      // Enable image smoothing for better quality
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      ctx.drawImage(img, 0, 0, newWidth, newHeight)
      
      // Try to get under file size limit
      let quality = 0.9
      let dataUrl = canvas.toDataURL('image/png')
      
      // If still too large, try JPEG with decreasing quality
      if (dataUrl.length > MAX_FILE_SIZE * 1.37) { // Base64 overhead
        while (quality > 0.5) {
          dataUrl = canvas.toDataURL('image/jpeg', quality)
          if (dataUrl.length <= MAX_FILE_SIZE * 1.37) break
          quality -= 0.1
        }
      }
      
      // Clean up blob URL if we created one
      if (typeof file !== 'string') {
        URL.revokeObjectURL(inputUrl)
      }
      
      resolve({
        dataUrl,
        originalWidth,
        originalHeight,
        newWidth,
        newHeight,
        wasCompressed
      })
    }
    
    img.onerror = () => {
      if (typeof file !== 'string') {
        URL.revokeObjectURL(inputUrl)
      }
      reject(new Error('Failed to load image'))
    }
    
    img.src = inputUrl
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}