# Features Architecture

This directory contains feature-specific business logic that follows the separation of concerns principle. Features are organized by domain and contain reusable business logic hooks.

## Structure

```
src/features/
├── swap/                    # Swap-related features
│   ├── useSwapFeature.ts   # Main orchestrator hook
│   └── index.ts            # Exports
└── index.ts                # Main exports
```

## Design Principles

### 1. Separation of Concerns

- **Components** (`src/components/`): Presentational components with minimal business logic
- **Features** (`src/features/`): Business logic and state management
- **Utils** (`src/utils/`): Generic utilities and reusable hooks

### 2. Feature Hooks

Feature hooks orchestrate all business logic for a specific domain:

- Combine multiple utility hooks
- Manage complex state interactions
- Provide a clean API for components
- Handle side effects and data synchronization

### 3. Reusability

- Feature hooks can be used by multiple components
- Business logic is centralized and testable
- Components become pure and focused on presentation

## Usage

### Using Feature Hooks

```tsx
import { useSwapFeature } from '@features'

function MyComponent() {
  const {
    sourceToken,
    targetToken,
    usdAmount,
    swapping,
    handleSwapClick,
    // ... all swap-related state and actions
  } = useSwapFeature()

  return <div>{/* Presentational logic only */}</div>
}
```

### Creating New Features

1. Create a new feature directory: `src/features/myFeature/`
2. Create the main feature hook: `useMyFeature.ts`
3. Export from `index.ts`
4. Use in components

### Example: Swap Feature

The `useSwapFeature` hook demonstrates the pattern:

- **Orchestrates**: Token data, pricing, state management, execution
- **Provides**: Clean API for all swap-related functionality
- **Handles**: Complex interactions between multiple hooks
- **Manages**: Side effects and data synchronization

## Benefits

1. **Maintainability**: Business logic is centralized and testable
2. **Reusability**: Feature hooks can be used across multiple components
3. **Testability**: Business logic can be tested independently
4. **Separation**: Components focus on presentation, features on logic
5. **Scalability**: Easy to add new features following the same pattern

## Guidelines

1. **Keep components dumb**: Components should only handle presentation
2. **Centralize business logic**: Use feature hooks for complex logic
3. **Reuse utilities**: Leverage existing utils/hooks in features
4. **Test features**: Write comprehensive tests for feature hooks
5. **Document APIs**: Provide clear interfaces for feature hooks
