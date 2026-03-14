// Cryptocurrency configuration
// Centralized to avoid magic strings and allow easy updates

export interface Cryptocurrency {
  symbol: string
  name: string
}

export const popularCryptos: Cryptocurrency[] = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'XRP', name: 'XRP' },
  { symbol: 'BNB', name: 'BNB' },
  { symbol: 'TON', name: 'Toncoin' },
]

export const allCryptos: Cryptocurrency[] = [
  ...popularCryptos,
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'TRX', name: 'TRON' },
  { symbol: 'AVAX', name: 'Avalanche' },
  { symbol: 'LINK', name: 'Chainlink' },
  { symbol: 'DOT', name: 'Polkadot' },
  { symbol: 'MATIC', name: 'Polygon' },
  { symbol: 'SHIB', name: 'Shiba Inu' },
  { symbol: 'UNI', name: 'Uniswap' },
  { symbol: 'LTC', name: 'Litecoin' },
  { symbol: 'ATOM', name: 'Cosmos' },
  { symbol: 'XLM', name: 'Stellar' },
  { symbol: 'ALGO', name: 'Algorand' },
  { symbol: 'VET', name: 'VeChain' },
]

export const getCryptoBySymbol = (symbol: string): Cryptocurrency | undefined => {
  return allCryptos.find(c => c.symbol === symbol)
}
