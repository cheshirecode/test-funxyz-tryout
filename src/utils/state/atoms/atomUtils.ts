// Utility functions for atomic state management
import { atom, WritableAtom, Atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

// Generic localStorage persistence utility
export function createStorageAtom<T>(key: string, initialValue: T): WritableAtom<T, [T], void> {
  return atomWithStorage(key, initialValue)
}

// Utility to create a derived atom that depends on multiple atoms
export function createDerivedAtom<T, U extends readonly unknown[]>(
  dependencies: readonly [...{ [K in keyof U]: Atom<U[K]> }],
  compute: (...values: U) => T
): Atom<T> {
  return atom((get) => {
    const values = dependencies.map(dep => get(dep)) as unknown as U
    return compute(...values)
  })
}

// Utility to create an atom with validation
export function createValidatedAtom<T>(
  baseAtom: WritableAtom<T, [T], void>,
  validator: (value: T) => boolean,
  fallbackValue: T
): WritableAtom<T, [T], void> {
  return atom(
    (get) => get(baseAtom),
    (_get, set, newValue: T) => {
      if (validator(newValue)) {
        set(baseAtom, newValue)
      } else {
        console.warn(`Invalid value for atom: ${newValue}, using fallback: ${fallbackValue}`)
        set(baseAtom, fallbackValue)
      }
    }
  )
}

// Utility to reset atoms to their initial values
export function createResetAtom<T>(
  targetAtom: WritableAtom<T, [T], void>,
  initialValue: T
): WritableAtom<null, [], void> {
  return atom(
    null,
    (_get, set) => {
      set(targetAtom, initialValue)
    }
  )
}

// Utility for creating localStorage keys with consistent prefixing
export function createStorageKey(domain: string, key: string): string {
  return `${domain}-${key}`
}

// Export default localStorage configuration
export const STORAGE_CONFIG = {
  PREFIX: 'funxyz',
  SWAP_DOMAIN: 'swap',
} as const

// Helper to create swap-specific storage keys
export function createSwapStorageKey(key: string): string {
  return createStorageKey(STORAGE_CONFIG.SWAP_DOMAIN, key)
}