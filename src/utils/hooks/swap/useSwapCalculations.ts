// Custom hook for swap amount calculations
import { useState, useEffect } from 'react'
import { calculateTokenAmount, calculateExchangeRate } from '../../helpers/tokenUtils'
import type { TokenData } from '../../tokenData'

export interface UseSwapCalculationsReturn {
  sourceTokenAmount: string
  targetTokenAmount: string
  exchangeRate: number
}

export interface UseSwapCalculationsProps {
  usdAmount: string
  sourceToken: string
  targetToken: string
  tokenData: Record<string, TokenData>
}

/**
 * Custom hook for calculating token amounts and exchange rates
 */
export function useSwapCalculations({
  usdAmount,
  sourceToken,
  targetToken,
  tokenData
}: UseSwapCalculationsProps): UseSwapCalculationsReturn {
  const [sourceTokenAmount, setSourceTokenAmount] = useState<string>('0')
  const [targetTokenAmount, setTargetTokenAmount] = useState<string>('0')

  // Calculate token amounts from USD input
  useEffect(() => {
    if (!usdAmount || isNaN(parseFloat(usdAmount))) {
      setSourceTokenAmount('0')
      setTargetTokenAmount('0')
      return
    }

    // Calculate source token amount
    const sourceAmount = calculateTokenAmount(usdAmount, tokenData[sourceToken])
    setSourceTokenAmount(sourceAmount)

    // Calculate target token amount
    const targetAmount = calculateTokenAmount(usdAmount, tokenData[targetToken])
    setTargetTokenAmount(targetAmount)
  }, [sourceToken, targetToken, usdAmount, tokenData])

  // Calculate exchange rate
  const exchangeRate = calculateExchangeRate(
    tokenData[sourceToken],
    tokenData[targetToken]
  )

  return {
    sourceTokenAmount,
    targetTokenAmount,
    exchangeRate
  }
}