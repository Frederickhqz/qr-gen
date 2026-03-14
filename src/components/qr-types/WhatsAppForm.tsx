import type { QRTypeFormProps } from './types'

export function WhatsAppForm({ formData, updateField }: QRTypeFormProps) {
  return (
    <div className="form-fields">
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="+1 555 123 4567"
        />
        <p className="form-hint">Include country code (e.g., +1 for US)</p>
      </div>
      <div className="form-group">
        <label>Message (Optional)</label>
        <textarea
          value={formData.message || ''}
          onChange={(e) => updateField('message', e.target.value)}
          placeholder="Hi! I found your QR code and wanted to reach out..."
          rows={3}
        />
      </div>
    </div>
  )
}
