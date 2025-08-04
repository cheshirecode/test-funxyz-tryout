import { useEffect } from 'react'
import { useLocation } from 'wouter'

export function Home() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    // Redirect to /swap route
    setLocation('/swap')
  }, [setLocation])

  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to swap...</p>
      </div>
    </div>
  )
} 