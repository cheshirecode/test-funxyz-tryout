import { Copy, ExternalLink, Check } from 'lucide-react'
import { formatAddress } from '../utils/helpers/addressUtils'
import { getChainName, getExplorerUrl } from '../utils/helpers/chainUtils'
import { useClipboard } from '../utils/hooks/ui/useClipboard'

interface ContractInfoProps {
  contractAddress?: string
  chainId?: string
  symbol: string
  className?: string
}

export const ContractInfo = ({ contractAddress, chainId = '1', symbol, className = '' }: ContractInfoProps) => {
  const { copied, copy } = useClipboard()

  if (!contractAddress) return null

  const handleCopy = () => {
    copy(contractAddress)
  }

  const handleExplorerClick = () => {
    window.open(getExplorerUrl(contractAddress, chainId), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`flex items-center gap-3 text-xs ${className}`}>
      {/* Chain Badge */}
      <div className='px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs font-medium'>
        {getChainName(chainId)}
      </div>

      {/* Contract Address */}
      <div className='flex items-center gap-1.5 px-2 py-1 bg-neutral-50 dark:bg-neutral-800/50 rounded-md border border-neutral-200/50 dark:border-neutral-700/50'>
        <span className='font-mono text-text-light-muted dark:text-text-dark-muted'>
          {formatAddress(contractAddress)}
        </span>
        <button
          onClick={handleCopy}
          className='p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors'
          title={`Copy ${symbol} contract address`}
          type='button'
        >
          {copied ? (
            <Check size={11} className='text-success-500' />
          ) : (
            <Copy size={11} className='text-text-light-muted dark:text-text-dark-muted hover:text-text-light-secondary dark:hover:text-text-dark-secondary' />
          )}
        </button>
      </div>

      {/* Explorer Link */}
      <button
        onClick={handleExplorerClick}
        className='flex items-center gap-1 px-2 py-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-md transition-all duration-150'
        title={`View ${symbol} on blockchain explorer`}
        type='button'
      >
        <ExternalLink size={11} />
        <span className='hidden sm:inline text-xs font-medium'>Explorer</span>
      </button>
    </div>
  )
}