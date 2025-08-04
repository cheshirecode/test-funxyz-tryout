import { describe, it, expect } from 'vitest'
import { formatAddress, isValidAddress, isZeroAddress } from '../addressUtils'

describe('addressUtils', () => {
  describe('formatAddress', () => {
    it('should format a valid Ethereum address correctly', () => {
      const address = '0x1234567890123456789012345678901234567890'
      const result = formatAddress(address)
      expect(result).toBe('0x1234...7890')
    })

    it('should return original string if address is too short', () => {
      const shortAddress = '0x123456'
      const result = formatAddress(shortAddress)
      expect(result).toBe(shortAddress)
    })

    it('should handle empty string', () => {
      const result = formatAddress('')
      expect(result).toBe('')
    })

    it('should handle exactly 10 characters', () => {
      const address = '0x12345678'
      const result = formatAddress(address)
      expect(result).toBe(address)
    })

    it('should format 11+ character addresses', () => {
      const address = '0x123456789AB'
      const result = formatAddress(address)
      expect(result).toBe('0x1234...89AB')
    })
  })

  describe('isValidAddress', () => {
    it('should return true for valid Ethereum addresses', () => {
      const validAddresses = [
        '0x1234567890123456789012345678901234567890',
        '0xabcdefABCDEF12345678901234567890abcdefAB',
        '0x0000000000000000000000000000000000000000'
      ]

      validAddresses.forEach(address => {
        expect(isValidAddress(address)).toBe(true)
      })
    })

    it('should return false for invalid Ethereum addresses', () => {
      const invalidAddresses = [
        '1234567890123456789012345678901234567890', // missing 0x
        '0x123456789012345678901234567890123456789', // too short
        '0x12345678901234567890123456789012345678901', // too long
        '0x123456789012345678901234567890123456789g', // invalid character
        '', // empty string
        '0x', // just prefix
        'not an address'
      ]

      invalidAddresses.forEach(address => {
        expect(isValidAddress(address)).toBe(false)
      })
    })
  })

  describe('isZeroAddress', () => {
    it('should return true for zero address', () => {
      const zeroAddress = '0x0000000000000000000000000000000000000000'
      expect(isZeroAddress(zeroAddress)).toBe(true)
    })

    it('should return false for non-zero addresses', () => {
      const nonZeroAddresses = [
        '0x1234567890123456789012345678901234567890',
        '0x0000000000000000000000000000000000000001',
        '0x000000000000000000000000000000000000000'
      ]

      nonZeroAddresses.forEach(address => {
        expect(isZeroAddress(address)).toBe(false)
      })
    })
  })
})