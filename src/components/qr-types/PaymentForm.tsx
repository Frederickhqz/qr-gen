import type { QRTypeFormProps } from './types'

export function PaymentForm({ formData, updateField, label = 'PayPal' }: QRTypeFormProps & { label?: string }) {
  return (
    <div className="form-fields">
      <div className="form-group">
        <label>{label} Username</label>
        <input
          type="text"
          value={formData.handle || ''}
          onChange={(e) => updateField('handle', e.target.value)}
          placeholder="@username"
        />
      </div>
      <div className="form-group">
        <label>Amount (Optional)</label>
        <input
          type="text"
          value={formData.amount || ''}
          onChange={(e) => updateField('amount', e.target.value)}
          placeholder="10.00"
        />
        <p className="form-hint">Pre-fill payment amount</p>
      </div>
    </div>
  )
}
