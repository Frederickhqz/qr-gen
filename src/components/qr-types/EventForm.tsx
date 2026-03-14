import type { QRTypeFormProps } from './types'

export function EventForm({ formData, updateField }: QRTypeFormProps) {
  return (
    <div className="form-fields">
      <div className="form-group">
        <label>Event Title</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Meeting with Team"
        />
      </div>
      <div className="form-group">
        <label>Location</label>
        <input
          type="text"
          value={formData.location || ''}
          onChange={(e) => updateField('location', e.target.value)}
          placeholder="Conference Room A"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Start</label>
          <input
            type="datetime-local"
            value={formData.start || ''}
            onChange={(e) => updateField('start', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>End</label>
          <input
            type="datetime-local"
            value={formData.end || ''}
            onChange={(e) => updateField('end', e.target.value)}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Event description..."
          rows={3}
        />
      </div>
    </div>
  )
}
