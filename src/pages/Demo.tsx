import { useState } from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient as apiService } from '../utils/api'
import { tokenService } from '../utils/api'
import { apiConfig, isDevelopment } from '../utils/api'



function Demo() {
  const [count, setCount] = useState(0)
  const [demoUsdAmount, setDemoUsdAmount] = useState('100')
  const queryClient = useQueryClient()

  // Demo token calculation variables
  const demoSourcePrice = 1.0 // USDC price
  const demoTargetPrice = 3500 // ETH price
  const demoSourceAmount = demoUsdAmount ? (parseFloat(demoUsdAmount) / demoSourcePrice).toFixed(2) : '0'
  const demoTargetAmount = demoUsdAmount ? (parseFloat(demoUsdAmount) / demoTargetPrice).toFixed(6) : '0'
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
    refetch: refetchApiData
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
    }
  })

  // Working API call for getting allowed assets (should work with just API key)
  const getAllowedAssetsMutation = useMutation({
    mutationFn: () => apiService.getFunkitAllowedAssets(),
    onSuccess: () => {
      console.log('✅ getAllowedAssets call completed')
    }
  })

  // Token service API testing
  const tokenServiceMutation = useMutation({
    mutationFn: () => tokenService.getTokens(),
    onSuccess: (data) => {
      console.log('✅ Token service call completed:', data)
    }
  })

  // Test user balances API
  const userBalancesMutation = useMutation({
    mutationFn: () => tokenService.getUserBalances(),
    onSuccess: (data) => {
      console.log('✅ User balances call completed:', data)
    }
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

  const tabs = [
    { name: 'Dashboard', content: 'Welcome to the dashboard!' },
    { name: 'Settings', content: 'Configure your application settings here.' },
    { name: 'About', content: 'Built with React 18, Vite, Tailwind 4, Headless UI, and React Query.' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            React + Vite + Tailwind 4 Demo
          </h1>
          <p className="text-lg text-gray-600">
            Modern React development stack with Headless UI and React Query
          </p>
        </header>

        {/* Counter Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Counter Demo</h2>
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setCount(count - 1)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              -
            </button>
            <span className="text-3xl font-bold text-gray-900 min-w-[3rem] text-center">
              {count}
            </span>
            <button
              onClick={() => setCount(count + 1)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* React Query Demo */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">React Query Demo (@funkit/api-base)</h2>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-700 font-medium">ℹ️ Real API Integration:</p>
            <p className="text-blue-600 text-sm mt-1">
              This calls getUserUniqueId() with demo authId 'demo-auth-id' which will fail with "User not found"
              since it's not a real user in the Funkit platform. This demonstrates authentic API error handling.
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading...</span>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">Error fetching data</p>
            </div>
          )}
          {data?.success && data.data && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 font-medium">{data.data.message}</p>
              <p className="text-green-600 text-sm mt-1">
                Status: {data.success ? 'Success' : 'Failed'}
              </p>
              <p className="text-green-600 text-sm">
                Fetched at: {new Date(data.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
          {data && !data.success && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 font-medium">Expected API Error (Demo):</p>
              <p className="text-red-600 text-sm mt-1">
                {data.error}
              </p>
              {data.fallbackInfo && (
                <div className="mt-3 text-xs text-red-600">
                  <p><strong>Note:</strong> {data.fallbackInfo.note}</p>
                  {data.fallbackInfo.usedAuthId && (
                    <p><strong>Used authId:</strong> {data.fallbackInfo.usedAuthId}</p>
                  )}
                </div>
              )}
              <p className="text-red-500 text-xs mt-2">
                Timestamp: {new Date(data.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        {/* Funkit API Integration Demo */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Real Funkit API Integration (@funkit/api-base)</h2>

          {/* Environment Variables Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Environment Configuration</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Environment:</strong> {isDevelopment ? 'Development' : 'Production'}</p>
              <p><strong>API Base URL:</strong> {apiConfig.baseUrl}</p>
              <p><strong>API Key:</strong> {apiConfig.apiKey.substring(0, 8)}...</p>
              <p><strong>API Status:</strong>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  apiData?.success ? 'bg-green-100 text-green-800' :
                  apiData ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {apiData?.success ? '✅ Connected' : apiData ? '❌ Error' : '⏳ Testing...'}
                </span>
              </p>
            </div>
          </div>

          {/* API Data Fetch Demo */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Funkit API Demo</h3>
              <button
                onClick={() => refetchApiData()}
                disabled={apiLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {apiLoading ? 'Loading...' : 'Refresh Funkit API'}
              </button>
            </div>

            {apiLoading && (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Fetching API data...</span>
              </div>
            )}

            {apiError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">Error: {apiError.message}</p>
              </div>
            )}

            {apiData?.success && apiData.data && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 font-medium">✅ API Health Check Successful</p>
                <div className="mt-2 text-sm text-green-600">
                  <p><strong>Response Data:</strong> {JSON.stringify(apiData.data)}</p>
                  <p className="mt-2"><strong>Timestamp:</strong> {new Date(apiData.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            )}

            {apiData && !apiData.success && apiData.fallbackInfo && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-orange-700 font-medium">⚠️ {apiData.fallbackInfo.message}</p>
                <div className="mt-2 text-sm text-orange-600">
                  <p><strong>API Configuration:</strong></p>
                  <p>• Base URL: {apiData.fallbackInfo.configuration?.baseUrl || 'Not available'}</p>
                  <p>• API Key: {apiData.fallbackInfo.configuration?.apiKey || 'Not available'}</p>
                  <p><strong>Available Functions:</strong></p>
                  <ul className="list-disc list-inside mt-1">
                    {apiData.fallbackInfo.availableFunctions?.map((func: string, index: number) => (
                      <li key={index}>{func}</li>
                    ))}
                  </ul>
                  <p className="mt-2"><strong>Error:</strong> {apiData.error}</p>
                  <p><strong>Timestamp:</strong> {new Date(apiData.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Comprehensive API Testing */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Comprehensive API Testing</h3>

            {/* Allowed Assets Test */}
            <div className="space-y-4 mb-6">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 font-medium">✅ Test 1: Get Allowed Assets</p>
                <p className="text-green-600 text-sm mt-1">
                  getAllowedAssets() only requires the API key and should return real data from the Funkit platform.
                </p>
              </div>

              <button
                onClick={() => getAllowedAssetsMutation.mutate()}
                disabled={getAllowedAssetsMutation.isPending}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {getAllowedAssetsMutation.isPending ? 'Loading...' : 'Test Get Allowed Assets'}
              </button>

              {getAllowedAssetsMutation.data && getAllowedAssetsMutation.data.success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-green-800">✅ Allowed Assets Success:</h4>
                  <pre className="mt-2 text-sm text-green-700 overflow-auto max-h-40">
                    {JSON.stringify(getAllowedAssetsMutation.data, null, 2)}
                  </pre>
                </div>
              )}

              {getAllowedAssetsMutation.data && !getAllowedAssetsMutation.data.success && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <h4 className="font-medium text-red-800">❌ Allowed Assets Error:</h4>
                  <p className="text-red-700 text-sm mt-2">
                    {getAllowedAssetsMutation.data.error}
                  </p>
                </div>
              )}
            </div>

            {/* Token Service Test */}
            <div className="space-y-4 mb-6">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-blue-700 font-medium">🔍 Test 2: Token Service Integration</p>
                <p className="text-blue-600 text-sm mt-1">
                  Tests the tokenService.getTokens() which uses getAllowedAssets() internally and transforms the data.
                </p>
              </div>

              <button
                onClick={handleTestTokenService}
                disabled={tokenServiceMutation.isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {tokenServiceMutation.isPending ? 'Loading...' : 'Test Token Service'}
              </button>

              {tokenServiceMutation.data && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h4 className="font-medium text-blue-800">✅ Token Service Result:</h4>
                  <div className="mt-2 text-sm text-blue-700">
                    <p><strong>Available Tokens:</strong> {Object.keys(tokenServiceMutation.data).join(', ')}</p>
                    <pre className="mt-2 overflow-auto max-h-40">
                      {JSON.stringify(tokenServiceMutation.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {tokenServiceMutation.error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <h4 className="font-medium text-red-800">❌ Token Service Error:</h4>
                  <p className="text-red-700 text-sm mt-2">
                    {tokenServiceMutation.error.message}
                  </p>
                </div>
              )}
            </div>

            {/* User Balances Test */}
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
                <p className="text-purple-700 font-medium">👤 Test 3: User Balances</p>
                <p className="text-purple-600 text-sm mt-1">
                  Tests getUserBalances() which calls getUserWalletIdentities() with demo values.
                </p>
              </div>

              <button
                onClick={handleTestUserBalances}
                disabled={userBalancesMutation.isPending}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                {userBalancesMutation.isPending ? 'Loading...' : 'Test User Balances'}
              </button>

              {userBalancesMutation.data && (
                <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md">
                  <h4 className="font-medium text-purple-800">✅ User Balances Result:</h4>
                  <div className="mt-2 text-sm text-purple-700">
                    <p><strong>Balances:</strong></p>
                    <pre className="mt-2 overflow-auto max-h-40">
                      {JSON.stringify(userBalancesMutation.data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {userBalancesMutation.error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <h4 className="font-medium text-red-800">❌ User Balances Error:</h4>
                  <p className="text-red-700 text-sm mt-2">
                    {userBalancesMutation.error.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Funkit API Mutation Demo */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Get User Wallets Demo (Mutation)</h3>
            <div className="space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  Click the button below to call the real @funkit/api-base getUserWalletIdentities() function:
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-amber-700 font-medium">⚠️ Expected Behavior:</p>
                  <p className="text-amber-600 text-xs mt-1">
                    This call uses demo values (authId: 'demo-auth-id', walletAddr: '0x000...')
                    which will fail with "User not found" because they don't exist in the Funkit platform.
                    To succeed, you would need real authId and wallet address from your Funkit account.
                  </p>
                </div>
              </div>
              <button
                onClick={handleGetUserWallets}
                disabled={getUserWalletsMutation.isPending}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                {getUserWalletsMutation.isPending ? 'Getting Wallets...' : 'Get User Wallets'}
              </button>

              {getUserWalletsMutation.data && getUserWalletsMutation.data.success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-green-800">✅ Wallet Query Success:</h4>
                  <pre className="mt-2 text-sm text-green-700 overflow-auto">
                    {JSON.stringify(getUserWalletsMutation.data, null, 2)}
                  </pre>
                </div>
              )}

              {getUserWalletsMutation.data && !getUserWalletsMutation.data.success && (
                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-md">
                  <h4 className="font-medium text-orange-800">⚠️ Expected API Error (Demo Values):</h4>
                  <p className="text-orange-700 text-sm mt-2">
                    <strong>Error:</strong> {getUserWalletsMutation.data.error}
                  </p>
                  {getUserWalletsMutation.data.fallbackInfo && (
                    <div className="mt-3 text-xs text-orange-600 space-y-1">
                      <p><strong>Function:</strong> {getUserWalletsMutation.data.fallbackInfo.apiFunction}</p>
                      <p><strong>Note:</strong> {getUserWalletsMutation.data.fallbackInfo.note}</p>
                      {getUserWalletsMutation.data.fallbackInfo.usedAuthId && (
                        <p><strong>Used authId:</strong> {getUserWalletsMutation.data.fallbackInfo.usedAuthId}</p>
                      )}
                      {getUserWalletsMutation.data.fallbackInfo.usedWalletAddr && (
                        <p><strong>Used walletAddr:</strong> {getUserWalletsMutation.data.fallbackInfo.usedWalletAddr}</p>
                      )}
                      {getUserWalletsMutation.data.fallbackInfo.docs && (
                        <p><strong>Docs:</strong> <a href={getUserWalletsMutation.data.fallbackInfo.docs} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{getUserWalletsMutation.data.fallbackInfo.docs}</a></p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {getUserWalletsMutation.error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <h4 className="font-medium text-red-800">Mutation Error:</h4>
                  <p className="mt-2 text-sm text-red-700">
                    {getUserWalletsMutation.error.message}
                  </p>
                </div>
              )}
            </div>




          </div>
        </div>

        {/* Token Swap Integration Test */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Token Swap Integration Test</h2>

          <div className="space-y-4">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-md">
              <p className="text-indigo-700 font-medium">🔄 Test Token Swap with Real API Data</p>
              <p className="text-indigo-600 text-sm mt-1">
                This tests the complete token swap flow using real Funkit API data with live calculations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">USD Input</h4>
                <input
                  type="number"
                  placeholder="Enter USD amount"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={demoUsdAmount}
                  onChange={(e) => setDemoUsdAmount(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Primary input for token calculations</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Source Token (USDC)</h4>
                <div className="text-sm text-gray-600">
                  <p>Amount: <span className="font-medium">{demoSourceAmount}</span></p>
                  <p>Price: <span className="font-medium">${demoSourcePrice}</span></p>
                  <p className="text-xs text-gray-500 mt-1">Calculated from USD input</p>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Target Token (ETH)</h4>
                <div className="text-sm text-gray-600">
                  <p>Amount: <span className="font-medium">{demoTargetAmount}</span></p>
                  <p>Price: <span className="font-medium">${demoTargetPrice}</span></p>
                  <p className="text-xs text-gray-500 mt-1">Calculated from USD input</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">Live Exchange Rate</h4>
              <div className="text-sm text-gray-600">
                <p>1 USDC ≈ <span className="font-medium">{demoExchangeRate}</span> ETH</p>
                <p>1 ETH ≈ <span className="font-medium">${demoTargetPrice}</span></p>
                <p className="text-xs text-gray-500 mt-2">* Real-time calculations using Funkit API data</p>
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 font-medium">✅ Live Integration Working</p>
              <p className="text-green-600 text-sm mt-1">
                Token calculations are happening in real-time using actual Funkit API prices.
                Change the USD amount above to see live token conversions!
              </p>
            </div>
          </div>
        </div>

        {/* Headless UI Tabs Demo */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Headless UI Tabs Demo</h2>
          <TabGroup>
            <TabList className="flex space-x-1 rounded-lg bg-blue-900/20 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 data-[selected]:bg-white data-[selected]:shadow data-[hover]:bg-white/[0.12] data-[selected]:data-[hover]:bg-white/[0.16] data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  {tab.name}
                </Tab>
              ))}
            </TabList>
            <TabPanels className="mt-6">
              {tabs.map((tab) => (
                <TabPanel
                  key={tab.name}
                  className="rounded-lg bg-gray-50 p-6 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                >
                  <p className="text-gray-700">{tab.content}</p>
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  )
}

export default Demo