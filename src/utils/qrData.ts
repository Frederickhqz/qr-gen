import type { QRType } from './icons'

export function generateQRData(type: QRType, data: Record<string, string>): string {
  switch (type) {
    case 'url':
      return data.url?.trim() || 'https://qrgen.studio'
    case 'text':
      return data.text?.trim() || 'Sample text'
    case 'wifi':
      return data.ssid ? `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password};;` : 'WIFI:T:WPA;S:Network;P:password;;'
    case 'email':
      let mailto = `mailto:${data.email || 'hello@example.com'}`
      const params = []
      if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`)
      if (data.body) params.push(`body=${encodeURIComponent(data.body)}`)
      return params.length ? `${mailto}?${params.join('&')}` : mailto
    case 'phone':
      return data.phone ? `tel:${data.phone.replace(/\D/g, '')}` : 'tel:+15551234567'
    case 'sms':
      const smsNum = (data.phone || '+15551234567').replace(/\D/g, '')
      return data.message ? `sms:${smsNum}?body=${encodeURIComponent(data.message)}` : `sms:${smsNum}`
    case 'vcard':
      const fn = `${data.firstName || 'John'} ${data.lastName || 'Doe'}`.trim()
      let vcard = 'BEGIN:VCARD\nVERSION:3.0'
      vcard += `\nFN:${fn}\nN:${data.lastName || 'Doe'};${data.firstName || 'John'};;;`
      if (data.phone) vcard += `\nTEL:${data.phone}`
      if (data.email) vcard += `\nEMAIL:${data.email}`
      if (data.company) vcard += `\nORG:${data.company}`
      if (data.title) vcard += `\nTITLE:${data.title}`
      if (data.website) vcard += `\nURL:${data.website}`
      vcard += '\nEND:VCARD'
      return vcard
    case 'event':
      const start = (data.start || '20260101T100000').replace(/[-:]/g, '').replace('T', 'T')
      const end = (data.end || '20260101T110000').replace(/[-:]/g, '').replace('T', 'T')
      let ical = 'BEGIN:VEVENT\n'
      if (data.title) ical += `SUMMARY:${data.title}\n`
      ical += `DTSTART:${start}\nDTEND:${end}\n`
      if (data.location) ical += `LOCATION:${data.location}\n`
      if (data.description) ical += `DESCRIPTION:${data.description}\n`
      ical += 'END:VEVENT'
      return ical
    case 'whatsapp':
      const waNum = (data.phone || '+15551234567').replace(/\D/g, '')
      return data.message ? `https://wa.me/${waNum}?text=${encodeURIComponent(data.message)}` : `https://wa.me/${waNum}`
    case 'instagram':
      const igHandle = (data.handle || 'username').replace('@', '').replace('instagram.com/', '')
      return `https://instagram.com/${igHandle}`
    case 'facebook':
      const fbHandle = (data.handle || 'username').replace('facebook.com/', '').replace('@', '')
      return `https://facebook.com/${fbHandle}`
    case 'twitter':
      const twHandle = (data.handle || 'username').replace('@', '').replace('twitter.com/', '').replace('x.com/', '')
      return `https://twitter.com/${twHandle}`
    case 'linkedin':
      const liHandle = (data.handle || 'username').replace('linkedin.com/', '').replace('in/', '')
      return `https://linkedin.com/in/${liHandle}`
    case 'tiktok':
      const ttHandle = (data.handle || 'username').replace('@', '').replace('tiktok.com/', '')
      return `https://tiktok.com/@${ttHandle}`
    case 'snapchat':
      const scHandle = (data.handle || 'username').replace('@', '').replace('snapchat.com/add/', '')
      return `https://snapchat.com/add/${scHandle}`
    case 'bitcoin':
      let btc = `bitcoin:${data.address || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'}`
      const btcParams = []
      if (data.amount) btcParams.push(`amount=${data.amount}`)
      return btcParams.length ? `${btc}?${btcParams.join('&')}` : btc
    case 'paypal':
      return data.amount ? `https://paypal.me/${data.handle || 'username'}/${data.amount}` : `https://paypal.me/${data.handle || 'username'}`
    case 'venmo':
      return data.message ? `https://venmo.com/${data.handle || 'username'}?note=${encodeURIComponent(data.message)}` : `https://venmo.com/${data.handle || 'username'}`
    case 'youtube':
      const ytId = data.url?.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1]
      return ytId ? `https://youtube.com/watch?v=${ytId}` : data.url || 'https://youtube.com'
    case 'spotify':
      return data.url || 'https://spotify.com'
    case 'appstore':
      const appId = data.url?.match(/id(\d+)/)?.[1]
      return appId ? `https://apps.apple.com/app/id${appId}` : data.url || 'https://apps.apple.com'
    case 'googleplay':
      const pkg = data.url?.match(/id=([^&]+)/)?.[1]
      return pkg ? `https://play.google.com/store/apps/details?id=${pkg}` : data.url || 'https://play.google.com'
    case 'amazon':
      return data.url || 'https://amazon.com'
    case 'googlemaps':
      const coords = data.url?.match(/[-.\d]+,[-.\d]+/)?.[0]
      return coords ? `https://www.google.com/maps?q=${coords}` : data.url || 'https://maps.google.com'
    case 'applemaps':
      const appleCoords = data.url?.match(/[-.\d]+,[-.\d]+/)?.[0]
      return appleCoords ? `http://maps.apple.com/?q=${appleCoords}` : data.url || 'http://maps.apple.com'
    default:
      return 'https://qrgen.studio'
  }
}

export function generatePlaceholderData(type: QRType): string {
  switch (type) {
    case 'url': return 'https://example.com'
    case 'text': return 'Your text here'
    case 'wifi': return 'WIFI:T:WPA;S:Network;P:password;;'
    case 'email': return 'mailto:hello@example.com'
    case 'phone': return 'tel:+15551234567'
    case 'sms': return 'sms:+15551234567'
    case 'vcard': return 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nEND:VCARD'
    case 'event': return 'BEGIN:VEVENT\nSUMMARY:Sample Event\nEND:VEVENT'
    case 'whatsapp': return 'https://wa.me/15551234567'
    case 'instagram': return 'https://instagram.com/sample'
    case 'facebook': return 'https://facebook.com/sample'
    case 'twitter': return 'https://twitter.com/sample'
    case 'linkedin': return 'https://linkedin.com/in/sample'
    case 'tiktok': return 'https://tiktok.com/@sample'
    case 'snapchat': return 'https://snapchat.com/add/sample'
    case 'bitcoin': return 'bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    case 'paypal': return 'https://paypal.me/sample'
    case 'venmo': return 'https://venmo.com/sample'
    case 'youtube': return 'https://youtube.com'
    case 'spotify': return 'https://spotify.com'
    case 'appstore': return 'https://apps.apple.com'
    case 'googleplay': return 'https://play.google.com'
    case 'amazon': return 'https://amazon.com'
    case 'googlemaps': return 'https://maps.google.com'
    case 'applemaps': return 'http://maps.apple.com'
    default: return 'https://qrgen.studio'
  }
}