import { useEffect } from 'react'
import { useLocation } from 'wouter'

export function Home() {
  const [, setLocation] = useLocation()

  useEffect(() => {
    // Redirect to /swap route
    setLocation('/swap')
  }, [setLocation])

  return (
    <div className='flex w-full min-h-screen justify-center items-center bg-background-light-secondary dark:bg-background-dark-secondary transition-colors'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4'></div>
        <p className='text-text-light-secondary dark:text-text-dark-secondary'>
          Redirecting to swap...
        </p>
      </div>
    </div>
  )
}
