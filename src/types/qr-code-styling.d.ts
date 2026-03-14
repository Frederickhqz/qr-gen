declare module 'qr-code-styling' {
  export interface Gradient {
    type: 'linear' | 'radial'
    rotation?: number
    colorStops: Array<{
      offset: number
      color: string
    }}
  }

  export interface DotsOptions {
    color?: string
    type?: 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'
    gradient?: Gradient
  }

  export interface CornersOptions {
    type?: 'square' | 'dot' | 'extra-rounded'
    color?: string
  }

  export interface BackgroundOptions {
    color?: string
  }

  export interface ImageOptions {
    crossOrigin?: string
    margin?: number
    imageSize?: number
  }

  export interface Options {
    width?: number
    height?: number
    data?: string
    image?: string
    qrOptions?: {
      typeNumber?: number
      mode?: string
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    }
    dotsOptions?: DotsOptions
    cornersSquareOptions?: CornersOptions
    cornersDotOptions?: CornersOptions
    backgroundOptions?: BackgroundOptions
    imageOptions?: ImageOptions
  }

  export interface DownloadOptions {
    name?: string
    extension?: 'png' | 'jpeg' | 'webp' | 'svg'
  }

  export default class QRCodeStyling {
    constructor(options: Options)
    append(container: HTMLElement): Promise<void>
    download(options?: DownloadOptions): Promise<void>
    update(options: Partial<Options>): void
  }
}
