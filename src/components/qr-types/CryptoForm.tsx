import { popularCryptos } from '../../config/cryptocurrencies'
import type { QRTypeFormProps } from './types'

export function CryptoForm({ formData, updateField }: QRTypeFormProps) {
  return (
    <div className="form-fields">
      <div className="form-group">
        <label>Cryptocurrency</label>
        <select
          value={formData.symbol || 'BTC'}
          onChange={(e) => updateField('symbol', e.target.value)}
        >
          {popularCryptos.map(crypto => (
            <option key={crypto.symbol} value={crypto.symbol}>
              {crypto.name} ({crypto.symbol})
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Wallet Address</label>
        <input
          type="text"
          value={formData.address || ''}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder="Enter wallet address"
        />
      </div>
    </div>
  )
}
