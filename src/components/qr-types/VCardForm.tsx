import type { QRTypeFormProps } from './types'

export function VCardForm({ formData, updateField }: QRTypeFormProps) {
  return (
    <div className="form-fields">
      <div className="form-row">
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={formData.firstName || ''}
            onChange={(e) => updateField('firstName', e.target.value)}
            placeholder="John"
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={formData.lastName || ''}
            onChange={(e) => updateField('lastName', e.target.value)}
            placeholder="Doe"
          />
        </div>
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          value={formData.phone || ''}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="+1 555 123 4567"
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="john@example.com"
        />
      </div>
      <div className="form-group">
        <label>Company</label>
        <input
          type="text"
          value={formData.company || ''}
          onChange={(e) => updateField('company', e.target.value)}
          placeholder="Company Name"
        />
      </div>
      <div className="form-group">
        <label>Job Title</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Software Engineer"
        />
      </div>
      <div className="form-group">
        <label>Website</label>
        <input
          type="url"
          value={formData.website || ''}
          onChange={(e) => updateField('website', e.target.value)}
          placeholder="https://example.com"
        />
      </div>
    </div>
  )
}
