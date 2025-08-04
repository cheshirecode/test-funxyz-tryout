import { useState } from 'react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query'

// Simple mock data fetch function
const fetchData = async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    message: 'Hello from React Query!',
    timestamp: new Date().toISOString(),
    status: 'success'
  }
}

function App() {
  const [count, setCount] = useState(0)

  // Example React Query usage
  const { data, isLoading, error } = useQuery({
    queryKey: ['example-data'],
    queryFn: fetchData,
  })

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
            React + Vite + Tailwind 4
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">React Query Demo</h2>
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
          {data && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 font-medium">{data.message}</p>
              <p className="text-green-600 text-sm mt-1">
                Fetched at: {new Date(data.timestamp).toLocaleTimeString()}
              </p>
            </div>
          )}
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

export default App