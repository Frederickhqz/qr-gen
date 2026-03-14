import type { QRTypeFormProps } from './types'

export function WifiForm({ formData, updateField }: QRTypeFormProps) {
  return (
    <div className="form-fields">
      <div className="form-group">
        <label>Network Name (SSID)</label>
        <input
          type="text"
          value={formData.ssid || ''}
          onChange={(e) => updateField('ssid', e.target.value)}
          placeholder="MyWiFiNetwork"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="text"
          value={formData.password || ''}
          onChange={(e) => updateField('password', e.target.value)}
          placeholder="Leave blank for open network"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Security</label>
          <select value={formData.security || 'WPA'} onChange={(e) => updateField('security', e.target.value)}>
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">None</option>
          </select>
        </div>
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.hidden === 'true'}
              onChange={(e) => updateField('hidden', e.target.checked ? 'true' : 'false')}
            />
            <span>Hidden network</span>
          </label>
        </div>
      </div>
    </div>
  )
}
