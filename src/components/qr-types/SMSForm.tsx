import type { QRTypeFormProps } from './types'

export function SMSForm({ formData, updateField }: QRTypeFormProps) {
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
      </div>
      <div className="form-group">
        <label>Message</label>
        <textarea
          value={formData.message || ''}
          onChange={(e) => updateField('message', e.target.value)}
          placeholder="Your message..."
          rows={3}
        />
      </div>
    </div>
  )
}
