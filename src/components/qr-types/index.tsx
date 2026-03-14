import type { QRType } from '../../utils/icons'
import type { QRTypeFormProps } from './types'
import { WifiForm } from './WifiForm'
import { EmailForm } from './EmailForm'
import { VCardForm } from './VCardForm'
import { EventForm } from './EventForm'
import { SMSForm } from './SMSForm'
import { CryptoForm } from './CryptoForm'
import { WhatsAppForm } from './WhatsAppForm'
import { PaymentForm } from './PaymentForm'
import { VenmoForm } from './VenmoForm'
import { DefaultForm } from './DefaultForm'

interface QRFormRendererProps extends QRTypeFormProps {
  qrType: QRType
}

export function QRFormRenderer({ qrType, formData, updateField }: QRFormRendererProps) {
  switch (qrType) {
    case 'wifi':
      return <WifiForm formData={formData} updateField={updateField} />
    case 'email':
      return <EmailForm formData={formData} updateField={updateField} />
    case 'vcard':
      return <VCardForm formData={formData} updateField={updateField} />
    case 'event':
      return <EventForm formData={formData} updateField={updateField} />
    case 'sms':
      return <SMSForm formData={formData} updateField={updateField} />
    case 'crypto':
      return <CryptoForm formData={formData} updateField={updateField} />
    case 'whatsapp':
      return <WhatsAppForm formData={formData} updateField={updateField} />
    case 'paypal':
      return <PaymentForm formData={formData} updateField={updateField} label="PayPal" />
    case 'venmo':
      return <VenmoForm formData={formData} updateField={updateField} />
    default:
      return <DefaultForm qrType={qrType} formData={formData} updateField={updateField} />
  }
}
