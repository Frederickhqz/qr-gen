import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { generatePlaceholderData, generateQRData } from '../utils/qrData'
import { getPlatformIcon, brandColors } from '../utils/platformIcons'
import type { QRType } from '../utils/icons'
import type { CompressedLogo } from '../utils/logoCompress'
import type { DotStyle, CornerStyle } from '../utils/styling'

interface QRConfig {
  qrType: QRType
  dotsStyle: DotStyle
  cornersStyle: CornerStyle
  fgColor: string
  bgColor: string
  bgTransparent: boolean
  gradientEnabled: boolean
  gradientColor1: string
  gradientColor2: string
  gradientType: 'linear' | 'radial'
  logo: string | null
  logoSize: number
  logoMargin: number
  usePlatformIcon: boolean
  iconColor: string
  useOfficialColor: boolean
}

interface QRState {
  qr: any
  qrInstanceRef: React.MutableRefObject<any>
  updateIdRef: React.MutableRefObject<number>
  isInitializing: boolean
  error: string | null
}

export function useQRGenerator(config: QRConfig) {
  const [qr, setQr] = useState<any>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const qrInstanceRef = useRef<any>(null)
  const updateIdRef = useRef(0)

  // Preview size based on screen width
  const [previewSize, setPreviewSize] = useState(240)

  useEffect(() => {
    const updateSize = () => {
      setPreviewSize(window.innerWidth < 1024 ? 120 : 240)
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Memoize options to avoid unnecessary regenerations
  const options = useMemo(() => {
    const platformIconColor = config.useOfficialColor
      ? (brandColors[config.qrType] || '#000000')
      : config.iconColor
    const imageSource = config.logo || (config.usePlatformIcon ? getPlatformIcon(config.qrType, platformIconColor) : null) || undefined

    return {
      width: previewSize,
      height: previewSize,
      data: generatePlaceholderData(config.qrType),
      image: imageSource,
      dotsOptions: {
        color: config.fgColor,
        type: config.dotsStyle,
        ...(config.gradientEnabled && {
          gradient: {
            type: config.gradientType,
            rotation: 0,
            colorStops: [
              { offset: 0, color: config.gradientColor1 },
              { offset: 1, color: config.gradientColor2 }
            ]
          }
        })
      },
      backgroundOptions: {
        color: config.bgTransparent ? 'transparent' : config.bgColor,
      },
      cornersSquareOptions: {
        type: config.cornersStyle,
        color: config.fgColor,
      },
      cornersDotOptions: {
        type: config.cornersStyle,
        color: config.fgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous' as const,
        margin: config.logoMargin,
        imageSize: config.logoSize,
      },
    }
  }, [config, previewSize])

  const updateQR = useCallback(async (containerRef: React.RefObject<HTMLElement>) => {
    if (!containerRef.current) return

    const currentUpdateId = ++updateIdRef.current
    setIsInitializing(true)

    // Clean up previous instance
    if (qrInstanceRef.current) {
      try {
        qrInstanceRef.current = null
      } catch {
        // Ignore cleanup errors
      }
    }

    containerRef.current.innerHTML = ''

    try {
      // Dynamic import to avoid SSR issues
      const mod = await import('qr-code-styling')
      const QRCodeStyling = mod.default ?? mod

      // Check if this update was superseded
      if (currentUpdateId !== updateIdRef.current) return

      const newQr = new QRCodeStyling(options)

      // Double-check before appending
      if (currentUpdateId !== updateIdRef.current || !containerRef.current) return

      containerRef.current.innerHTML = ''
      await newQr.append(containerRef.current)

      // Final check
      if (currentUpdateId !== updateIdRef.current) {
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
        }
        return
      }

      qrInstanceRef.current = newQr
      setQr(newQr)
      setError(null)
    } catch (err) {
      console.error('Failed to initialize QR preview:', err)
      setQr(null)
      setError('Failed to initialize QR preview')
    } finally {
      setIsInitializing(false)
    }
  }, [options])

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    qrInstanceRef.current = null
  }, [])

  const generateDownloadQR = useCallback(async (formData: Record<string, string>, qrSize: number) => {
    const mod = await import('qr-code-styling')
    const QRCodeStyling = mod.default ?? mod

    const platformIconColor = config.useOfficialColor
      ? (brandColors[config.qrType] || '#000000')
      : config.iconColor
    const imageSource = config.logo || (config.usePlatformIcon ? getPlatformIcon(config.qrType, platformIconColor) : null) || undefined

    return new QRCodeStyling({
      width: qrSize,
      height: qrSize,
      data: generateQRData(config.qrType, formData),
      image: imageSource,
      dotsOptions: {
        color: config.fgColor,
        type: config.dotsStyle,
        ...(config.gradientEnabled && {
          gradient: {
            type: config.gradientType,
            rotation: 0,
            colorStops: [
              { offset: 0, color: config.gradientColor1 },
              { offset: 1, color: config.gradientColor2 }
            ]
          }
        })
      },
      backgroundOptions: {
        color: config.bgTransparent ? 'transparent' : config.bgColor,
      },
      cornersSquareOptions: {
        type: config.cornersStyle,
        color: config.fgColor,
      },
      cornersDotOptions: {
        type: config.cornersStyle,
        color: config.fgColor,
      },
      imageOptions: {
        crossOrigin: 'anonymous' as const,
        margin: config.logoMargin,
        imageSize: config.logoSize,
      },
    })
  }, [config])

  return {
    qr,
    isInitializing,
    error,
    previewSize,
    updateQR,
    generateDownloadQR,
    cleanup
  }
}
