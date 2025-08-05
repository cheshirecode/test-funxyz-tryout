import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'wouter'
import { InlineLoader, BlockLoader } from '../components/Loader'
import {
  apiClient as apiService,
  enhancedApiService,
  pricingService,
  tokenService,
  apiConfig,
  isDevelopment,
} from '@api'

function Demo() {
  const [demoUsdAmount, setDemoUsdAmount] = useState('100')
  const queryClient = useQueryClient()

  // Demo token calculation variables
  const demoSourcePrice = 1.0 // USDC price
  const demoTargetPrice = 3500 // ETH price
  const demoSourceAmount = demoUsdAmount
    ? (parseFloat(demoUsdAmount) / demoSourcePrice).toFixed(2)
    : '0'
  const demoTargetAmount = demoUsdAmount
    ? (parseFloat(demoUsdAmount) / demoTargetPrice).toFixed(6)
    : '0'
  const demoExchangeRate = (demoSourcePrice / demoTargetPrice).toFixed(6)

  // Example React Query usage with real funkit API service
  const { data, isLoading, error } = useQuery({
    queryKey: ['funkit-user-info'],
    queryFn: () => apiService.getFunkitUserInfo(),
  })

  // Funkit API integration examples using real @funkit/api-base
  const {
    data: apiData,
    isLoading: apiLoading,
    error: apiError,
    refetch: refetchApiData,
  } = useQuery({
    queryKey: ['funkit-api-demo'],
    queryFn: () => apiService.getFunkitAPIDemo(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Funkit API mutation example for getting user wallets
  const getUserWalletsMutation = useMutation({
    mutationFn: () => apiService.getFunkitUserWallets(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funkit-user-wallets'] })
    },
  })

  // Working API call for getting allowed assets (should work with just API key)
  const getAllowedAssetsMutation = useMutation({
    mutationFn: () => apiService.getFunkitAllowedAssets(),
    onSuccess: () => {
      console.log('✅ getAllowedAssets call completed')
    },
  })

  // Token service API testing
  const tokenServiceMutation = useMutation({
    mutationFn: () => tokenService.getTokens(),
    onSuccess: (data) => {
      console.log('✅ Token service call completed:', data)
    },
  })

  // Test user balances API
  const userBalancesMutation = useMutation({
    mutationFn: () => tokenService.getUserBalances(),
    onSuccess: (data) => {
      console.log('✅ User balances call completed:', data)
    },
  })

  const handleGetUserWallets = (e: React.FormEvent) => {
    e.preventDefault()
    getUserWalletsMutation.mutate()
  }

  const handleTestTokenService = () => {
    tokenServiceMutation.mutate()
  }

  const handleTestUserBalances = () => {
    userBalancesMutation.mutate()
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <header className='mb-12'>
          <div className='flex items-center mb-6'>
            <Link href='/swap'>
              <button className='p-2 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-gray-50 min-h-[44px] min-w-[44px] flex items-center justify-center transition-all duration-200 mr-4'>
                <ArrowLeft size={20} className='text-gray-600' />
              </button>
            </Link>
            <div className='flex-1 text-center'>
              <h1 className='text-4xl font-bold font-header text-gray-900 mb-4'>
                React + Vite + Tailwind CSS Demo
              </h1>
              <p className='text-lg text-gray-600'>
                Modern React development stack with React Query
              </p>
            </div>
          </div>
        </header>

        {/* React Query Demo */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-4'>
            React Query Demo (@funkit/api-base)
          </h2>
          <div className='mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md'>
            <p className='text-blue-700 font-medium'>ℹ️ Real API Integration:</p>
            <p className='text-blue-600 text-sm mt-1'>
              This calls getUserUniqueId() with demo authId 'demo-auth-id' which will fail with
              "User not found" since it's not a real user in the Funkit platform. This demonstrates
              authentic API error handling.
            </p>
          </div>
          {isLoading && <BlockLoader text='Loading API data...' />}
          {error && (
            <div className='p-4 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-red-700'>Error fetching data</p>
            </div>
          )}
          {data?.success && data.data && (
            <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
              <p className='text-green-700 font-medium'>{data.data.message}</p>
              <p className='text-green-600 text-sm mt-1'>
                Status: {data.success ? 'Success' : 'Failed'}
              </p>
              <p className='text-green-600 text-sm'>
                Fetched at: {new Date(data.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
          {data && !data.success && (
            <div className='p-4 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-red-700 font-medium'>Expected API Error (Demo):</p>
              <p className='text-red-600 text-sm mt-1'>{data.error}</p>
              {data.fallbackInfo && (
                <div className='mt-3 text-xs text-red-600'>
                  <p>
                    <strong>Note:</strong> {data.fallbackInfo.note}
                  </p>
                  {data.fallbackInfo.usedAuthId && (
                    <p>
                      <strong>Used authId:</strong> {data.fallbackInfo.usedAuthId}
                    </p>
                  )}
                </div>
              )}
              <p className='text-red-500 text-xs mt-2'>
                Timestamp: {new Date(data.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        {/* Funkit API Integration Demo */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
            Real Funkit API Integration (@funkit/api-base)
          </h2>

          {/* Environment Variables Display */}
          <div className='bg-gray-50 border border-gray-200 rounded-md p-4 mb-6'>
            <h3 className='text-lg font-medium text-gray-800 mb-3'>Environment Configuration</h3>
            <div className='text-sm text-gray-600'>
              <p>
                <strong>Environment:</strong> {isDevelopment ? 'Development' : 'Production'}
              </p>
              <p>
                <strong>API Base URL:</strong> {apiConfig.baseUrl}
              </p>
              <p>
                <strong>API Key:</strong> {apiConfig.apiKey.substring(0, 8)}...
              </p>
              <p>
                <strong>API Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded text-xs ${
                    apiData?.success
                      ? 'bg-green-100 text-green-800'
                      : apiData
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {apiData?.success ? '✅ Connected' : apiData ? '❌ Error' : '⏳ Testing...'}
                </span>
              </p>
            </div>
          </div>

          {/* API Data Fetch Demo */}
          <div className='mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-gray-800'>Funkit API Demo</h3>
              <button
                onClick={() => refetchApiData()}
                disabled={apiLoading}
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors'
              >
                {apiLoading ? <InlineLoader /> : 'Refresh Funkit API'}
              </button>
            </div>

            {apiLoading && (
              <div className='flex items-center justify-center p-4'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
                <span className='ml-2 text-gray-600'>Fetching API data...</span>
              </div>
            )}

            {apiError && (
              <div className='p-4 bg-red-50 border border-red-200 rounded-md'>
                <p className='text-red-700'>Error: {apiError.message}</p>
              </div>
            )}

            {apiData?.success && apiData.data && (
              <div className='p-4 bg-green-50 border border-green-200 rounded-md'>
                <p className='text-green-700 font-medium'>✅ API Health Check Successful</p>
                <div className='mt-2 text-sm text-green-600'>
                  <p>
                    <strong>Response Data:</strong> {JSON.stringify(apiData.data)}
                  </p>
                  <p className='mt-2'>
                    <strong>Timestamp:</strong> {new Date(apiData.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}

            {apiData && !apiData.success && apiData.fallbackInfo && (
              <div className='p-4 bg-orange-50 border border-orange-200 rounded-md'>
                <p className='text-orange-700 font-medium'>⚠️ {apiData.fallbackInfo.message}</p>
                <div className='mt-2 text-sm text-orange-600'>
                  <p>
                    <strong>API Configuration:</strong>
                  </p>
                  <p>
                    • Base URL: {apiData.fallbackInfo.configuration?.baseUrl || 'Not available'}
                  </p>
                  <p>• API Key: {apiData.fallbackInfo.configuration?.apiKey || 'Not available'}</p>
                  <p>
                    <strong>Available Functions:</strong>
                  </p>
                  <ul className='list-disc list-inside mt-1'>
                    {apiData.fallbackInfo.availableFunctions?.map((func: string, index: number) => (
                      <li key={index}>{func}</li>
                    ))}
                  </ul>
                  <p className='mt-2'>
                    <strong>Error:</strong> {apiData.error}
                  </p>
                  <p>
                    <strong>Timestamp:</strong> {new Date(apiData.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Comprehensive API Testing */}
          <div className='mb-6'>
            <h3 className='text-lg font-medium text-gray-800 mb-4'>Comprehensive API Testing</h3>

            {/* Allowed Assets Test */}
            <div className='space-y-4 mb-6'>
              <div className='p-3 bg-green-50 border border-green-200 rounded-md'>
                <p className='text-green-700 font-medium'>✅ Test 1: Get Allowed Assets</p>
                <p className='text-green-600 text-sm mt-1'>
                  getAllowedAssets() only requires the API key and should return real data from the
                  Funkit platform.
                </p>
              </div>

              <button
                onClick={() => getAllowedAssetsMutation.mutate()}
                disabled={getAllowedAssetsMutation.isPending}
                className='px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors'
              >
                {getAllowedAssetsMutation.isPending ? <InlineLoader /> : 'Test Get Allowed Assets'}
              </button>

              {getAllowedAssetsMutation.data && getAllowedAssetsMutation.data.success && (
                <div className='mt-4 p-4 bg-green-50 border border-green-200 rounded-md'>
                  <h4 className='font-medium text-green-800'>✅ Allowed Assets Success:</h4>
                  <pre className='mt-2 text-sm text-green-700 overflow-auto max-h-40'>
                    {JSON.stringify(getAllowedAssetsMutation.data, null, 2)}
                  </pre>
                </div>
              )}

              {getAllowedAssetsMutation.data && !getAllowedAssetsMutation.data.success && (
                <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-md'>
                  <h4 className='font-medium text-red-800'>❌ Allowed Assets Error:</h4>
                  <p className='text-red-700 text-sm mt-2'>{getAllowedAssetsMutation.data.error}</p>
                </div>
              )}
            </div>

            {/* Token Service Test */}
            <div className='space-y-4 mb-6'>
              <div className='p-3 bg-blue-50 border border-blue-200 rounded-md'>
                <p className='text-blue-700 font-medium'>🔍 Test 2: Token Service Integration</p>
                <p className='text-blue-600 text-sm mt-1'>
                  Tests the tokenService.getTokens() which uses getAllowedAssets() internally and
                  transforms the data.
                </p>
              </div>

              <button
                onClick={handleTestTokenService}
                disabled={tokenServiceMutation.isPending}
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors'
              >
                {tokenServiceMutation.isPending ? 'Loading...' : 'Test Token Service'}
              </button>

              {tokenServiceMutation.data && (
                <div className='mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md'>
                  <h4 className='font-medium text-blue-800'>✅ Token Service Result:</h4>
                  <div className='mt-2 text-sm text-blue-700'>
                    <p>
                      <strong>Available Tokens:</strong>{' '}
                      {Object.keys(tokenServiceMutation.data).join(', ')}
                    </p>
                    <pre className='mt-2 overflow-auto max-h-40'>
                      {JSON.stringify(tokenServiceMutation.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {tokenServiceMutation.error && (
                <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-md'>
                  <h4 className='font-medium text-red-800'>❌ Token Service Error:</h4>
                  <p className='text-red-700 text-sm mt-2'>{tokenServiceMutation.error.message}</p>
                </div>
              )}
            </div>

            {/* User Balances Test */}
            <div className='space-y-4'>
              <div className='p-3 bg-purple-50 border border-purple-200 rounded-md'>
                <p className='text-purple-700 font-medium'>👤 Test 3: User Balances</p>
                <p className='text-purple-600 text-sm mt-1'>
                  Tests getUserBalances() which calls getUserWalletIdentities() with demo values.
                </p>
              </div>

              <button
                onClick={handleTestUserBalances}
                disabled={userBalancesMutation.isPending}
                className='px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 transition-colors'
              >
                {userBalancesMutation.isPending ? 'Loading...' : 'Test User Balances'}
              </button>

              {userBalancesMutation.data && (
                <div className='mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md'>
                  <h4 className='font-medium text-purple-800'>✅ User Balances Result:</h4>
                  <div className='mt-2 text-sm text-purple-700'>
                    <p>
                      <strong>Balances:</strong>
                    </p>
                    <pre className='mt-2 overflow-auto max-h-40'>
                      {JSON.stringify(userBalancesMutation.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {userBalancesMutation.error && (
                <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-md'>
                  <h4 className='font-medium text-red-800'>❌ User Balances Error:</h4>
                  <p className='text-red-700 text-sm mt-2'>{userBalancesMutation.error.message}</p>
                </div>
              )}
            </div>
          </div>

          {/* Funkit API Mutation Demo */}
          <div>
            <h3 className='text-lg font-medium text-gray-800 mb-4'>
              Get User Wallets Demo (Mutation)
            </h3>
            <div className='space-y-4'>
              <div className='text-sm text-gray-600 space-y-2'>
                <p>
                  Click the button below to call the real @funkit/api-base getUserWalletIdentities()
                  function:
                </p>
                <div className='p-3 bg-amber-50 border border-amber-200 rounded-md'>
                  <p className='text-amber-700 font-medium'>⚠️ Expected Behavior:</p>
                  <p className='text-amber-600 text-xs mt-1'>
                    This call uses demo values (authId: 'demo-auth-id', walletAddr: '0x000...')
                    which will fail with "User not found" because they don't exist in the Funkit
                    platform. To succeed, you would need real authId and wallet address from your
                    Funkit account.
                  </p>
                </div>
              </div>
              <button
                onClick={handleGetUserWallets}
                disabled={getUserWalletsMutation.isPending}
                className='px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 transition-colors'
              >
                {getUserWalletsMutation.isPending ? 'Getting Wallets...' : 'Get User Wallets'}
              </button>

              {getUserWalletsMutation.data && getUserWalletsMutation.data.success && (
                <div className='mt-4 p-4 bg-green-50 border border-green-200 rounded-md'>
                  <h4 className='font-medium text-green-800'>✅ Wallet Query Success:</h4>
                  <pre className='mt-2 text-sm text-green-700 overflow-auto'>
                    {JSON.stringify(getUserWalletsMutation.data, null, 2)}
                  </pre>
                </div>
              )}

              {getUserWalletsMutation.data && !getUserWalletsMutation.data.success && (
                <div className='mt-4 p-4 bg-orange-50 border border-orange-200 rounded-md'>
                  <h4 className='font-medium text-orange-800'>
                    ⚠️ Expected API Error (Demo Values):
                  </h4>
                  <p className='text-orange-700 text-sm mt-2'>
                    <strong>Error:</strong> {getUserWalletsMutation.data.error}
                  </p>
                  {getUserWalletsMutation.data.fallbackInfo && (
                    <div className='mt-3 text-xs text-orange-600 space-y-1'>
                      <p>
                        <strong>Function:</strong>{' '}
                        {getUserWalletsMutation.data.fallbackInfo.apiFunction}
                      </p>
                      <p>
                        <strong>Note:</strong> {getUserWalletsMutation.data.fallbackInfo.note}
                      </p>
                      {getUserWalletsMutation.data.fallbackInfo.usedAuthId && (
                        <p>
                          <strong>Used authId:</strong>{' '}
                          {getUserWalletsMutation.data.fallbackInfo.usedAuthId}
                        </p>
                      )}
                      {getUserWalletsMutation.data.fallbackInfo.usedWalletAddr && (
                        <p>
                          <strong>Used walletAddr:</strong>{' '}
                          {getUserWalletsMutation.data.fallbackInfo.usedWalletAddr}
                        </p>
                      )}
                      {getUserWalletsMutation.data.fallbackInfo.docs && (
                        <p>
                          <strong>Docs:</strong>{' '}
                          <a
                            href={getUserWalletsMutation.data.fallbackInfo.docs}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-600 underline'
                          >
                            {getUserWalletsMutation.data.fallbackInfo.docs}
                          </a>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {getUserWalletsMutation.error && (
                <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-md'>
                  <h4 className='font-medium text-red-800'>Mutation Error:</h4>
                  <p className='mt-2 text-sm text-red-700'>
                    {getUserWalletsMutation.error.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Token Swap Integration Test */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <h2 className='text-2xl font-semibold text-gray-800 mb-6'>Token Swap Integration Test</h2>

          <div className='space-y-4'>
            <div className='p-3 bg-indigo-50 border border-indigo-200 rounded-md'>
              <p className='text-indigo-700 font-medium'>🔄 Test Token Swap with Real API Data</p>
              <p className='text-indigo-600 text-sm mt-1'>
                This tests the complete token swap flow using real Funkit API data with live
                calculations.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='p-4 border border-gray-200 rounded-lg'>
                <h4 className='font-medium text-gray-800 mb-2'>USD Input</h4>
                <input
                  type='number'
                  placeholder='Enter USD amount'
                  className='w-full p-2 border border-gray-300 rounded-md'
                  value={demoUsdAmount}
                  onChange={(e) => setDemoUsdAmount(e.target.value)}
                />
                <p className='text-xs text-gray-500 mt-1'>Primary input for token calculations</p>
              </div>

              <div className='p-4 border border-gray-200 rounded-lg'>
                <h4 className='font-medium text-gray-800 mb-2'>Source Token (USDC)</h4>
                <div className='text-sm text-gray-600'>
                  <p>
                    Amount: <span className='font-medium'>{demoSourceAmount}</span>
                  </p>
                  <p>
                    Price: <span className='font-medium'>${demoSourcePrice}</span>
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>Calculated from USD input</p>
                </div>
              </div>

              <div className='p-4 border border-gray-200 rounded-lg'>
                <h4 className='font-medium text-gray-800 mb-2'>Target Token (ETH)</h4>
                <div className='text-sm text-gray-600'>
                  <p>
                    Amount: <span className='font-medium'>{demoTargetAmount}</span>
                  </p>
                  <p>
                    Price: <span className='font-medium'>${demoTargetPrice}</span>
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>Calculated from USD input</p>
                </div>
              </div>
            </div>

            <div className='p-4 border border-gray-200 rounded-lg'>
              <h4 className='font-medium text-gray-800 mb-3'>Live Exchange Rate</h4>
              <div className='text-sm text-gray-600'>
                <p>
                  1 USDC ≈ <span className='font-medium'>{demoExchangeRate}</span> ETH
                </p>
                <p>
                  1 ETH ≈ <span className='font-medium'>${demoTargetPrice}</span>
                </p>
                <p className='text-xs text-gray-500 mt-2'>
                  * Real-time calculations using Funkit API data
                </p>
              </div>
            </div>

            <div className='p-3 bg-green-50 border border-green-200 rounded-md'>
              <p className='text-green-700 font-medium'>✅ Live Integration Working</p>
              <p className='text-green-600 text-sm mt-1'>
                Token calculations are happening in real-time using actual Funkit API prices. Change
                the USD amount above to see live token conversions!
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced API Capabilities Demo */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <h2 className='text-2xl font-semibold font-header text-gray-800 mb-6'>
            Enhanced @funkit/api-base Capabilities
          </h2>
          <p className='text-gray-600 mb-6'>
            Explore 124 additional functions beyond the basic 4 currently used. This demo showcases
            portfolio management, gas estimation, chain information, NFT metadata, and security
            features.
          </p>

          <EnhancedAPIDemo />
        </div>

        {/* Real-time Pricing & Gas Demo */}
        <div className='bg-white rounded-lg shadow-lg p-8 mb-8'>
          <h2 className='text-2xl font-semibold font-header text-gray-800 mb-6'>
            Real-time Pricing & Gas Estimation
          </h2>
          <p className='text-gray-600 mb-6'>
            Live demonstration of getAssetPriceInfo and getUserOpGasPrice integration for real token
            pricing and gas costs.
          </p>

          <PricingDemo />
        </div>
      </div>
    </div>
  )
}

// Enhanced API Demo Component
function EnhancedAPIDemo() {
  const [walletAddress, setWalletAddress] = useState('0x742d35Cc6634C0532925a3b8D84D8C23F8A76542')
  const [chainId, setChainId] = useState('1')

  // Enhanced API Demo Query
  const enhancedDemoQuery = useQuery({
    queryKey: ['enhanced-api-demo', walletAddress, chainId],
    queryFn: () => enhancedApiService.getEnhancedAPIDemo(walletAddress as `0x${string}`, chainId),
    enabled: false, // Only run when manually triggered
  })

  // Individual capability queries
  const portfolioQuery = useQuery({
    queryKey: ['portfolio', walletAddress, chainId],
    queryFn: () => enhancedApiService.getWalletPortfolio(walletAddress as `0x${string}`, chainId),
    enabled: false,
  })

  const chainInfoQuery = useQuery({
    queryKey: ['chain-info', chainId],
    queryFn: () => enhancedApiService.getChainInformation(chainId),
    enabled: false,
  })

  const gasEstimationQuery = useQuery({
    queryKey: ['gas-estimation', chainId],
    queryFn: () => enhancedApiService.getGasEstimation(chainId),
    enabled: false,
  })

  // New enhanced capability queries
  const fiatIntegrationQuery = useQuery({
    queryKey: ['fiat-integration'],
    queryFn: () => enhancedApiService.getFiatIntegrationDemo('100', 'USD'),
    enabled: false,
  })

  const operationManagementQuery = useQuery({
    queryKey: ['operation-management', chainId],
    queryFn: () => enhancedApiService.getOperationManagementDemo(chainId),
    enabled: false,
  })

  const bridgeBankingQuery = useQuery({
    queryKey: ['bridge-banking'],
    queryFn: () => enhancedApiService.getBridgeBankingDemo(),
    enabled: false,
  })

  const riskAssessmentQuery = useQuery({
    queryKey: ['risk-assessment', walletAddress],
    queryFn: () => enhancedApiService.getAddressRiskAssessment(walletAddress as `0x${string}`),
    enabled: false,
  })

  return (
    <div className='space-y-6'>
      {/* Configuration Inputs */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Demo Wallet Address
          </label>
          <input
            type='text'
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
            placeholder='0x...'
          />
        </div>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Chain ID</label>
          <select
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
          >
            <option value='1'>Ethereum (1)</option>
            <option value='137'>Polygon (137)</option>
            <option value='8453'>Base (8453)</option>
            <option value='42161'>Arbitrum (42161)</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex flex-wrap gap-2'>
        <button
          onClick={() => enhancedDemoQuery.refetch()}
          disabled={enhancedDemoQuery.isFetching}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm'
        >
          {enhancedDemoQuery.isFetching ? 'Running...' : 'Run Complete Demo'}
        </button>
        <button
          onClick={() => portfolioQuery.refetch()}
          disabled={portfolioQuery.isFetching}
          className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm'
        >
          {portfolioQuery.isFetching ? <InlineLoader /> : 'Get Portfolio'}
        </button>
        <button
          onClick={() => chainInfoQuery.refetch()}
          disabled={chainInfoQuery.isFetching}
          className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm'
        >
          {chainInfoQuery.isFetching ? 'Loading...' : 'Get Chain Info'}
        </button>
        <button
          onClick={() => gasEstimationQuery.refetch()}
          disabled={gasEstimationQuery.isFetching}
          className='px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 text-sm'
        >
          {gasEstimationQuery.isFetching ? 'Loading...' : 'Get Gas Price'}
        </button>
        <button
          onClick={() => fiatIntegrationQuery.refetch()}
          disabled={fiatIntegrationQuery.isFetching}
          className='px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50 text-sm'
        >
          {fiatIntegrationQuery.isFetching ? 'Loading...' : 'Test Fiat Integration'}
        </button>
        <button
          onClick={() => operationManagementQuery.refetch()}
          disabled={operationManagementQuery.isFetching}
          className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm'
        >
          {operationManagementQuery.isFetching ? 'Loading...' : 'Test Operations'}
        </button>
        <button
          onClick={() => bridgeBankingQuery.refetch()}
          disabled={bridgeBankingQuery.isFetching}
          className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50 text-sm'
        >
          {bridgeBankingQuery.isFetching ? 'Loading...' : 'Test Bridge Banking'}
        </button>
        <button
          onClick={() => riskAssessmentQuery.refetch()}
          disabled={riskAssessmentQuery.isFetching}
          className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm'
        >
          {riskAssessmentQuery.isFetching ? 'Loading...' : 'Test Risk Assessment'}
        </button>
      </div>

      {/* Results Display */}
      <div className='space-y-4'>
        {/* Complete Demo Results */}
        {enhancedDemoQuery.data && (
          <div className='p-4 bg-blue-50 rounded-lg'>
            <h4 className='font-medium text-blue-800 mb-3'>✨ Complete Enhanced Demo Results</h4>
            <pre className='text-xs bg-white p-3 rounded border overflow-auto max-h-96'>
              {JSON.stringify(enhancedDemoQuery.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Portfolio Results */}
        {portfolioQuery.data && (
          <div className='p-4 bg-green-50 rounded-lg'>
            <h4 className='font-medium text-green-800 mb-3'>🎯 Portfolio Management Results</h4>
            <pre className='text-xs bg-white p-3 rounded border overflow-auto max-h-64'>
              {JSON.stringify(portfolioQuery.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Chain Info Results */}
        {chainInfoQuery.data && (
          <div className='p-4 bg-purple-50 rounded-lg'>
            <h4 className='font-medium text-purple-800 mb-3'>⛓️ Chain Information Results</h4>
            <pre className='text-xs bg-white p-3 rounded border overflow-auto max-h-64'>
              {JSON.stringify(chainInfoQuery.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Gas Estimation Results */}
        {gasEstimationQuery.data && (
          <div className='p-4 bg-orange-50 rounded-lg'>
            <h4 className='font-medium text-orange-800 mb-3'>⛽ Gas Estimation Results</h4>
            <pre className='text-xs bg-white p-3 rounded border overflow-auto max-h-64'>
              {JSON.stringify(gasEstimationQuery.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Fiat Integration Results */}
        {fiatIntegrationQuery.data && (
          <div className='p-4 bg-pink-50 rounded-lg'>
            <h4 className='font-medium text-pink-800 mb-3'>💳 Fiat Integration Results</h4>
            <pre className='text-xs bg-white p-3 rounded border overflow-auto max-h-64'>
              {JSON.stringify(fiatIntegrationQuery.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Operation Management Results */}
        {operationManagementQuery.data && (
          <div className='p-4 bg-indigo-50 rounded-lg'>
            <h4 className='font-medium text-indigo-800 mb-3'>⚙️ Operation Management Results</h4>
            <pre className='text-xs bg-white p-3 rounded border overflow-auto max-h-64'>
              {JSON.stringify(operationManagementQuery.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Bridge Banking Results */}
        {bridgeBankingQuery.data && (
          <div className='p-4 bg-teal-50 rounded-lg'>
            <h4 className='font-medium text-teal-800 mb-3'>🏦 Bridge Banking Results</h4>
            <pre className='text-xs bg-white p-3 rounded border overflow-auto max-h-64'>
              {JSON.stringify(bridgeBankingQuery.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Risk Assessment Results */}
        {riskAssessmentQuery.data && (
          <div className='p-4 bg-red-50 rounded-lg'>
            <h4 className='font-medium text-red-800 mb-3'>🔒 Risk Assessment Results</h4>
            <pre className='text-xs bg-white p-3 rounded border overflow-auto max-h-64'>
              {JSON.stringify(riskAssessmentQuery.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Error States */}
        {(enhancedDemoQuery.error ||
          portfolioQuery.error ||
          chainInfoQuery.error ||
          gasEstimationQuery.error ||
          fiatIntegrationQuery.error ||
          operationManagementQuery.error ||
          bridgeBankingQuery.error ||
          riskAssessmentQuery.error) && (
          <div className='p-4 bg-red-50 rounded-lg'>
            <h4 className='font-medium text-red-800 mb-3'>❌ Errors</h4>
            {enhancedDemoQuery.error && (
              <p className='text-sm text-red-700 mb-2'>
                Complete Demo: {enhancedDemoQuery.error.message}
              </p>
            )}
            {portfolioQuery.error && (
              <p className='text-sm text-red-700 mb-2'>Portfolio: {portfolioQuery.error.message}</p>
            )}
            {chainInfoQuery.error && (
              <p className='text-sm text-red-700 mb-2'>
                Chain Info: {chainInfoQuery.error.message}
              </p>
            )}
            {gasEstimationQuery.error && (
              <p className='text-sm text-red-700 mb-2'>
                Gas Estimation: {gasEstimationQuery.error.message}
              </p>
            )}
            {fiatIntegrationQuery.error && (
              <p className='text-sm text-red-700 mb-2'>
                Fiat Integration: {fiatIntegrationQuery.error.message}
              </p>
            )}
            {operationManagementQuery.error && (
              <p className='text-sm text-red-700 mb-2'>
                Operation Management: {operationManagementQuery.error.message}
              </p>
            )}
            {bridgeBankingQuery.error && (
              <p className='text-sm text-red-700 mb-2'>
                Bridge Banking: {bridgeBankingQuery.error.message}
              </p>
            )}
            {riskAssessmentQuery.error && (
              <p className='text-sm text-red-700 mb-2'>
                Risk Assessment: {riskAssessmentQuery.error.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Information Panel */}
      <div className='p-4 bg-blue-50 rounded-lg'>
        <h4 className='font-medium text-blue-800 mb-3'>📘 Enhanced Capabilities Overview</h4>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
          <div>
            <h5 className='font-medium text-gray-800 mb-2'>Portfolio Management</h5>
            <ul className='text-gray-600 space-y-1'>
              <li>• Complete token holdings</li>
              <li>• NFT collection data</li>
              <li>• Multi-chain balances</li>
              <li>• Asset metadata</li>
            </ul>
          </div>
          <div>
            <h5 className='font-medium text-gray-800 mb-2'>Transaction & Gas</h5>
            <ul className='text-gray-600 space-y-1'>
              <li>• Real-time gas pricing</li>
              <li>• Operation estimation</li>
              <li>• Transaction receipts</li>
              <li>• Chain information</li>
            </ul>
          </div>
          <div>
            <h5 className='font-medium text-gray-800 mb-2'>Security & Risk</h5>
            <ul className='text-gray-600 space-y-1'>
              <li>• Address risk assessment</li>
              <li>• Transaction monitoring</li>
              <li>• Compliance checks</li>
              <li>• Fraud detection</li>
            </ul>
          </div>
          <div>
            <h5 className='font-medium text-gray-800 mb-2'>Fiat Integration</h5>
            <ul className='text-gray-600 space-y-1'>
              <li>• Stripe payment sessions</li>
              <li>• Moonpay integration</li>
              <li>• Meld fiat limits</li>
              <li>• On/off ramp quotes</li>
            </ul>
          </div>
          <div>
            <h5 className='font-medium text-gray-800 mb-2'>Operation Management</h5>
            <ul className='text-gray-600 space-y-1'>
              <li>• Transaction estimation</li>
              <li>• Operation lifecycle</li>
              <li>• User operations</li>
              <li>• Gas optimization</li>
            </ul>
          </div>
          <div>
            <h5 className='font-medium text-gray-800 mb-2'>Bridge & Banking</h5>
            <ul className='text-gray-600 space-y-1'>
              <li>• Traditional banking</li>
              <li>• Customer management</li>
              <li>• Bank account linking</li>
              <li>• Fiat on/off ramps</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// Real-time Pricing Demo Component
function PricingDemo() {
  const [chainId, setChainId] = useState('1')

  // Pricing Demo Query
  const pricingDemoQuery = useQuery({
    queryKey: ['pricing-demo', chainId],
    queryFn: () => pricingService.getPricingDemo(chainId),
    enabled: false, // Only run when manually triggered
  })

  // Individual token price queries for live demonstration
  const usdcPriceQuery = useQuery({
    queryKey: ['usdc-price', chainId],
    queryFn: () => pricingService.getTokenBySymbol(chainId, 'USDC'),
    enabled: false,
  })

  const ethPriceQuery = useQuery({
    queryKey: ['eth-price', chainId],
    queryFn: () => pricingService.getTokenBySymbol(chainId, 'ETH'),
    enabled: false,
  })

  const gasQuery = useQuery({
    queryKey: ['gas-prices', chainId],
    queryFn: () => pricingService.getGasPrice(chainId),
    enabled: false,
  })

  const swapRateQuery = useQuery({
    queryKey: ['swap-rate-demo', chainId],
    queryFn: () => pricingService.getSwapRate(chainId, 'USDC', chainId, 'ETH', '1000'),
    enabled: false,
  })

  return (
    <div className='space-y-6'>
      {/* Configuration */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Chain ID</label>
          <select
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
          >
            <option value='1'>Ethereum (1)</option>
            <option value='137'>Polygon (137)</option>
            <option value='8453'>Base (8453)</option>
          </select>
        </div>
        <div className='flex items-end'>
          <div className='text-sm text-gray-600'>
            <p>
              <strong>Functions demonstrated:</strong>
            </p>
            <p>• getAssetPriceInfo() - Real token prices</p>
            <p>• getUserOpGasPrice() - Live gas estimation</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex flex-wrap gap-2'>
        <button
          onClick={() => pricingDemoQuery.refetch()}
          disabled={pricingDemoQuery.isFetching}
          className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm'
        >
          {pricingDemoQuery.isFetching ? 'Running...' : 'Run Full Demo'}
        </button>
        <button
          onClick={() => usdcPriceQuery.refetch()}
          disabled={usdcPriceQuery.isFetching}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm'
        >
          {usdcPriceQuery.isFetching ? <InlineLoader /> : 'Get USDC Price'}
        </button>
        <button
          onClick={() => ethPriceQuery.refetch()}
          disabled={ethPriceQuery.isFetching}
          className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 text-sm'
        >
          {ethPriceQuery.isFetching ? 'Loading...' : 'Get ETH Price'}
        </button>
        <button
          onClick={() => gasQuery.refetch()}
          disabled={gasQuery.isFetching}
          className='px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 text-sm'
        >
          {gasQuery.isFetching ? 'Loading...' : 'Get Gas Prices'}
        </button>
        <button
          onClick={() => swapRateQuery.refetch()}
          disabled={swapRateQuery.isFetching}
          className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm'
        >
          {swapRateQuery.isFetching ? 'Loading...' : 'Calculate Swap Rate'}
        </button>
      </div>

      {/* Results Display */}
      <div className='space-y-4'>
        {/* Full Demo Results */}
        {pricingDemoQuery.data && (
          <div className='p-4 bg-green-50 rounded-lg'>
            <h4 className='font-medium text-green-800 mb-3'>🚀 Complete Pricing Demo Results</h4>
            <pre className='text-xs bg-white p-3 rounded border overflow-auto max-h-96'>
              {JSON.stringify(pricingDemoQuery.data, null, 2)}
            </pre>
          </div>
        )}

        {/* Individual Price Results */}
        {usdcPriceQuery.data && (
          <div className='p-4 bg-blue-50 rounded-lg'>
            <h4 className='font-medium text-blue-800 mb-3'>💰 USDC Price Information</h4>
            {usdcPriceQuery.data.success ? (
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p>
                    <strong>Price:</strong> $
                    {usdcPriceQuery.data?.data?.priceUsd?.toFixed(4) ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Symbol:</strong> {usdcPriceQuery.data?.data?.symbol ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Name:</strong> {usdcPriceQuery.data?.data?.name ?? 'N/A'}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Chain ID:</strong> {usdcPriceQuery.data?.data?.chainId ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Decimals:</strong> {usdcPriceQuery.data?.data?.decimals ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Address:</strong>{' '}
                    {usdcPriceQuery.data?.data?.tokenAddress?.substring(0, 10) ?? 'N/A'}...
                  </p>
                </div>
              </div>
            ) : (
              <p className='text-red-600'>{usdcPriceQuery.data.error}</p>
            )}
          </div>
        )}

        {ethPriceQuery.data && (
          <div className='p-4 bg-purple-50 rounded-lg'>
            <h4 className='font-medium text-purple-800 mb-3'>⚡ ETH Price Information</h4>
            {ethPriceQuery.data.success ? (
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p>
                    <strong>Price:</strong> $
                    {ethPriceQuery.data?.data?.priceUsd?.toFixed(2) ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Symbol:</strong> {ethPriceQuery.data?.data?.symbol ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Name:</strong> {ethPriceQuery.data?.data?.name ?? 'N/A'}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Chain ID:</strong> {ethPriceQuery.data?.data?.chainId ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Decimals:</strong> {ethPriceQuery.data?.data?.decimals ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Address:</strong>{' '}
                    {ethPriceQuery.data?.data?.tokenAddress?.substring(0, 10) ?? 'N/A'}...
                  </p>
                </div>
              </div>
            ) : (
              <p className='text-red-600'>{ethPriceQuery.data.error}</p>
            )}
          </div>
        )}

        {gasQuery.data && (
          <div className='p-4 bg-orange-50 rounded-lg'>
            <h4 className='font-medium text-orange-800 mb-3'>⛽ Gas Price Information</h4>
            {gasQuery.data.success ? (
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p>
                    <strong>Gas Price:</strong>{' '}
                    {gasQuery.data?.data?.gasPriceGwei?.toFixed(2) ?? 'N/A'} Gwei
                  </p>
                  <p>
                    <strong>Simple Transfer:</strong> $
                    {(
                      (gasQuery.data?.data?.estimatedCosts?.simpleTransfer?.costEth ?? 0) * 3500
                    ).toFixed(3)}
                  </p>
                  <p>
                    <strong>Token Swap:</strong> $
                    {(
                      (gasQuery.data?.data?.estimatedCosts?.tokenSwap?.costEth ?? 0) * 3500
                    ).toFixed(3)}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Chain ID:</strong> {gasQuery.data?.data?.chainId ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Simple Transfer:</strong>{' '}
                    {gasQuery.data?.data?.estimatedCosts?.simpleTransfer?.costEth?.toFixed(6) ??
                      'N/A'}{' '}
                    ETH
                  </p>
                  <p>
                    <strong>Token Swap:</strong>{' '}
                    {gasQuery.data?.data?.estimatedCosts?.tokenSwap?.costEth?.toFixed(6) ?? 'N/A'}{' '}
                    ETH
                  </p>
                </div>
              </div>
            ) : (
              <p className='text-red-600'>{gasQuery.data.error}</p>
            )}
          </div>
        )}

        {swapRateQuery.data && (
          <div className='p-4 bg-red-50 rounded-lg'>
            <h4 className='font-medium text-red-800 mb-3'>🔄 Swap Rate Calculation</h4>
            {swapRateQuery.data.success ? (
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p>
                    <strong>Input:</strong> 1000 USDC
                  </p>
                  <p>
                    <strong>Output:</strong>{' '}
                    {swapRateQuery.data?.data?.outputAmount?.toFixed(6) ?? 'N/A'} ETH
                  </p>
                  <p>
                    <strong>Exchange Rate:</strong> 1 USDC ={' '}
                    {swapRateQuery.data?.data?.exchangeRate?.toFixed(6) ?? 'N/A'} ETH
                  </p>
                </div>
                <div>
                  <p>
                    <strong>USDC Price:</strong> $
                    {swapRateQuery.data?.data?.fromPrice?.toFixed(4) ?? 'N/A'}
                  </p>
                  <p>
                    <strong>ETH Price:</strong> $
                    {swapRateQuery.data?.data?.toPrice?.toFixed(2) ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Route:</strong> {swapRateQuery.data?.data?.route ?? 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <p className='text-red-600'>{swapRateQuery.data.error}</p>
            )}
          </div>
        )}

        {/* Information Panel */}
        <div className='p-4 bg-blue-50 rounded-lg'>
          <h4 className='font-medium text-blue-800 mb-3'>📘 Integration Benefits</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
            <div>
              <h5 className='font-medium text-gray-800 mb-2'>Real-time Data</h5>
              <ul className='text-gray-600 space-y-1'>
                <li>• Live token prices from market data</li>
                <li>• Current gas prices for accurate costs</li>
                <li>• Real exchange rate calculations</li>
                <li>• Automatic price updates</li>
              </ul>
            </div>
            <div>
              <h5 className='font-medium text-gray-800 mb-2'>Enhanced UX</h5>
              <ul className='text-gray-600 space-y-1'>
                <li>• Accurate transaction cost estimates</li>
                <li>• Real market price display</li>
                <li>• Live vs estimated indicators</li>
                <li>• Comprehensive transaction info</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Demo
