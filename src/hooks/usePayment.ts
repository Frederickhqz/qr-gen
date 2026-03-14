import { useState, useCallback, useEffect, useRef } from 'react'

const PRICE = 1.99
const API_BASE = import.meta.env.VITE_N8N_URL || 'https://n8n.srv796810.hstgr.cloud'

interface PaymentMetadata {
  qr_type: string
  qr_size: string
  dots_style: string
  corners_style: string
  fg_color: string
  bg_color: string
  gradient: string
  gradient_color1: string
  gradient_color2: string
  has_logo: string
}

interface UsePaymentOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function usePayment(options: UsePaymentOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'cancelled'>('idle')
  const processedRef = useRef(false)

  const initiatePayment = useCallback(async (metadata: PaymentMetadata) => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)
    setPaymentStatus('idle')

    try {
      const response = await fetch(`${API_BASE}/webhook/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metadata,
          successUrl: `${window.location.origin}?payment=success`,
          cancelUrl: `${window.location.origin}?payment=cancelled`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed'
      setError(message)
      options.onError?.(message)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, options])

  // Check for payment status on mount (for redirects back from Stripe)
  useEffect(() => {
    if (processedRef.current) return

    const urlParams = new URLSearchParams(window.location.search)
    const paymentStatus = urlParams.get('payment')

    if (paymentStatus === 'success') {
      processedRef.current = true
      // Clear URL params without triggering a refresh
      window.history.replaceState({}, '', window.location.pathname)
      setPaymentStatus('success')
      options.onSuccess?.()
    } else if (paymentStatus === 'cancelled') {
      processedRef.current = true
      window.history.replaceState({}, '', window.location.pathname)
      setPaymentStatus('cancelled')
    }
  }, [options])

  const resetStatus = useCallback(() => {
    setPaymentStatus('idle')
    setError(null)
    processedRef.current = false
  }, [])

  return {
    PRICE,
    isLoading,
    error,
    paymentStatus,
    initiatePayment,
    resetStatus,
    setError
  }
}
