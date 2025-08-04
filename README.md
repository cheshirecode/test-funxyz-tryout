# Token Swap DApp with Real Funkit Integration

> **🚀 Modern React token swap application featuring authentic Funkit API integration and advanced state management**

🔗 **Live Demo:** <https://test-funxyz-tryout.vercel.app/>

<img width="700" src="https://raw.githubusercontent.com/cheshirecode/test-funxyz-tryout/refs/heads/lighthouse/lighthouse_results/desktop/pagespeed.svg"/>

[Full lighthouse report](https://htmlpreview.github.io/?https://raw.githubusercontent.com/cheshirecode/test-funxyz-tryout/refs/heads/lighthouse/lighthouse_results/desktop/test_funxyz_tryout_vercel_app.html?token=GHSAT0AAAAAADIRZYYCRHEBLAU2CT2WD3JW2ERCIMQ)

## ⚡ Quick Start

```bash
pnpm install
echo "VITE_FUNKIT_API_KEY=your_api_key" > .env
pnpm dev
```

## 🏗️ Tech Stack Architecture

```mermaid
flowchart TB
    subgraph "🎨 UI Layer"
        A[React 18 + TypeScript]
        B[Tailwind + Dark/Light Theme]
        C[Token Swap Interface]
    end

    subgraph "🧠 State Layer"
        D[Jotai Atoms]
        E[Theme Persistence]
        F[localStorage Sync]
    end

    subgraph "🔌 API Layer"
        G[Real Funkit API]
        H[funkit API Base]
        I[TanStack Query]
    end

    subgraph "🛠️ Build Tools"
        J[Vite 6 + SWC]
        K[Vitest + 100+ Tests]
    end

    A --> D
    D --> F
    C --> G
    G --> H
    J --> K

    classDef ui fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef state fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef api fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef build fill:#fff3e0,stroke:#e65100,stroke-width:2px

    class A,B,C ui
    class D,E,F state
    class G,H,I api
    class J,K build
```

## 🎯 Cool Technical Decisions

### 🔥 **Real API Integration (No Mocks)**

- Authentic `@funkit/api-base` with production endpoints
- Real-time token data from live APIs
- Production-ready error handling

### ⚛️ **Jotai > React Context**

- Atomic state management for better performance
- Persistent theme system with localStorage
- Selective re-renders instead of context cascading

### 🎨 **Advanced Theme System**

- System preference detection with manual override
- Smooth transitions between light/dark modes
- Custom Tailwind color palette with semantic naming

### 🚀 **Modern Build Pipeline**

- Vite 6 + SWC for lightning-fast development
- TypeScript strict mode with comprehensive type safety
- 100+ test cases covering real API scenarios

## 🛠️ Key Technologies

| Technology          | Why This Choice                           |
| ------------------- | ----------------------------------------- |
| **Jotai Atoms**     | Better than Context for frequent updates  |
| **Real Funkit API** | Authentic platform connection, no mocking |
| **Vite 6 + SWC**    | Fastest possible development experience   |
| **Tailwind CSS**    | Rapid development with consistent theming |
| **Vitest**          | Modern testing with real API scenarios    |

## 🚀 Features

- **🔗 Real Funkit Integration** - No mocks, authentic API calls
- **🎨 Dynamic Theming** - System-aware with localStorage persistence
- **⚡ Fast Development** - Vite 6 + SWC for instant reloads
- **🧪 Comprehensive Testing** - 100+ tests including API scenarios
- **📱 Mobile-First Design** - Responsive with accessibility
- **🔒 Type-Safe** - Strict TypeScript throughout
- **🏆 Lighthouse CI** - Automated performance, accessibility, and SEO audits

## 📊 Stats

- **🧪 100+ Test Cases** - Components, APIs, integration
- **📦 Zero Mocks** - Real API integration only
- **⚡ <100ms Builds** - Vite 6 + SWC compilation
- **🎯 100% TypeScript** - Strict mode enabled

---

**📖 [Full Technical Details](./tech-details.md)** | **🏗️ [Funkit Platform](https://fun.xyz)**
