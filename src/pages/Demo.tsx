import { useState } from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiService } from '../services/api'
import { apiConfig, isDevelopment } from '../config/api'



function Demo() {
  const [count, setCount] = useState(0)
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const queryClient = useQueryClient()

  // Example React Query usage with real API service
  const { data, isLoading, error } = useQuery({
    queryKey: ['api-status'],
    queryFn: () => apiService.getStatus(),
  })

  // API integration examples using real HTTP requests
  const {
    data: apiData,
    isLoading: apiLoading,
    error: apiError,
    refetch: refetchApiData
  } = useQuery({
    queryKey: ['api-health-check'],
    queryFn: () => apiService.getAPIHealthCheck(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Mutation example for creating posts
  const createPostMutation = useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      apiService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setPostTitle('')
      setPostContent('')
    }
  })

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (postTitle.trim() && postContent.trim()) {
      createPostMutation.mutate({ title: postTitle, content: postContent })
    }
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">React Query Demo (API Status)</h2>
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
              <p className="text-red-700">API Error: {data.error}</p>
              <p className="text-red-600 text-sm mt-1">
                Timestamp: {new Date(data.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        {/* API Integration Demo */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">API Integration Demo (@funkit/api-base)</h2>

          {/* Environment Variables Display */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Environment Configuration</h3>
            <div className="text-sm text-gray-600">
              <p><strong>Environment:</strong> {isDevelopment ? 'Development' : 'Production'}</p>
              <p><strong>API Base URL:</strong> {apiConfig.baseUrl}</p>
              <p><strong>API Key:</strong> {apiConfig.apiKey.substring(0, 8)}...</p>
            </div>
          </div>

          {/* API Data Fetch Demo */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-800">Real API Health Check</h3>
              <button
                onClick={() => refetchApiData()}
                disabled={apiLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {apiLoading ? 'Loading...' : 'Refresh API'}
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
                  <p>• Base URL: {apiData.fallbackInfo.baseUrl}</p>
                  <p>• API Key: {apiData.fallbackInfo.apiKeyMasked}</p>
                  <p><strong>Features:</strong></p>
                  <ul className="list-disc list-inside mt-1">
                    {apiData.fallbackInfo.features?.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <p className="mt-2"><strong>Error:</strong> {apiData.error}</p>
                  <p><strong>Timestamp:</strong> {new Date(apiData.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* API Mutation Demo */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Create Post Demo (Mutation)</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter post title..."
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  id="content"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter post content..."
                />
              </div>
              <button
                type="submit"
                disabled={createPostMutation.isPending || !postTitle.trim() || !postContent.trim()}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
              </button>
            </form>

            {createPostMutation.isSuccess && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700">Post created successfully!</p>
              </div>
            )}

            {createPostMutation.isError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">Error creating post: {createPostMutation.error?.message}</p>
              </div>
            )}
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