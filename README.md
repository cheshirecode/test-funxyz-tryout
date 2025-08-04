# React + Vite + Tailwind 4 Development Stack

Modern React application with comprehensive testing and API integration capabilities.

## Prerequisites

- Node.js 20+ (LTS)
- pnpm 10.6.2+

## Installation

```bash
pnpm install
```

## Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm test         # Run tests in watch mode
pnpm test:run     # Run tests once
pnpm test:ui      # Run tests with UI interface
pnpm test:coverage # Run tests with coverage report
```

## Tech Stack

### Core Framework
- **React 18.3.1** - Component library with StrictMode
- **TypeScript** - Static type checking
- **Vite 7.0.6** - Build tool and dev server

### Styling & UI
- **Tailwind CSS 4.0.0** - Utility-first CSS framework
- **Headless UI 2.2.7** - Accessible unstyled components
- **PostCSS** - CSS processing with Autoprefixer

### State Management & Data Fetching
- **TanStack React Query 5.84.1** - Server state management
- **React Hooks** - Local state management

### API Integration
- **@funkit/api-base 1.9.8** - Funkit API client library
- **Environment Variables** - Runtime configuration

### Testing
- **Vitest 3.2.4** - Unit testing framework
- **React Testing Library 16.3.0** - Component testing utilities
- **jsdom** - DOM environment for testing
- **@testing-library/jest-dom** - Extended matchers

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **pnpm** - Package management

## Environment Variables

Create `.env` file in project root:

```env
VITE_FUNKIT_API_KEY=your_api_key_here
VITE_FUNKIT_API_BASE_URL=https://api.funkit.example.com
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── config/             # Configuration files
│   └── api.ts          # API configuration and validation
├── services/           # API service layer
│   ├── api.ts          # API client and service functions
│   └── __tests__/      # Service unit tests
├── test/               # Test configuration
│   └── setup.ts        # Global test setup
├── __tests__/          # Component tests
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
├── index.css           # Global styles and Tailwind imports
└── vite-env.d.ts       # Vite environment type definitions
```

## Configuration Files

- `vite.config.ts` - Vite build configuration with Vitest setup
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration for Tailwind
- `tsconfig.json` - TypeScript compiler configuration
- `tsconfig.node.json` - Node.js specific TypeScript configuration

## Testing

### Running Tests
- Watch mode: `pnpm test`
- Single run: `pnpm test:run`
- UI interface: `pnpm test:ui`

### Test Coverage
- API Services: Complete unit test coverage
- React Components: Component integration tests
- Environment: Mock environment variables and API responses

### Test Configuration
- Environment: jsdom for DOM simulation
- Setup: Global test configuration in `src/test/setup.ts`
- Mocking: API services and environment variables

## Development Workflow

1. **Environment Setup**: Configure `.env` with API credentials
2. **Development**: Run `pnpm dev` for hot-reload development server
3. **Testing**: Run `pnpm test` for continuous testing during development
4. **Type Checking**: TypeScript compilation included in build process
5. **Production Build**: `pnpm build` generates optimized production assets

## API Integration

The application integrates with Funkit API through `@funkit/api-base`:

- **Configuration**: Environment-based API key and URL configuration
- **Service Layer**: Abstracted API calls with error handling
- **Type Safety**: TypeScript interfaces for API responses
- **Testing**: Mocked API responses for reliable testing

## Performance Considerations

- **Vite**: Fast development server with HMR
- **React Query**: Intelligent caching and background updates
- **Code Splitting**: Vite handles automatic code splitting
- **CSS Optimization**: Tailwind CSS purges unused styles in production

## Browser Support

Modern browsers supporting ES2020+ features.

## Version Information

- **Current Environment**: Node.js v20.3.0
- **Recommended**: Node.js 20.18.1+ (Current LTS)
- **Package Manager**: pnpm 10.6.2