import type { QRTypeFormProps } from './types'

export function EmailForm({ formData, updateField }: QRTypeFormProps) {
  return (
    <div className="form-fields">
      <div className="form-group">
        <label>To</label>
        <input
          type="email"
          value={formData.to || ''}
          onChange={(e) => updateField('to', e.target.value)}
          placeholder="recipient@example.com"
        />
      </div>
      <div className="form-group">
        <label>Subject</label>
        <input
          type="text"
          value={formData.subject || ''}
          onChange={(e) => updateField('subject', e.target.value)}
          placeholder="Email subject"
        />
      </div>
      <div className="form-group">
        <label>Message</label>
        <textarea
          value={formData.body || ''}
          onChange={(e) => updateField('body', e.target.value)}
          placeholder="Your message..."
          rows={3}
        />
      </div>
    </div>
  )
}
