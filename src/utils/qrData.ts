import type { QRType } from './icons'

export function generateQRData(type: QRType, data: Record<string, string>): string {
  const handle = (data.handle || 'username').replace('@', '')
  const url = data.url || ''
  
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
    
    // Social
    case 'whatsapp':
      const waNum = (data.phone || '+15551234567').replace(/\D/g, '')
      return data.message ? `https://wa.me/${waNum}?text=${encodeURIComponent(data.message)}` : `https://wa.me/${waNum}`
    case 'telegram':
      return `https://t.me/${handle}`
    case 'messenger':
      return `https://m.me/${handle}`
    case 'discord':
      return `https://discord.gg/${handle.replace('#', '')}`
    case 'threads':
      return `https://threads.net/@${handle.replace('@', '')}`
    case 'instagram':
      return `https://instagram.com/${handle}`
    case 'facebook':
      return `https://facebook.com/${handle}`
    case 'twitter':
      return `https://x.com/${handle.replace('@', '')}`
    case 'linkedin':
      return `https://linkedin.com/in/${handle}`
    case 'tiktok':
      return `https://tiktok.com/@${handle}`
    case 'snapchat':
      return `https://snapchat.com/add/${handle}`
    case 'youtube':
      const ytId = url.match(/(?:v=|youtu\.be\/)([^&]+)/)?.[1]
      return ytId ? `https://youtube.com/watch?v=${ytId}` : url || 'https://youtube.com'
    case 'pinterest':
      return `https://pinterest.com/${handle}`
    case 'reddit':
      return `https://reddit.com/u/${handle.replace('u/', '')}`
    case 'twitch':
      return `https://twitch.tv/${handle}`
    case 'github':
      return `https://github.com/${handle}`
    case 'medium':
      return `https://medium.com/@${handle.replace('@', '')}`
    
    // Payment
    case 'crypto':
    case 'bitcoin':
    case 'ethereum':
    case 'solana':
    case 'xrp':
    case 'bnb':
    case 'ton':
      const coinId = data.cryptoCoin || 'bitcoin'
      const coinSchemes: Record<string, string> = {
        bitcoin: 'bitcoin',
        ethereum: 'ethereum',
        solana: 'solana',
        xrp: 'ripple',
        bnb: 'bnb',
        ton: 'ton'
      }
      const scheme = coinSchemes[coinId] || coinId
      const address = data.cryptoAddress || data.address || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
      let cryptoUrl = `${scheme}:${address}`
      const cryptoParams = []
      if (data.cryptoAmount || data.amount) cryptoParams.push(`amount=${data.cryptoAmount || data.amount}`)
      return cryptoParams.length ? `${cryptoUrl}?${cryptoParams.join('&')}` : cryptoUrl
    case 'paypal':
      return data.amount ? `https://paypal.me/${handle}/${data.amount}` : `https://paypal.me/${handle}`
    case 'venmo':
      return data.message ? `https://venmo.com/${handle}?note=${encodeURIComponent(data.message)}` : `https://venmo.com/${handle}`
    case 'zelle':
      return `https://enroll.zellepay.com/?email=${encodeURIComponent(data.email || 'user@example.com')}`
    case 'cashapp':
      return `https://cash.app/${handle.replace('$', '')}`
    
    // Platform
    case 'appstore':
      const appId = url.match(/id(\d+)/)?.[1]
      return appId ? `https://apps.apple.com/app/id${appId}` : url || 'https://apps.apple.com'
    case 'googleplay':
      const pkg = url.match(/id=([^&]+)/)?.[1]
      return pkg ? `https://play.google.com/store/apps/details?id=${pkg}` : url || 'https://play.google.com'
    case 'amazon':
      return url || 'https://amazon.com'
    case 'googlemaps':
      const coords = url.match(/[-.\d]+,[-.\d]+/)?.[0]
      return coords ? `https://www.google.com/maps?q=${coords}` : url || 'https://maps.google.com'
    case 'applemaps':
      const appleCoords = url.match(/[-.\d]+,[-.\d]+/)?.[0]
      return appleCoords ? `http://maps.apple.com/?q=${appleCoords}` : url || 'http://maps.apple.com'
    case 'spotify':
      return url || 'https://spotify.com'
    case 'website':
      return url || 'https://example.com'
      
    default:
      return 'https://qrgen.studio'
  }
}

export function generatePlaceholderData(type: QRType): string {
  const placeholders: Record<string, string> = {
    url: 'https://example.com',
    text: 'Your text here',
    wifi: 'WIFI:T:WPA;S:Network;P:password;;',
    email: 'mailto:hello@example.com',
    phone: 'tel:+15551234567',
    sms: 'sms:+15551234567',
    vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nEND:VCARD',
    event: 'BEGIN:VEVENT\nSUMMARY:Sample Event\nEND:VEVENT',
    whatsapp: 'https://wa.me/15551234567',
    telegram: 'https://t.me/username',
    messenger: 'https://m.me/username',
    discord: 'https://discord.gg/invite',
    threads: 'https://threads.net/@username',
    instagram: 'https://instagram.com/sample',
    facebook: 'https://facebook.com/sample',
    twitter: 'https://x.com/sample',
    linkedin: 'https://linkedin.com/in/sample',
    tiktok: 'https://tiktok.com/@sample',
    snapchat: 'https://snapchat.com/add/sample',
    youtube: 'https://youtube.com',
    pinterest: 'https://pinterest.com/sample',
    reddit: 'https://reddit.com/u/sample',
    twitch: 'https://twitch.tv/sample',
    github: 'https://github.com/sample',
    medium: 'https://medium.com/@sample',
    bitcoin: 'bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    crypto: 'bitcoin:bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    paypal: 'https://paypal.me/sample',
    venmo: 'https://venmo.com/sample',
    zelle: 'https://enroll.zellepay.com/?email=user@example.com',
    cashapp: 'https://cash.app/sample',
    appstore: 'https://apps.apple.com',
    googleplay: 'https://play.google.com',
    amazon: 'https://amazon.com',
    googlemaps: 'https://maps.google.com',
    applemaps: 'http://maps.apple.com',
    spotify: 'https://spotify.com',
    website: 'https://example.com',
  }
  return placeholders[type] || 'https://qrgen.studio'
}