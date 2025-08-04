import { Router, Route, Link } from 'wouter'
import Demo from './pages/Demo'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">
                React App
              </h1>
              <div className="flex space-x-4">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/demo"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Demo
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <main>
          <Route path="/" component={Home} />
          <Route path="/demo" component={Demo} />
        </main>
      </div>
    </Router>
  )
}

// Simple Home component placeholder
function Home() {
  return (
    <div className="max-w-4xl mx-auto px-8 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to React App
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A modern React application with routing
        </p>
        <Link
          href="/demo"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          View Demo
        </Link>
      </div>
    </div>
  )
}

export default App