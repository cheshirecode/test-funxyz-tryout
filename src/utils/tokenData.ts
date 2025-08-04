// Mock token data with prices and balances
export const tokenData: Record<
  string,
  {
    name: string
    icon: string
    usdPrice: number
    balance: number
    decimals: number
  }
> = {
  USDC: {
    name: 'USD Coin',
    icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    usdPrice: 1.0,
    balance: 1000,
    decimals: 2,
  },
  USDT: {
    name: 'Tether',
    icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    usdPrice: 1.0,
    balance: 500,
    decimals: 2,
  },
  ETH: {
    name: 'Ethereum',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    usdPrice: 3500,
    balance: 0.5,
    decimals: 6,
  },
  WBTC: {
    name: 'Wrapped Bitcoin',
    icon: 'https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png',
    usdPrice: 62000,
    balance: 0.01,
    decimals: 8,
  },
}