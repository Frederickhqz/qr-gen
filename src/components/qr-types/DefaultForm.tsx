import { getQRTypeInfo } from '../../utils/icons'
import type { QRTypeFormProps } from './types'

interface DefaultFormProps extends QRTypeFormProps {
  qrType: string
}

const fieldLabels: Record<string, string> = {
  url: 'URL',
  text: 'Text',
  phone: 'Phone Number',
  handle: 'Username',
  location: 'Location',
  query: 'Search Query'
}

const inputTypes: Record<string, string> = {
  url: 'url',
  phone: 'tel',
  email: 'email',
  text: 'text',
  handle: 'text',
  location: 'text',
  query: 'text'
}

export function DefaultForm({ qrType, formData, updateField }: DefaultFormProps) {
  const typeInfo = getQRTypeInfo(qrType)

  if (!typeInfo.fields || typeInfo.fields.length === 0) {
    return (
      <div className="form-fields">
        <p>No form fields for this type</p>
      </div>
    )
  }

  const fieldName = typeInfo.fields[0]
  const label = fieldLabels[fieldName] || typeInfo.label
  const inputType = inputTypes[fieldName] || 'text'

  return (
    <div className="form-fields">
      <div className="form-group">
        <label>{label}</label>
        <input
          type={inputType}
          value={formData[fieldName] || ''}
          onChange={(e) => updateField(fieldName, e.target.value)}
          placeholder={typeInfo.placeholder}
        />
      </div>
    </div>
  )
}
