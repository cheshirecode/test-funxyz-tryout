/**
 * Utility functions for handling blockchain addresses
 */

/**
 * Format an address for display by showing first 6 and last 4 characters
 * @param address - The full blockchain address
 * @returns Formatted address string or original if too short
 */
export const formatAddress = (address: string): string => {
  if (address.length <= 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Validate if a string is a valid Ethereum address
 * @param address - The address to validate
 * @returns True if valid Ethereum address format
 */
export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Check if address is the zero address (ETH placeholder)
 * @param address - The address to check
 * @returns True if zero address
 */
export const isZeroAddress = (address: string): boolean => {
  return address === '0x0000000000000000000000000000000000000000'
}