import type { QRTypeFormProps } from './types'

export function VenmoForm({ formData, updateField }: QRTypeFormProps) {
  return (
    <div className="form-fields">
      <div className="form-group">
        <label>Venmo Username</label>
        <input
          type="text"
          value={formData.handle || ''}
          onChange={(e) => updateField('handle', e.target.value)}
          placeholder="@username"
        />
      </div>
      <div className="form-group">
        <label>Note (Optional)</label>
        <input
          type="text"
          value={formData.message || ''}
          onChange={(e) => updateField('message', e.target.value)}
          placeholder="Payment for..."
        />
        <p className="form-hint">Pre-fill payment note</p>
      </div>
    </div>
  )
}
