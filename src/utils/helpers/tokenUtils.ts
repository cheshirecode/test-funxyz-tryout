// Token-related utility functions
import type { TokenData } from '../tokenData'

/**
 * Generate fallback token icon SVG
 */
export function generateTokenIconFallback(tokenSymbol: string, size: number = 24): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ctext x='12' y='16' text-anchor='middle' font-size='8'%3E${tokenSymbol.charAt(0)}%3C/text%3E%3C/svg%3E`
}

/**
 * Handle token icon loading error
 */
export function handleTokenIconError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  tokenSymbol: string,
  size?: number
): void {
  event.currentTarget.src = generateTokenIconFallback(tokenSymbol, size)
}

/**
 * Calculate token amount from USD value
 */
export function calculateTokenAmount(
  usdAmount: string,
  tokenData: TokenData | undefined
): string {
  if (!usdAmount || isNaN(parseFloat(usdAmount)) || !tokenData) {
    return '0'
  }

  const usd = parseFloat(usdAmount)
  const tokenAmount = usd / (tokenData.usdPrice || 1)

  return tokenAmount.toFixed(tokenData.decimals || 2)
}

/**
 * Calculate exchange rate between two tokens
 */
export function calculateExchangeRate(
  sourceTokenData: TokenData | undefined,
  targetTokenData: TokenData | undefined
): number {
  if (!sourceTokenData || !targetTokenData) return 0

  return (sourceTokenData.usdPrice || 1) / (targetTokenData.usdPrice || 1)
}

/**
 * Format token balance display
 */
export function formatTokenBalance(
  balance: number,
  symbol: string,
  isLoading: boolean = false
): string {
  if (isLoading) return 'Loading...'
  return `${balance} ${symbol}`
}

/**
 * Get available tokens list (configurable)
 */
export function getAvailableTokens(): string[] {
  return ['USDC', 'USDT', 'ETH', 'WBTC']
}

/**
 * Check if token is in available list
 */
export function isTokenAvailable(token: string): boolean {
  return getAvailableTokens().includes(token)
}