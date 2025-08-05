module.exports = {
  ci: {
    build: {
      // Build command is handled by GitHub workflow
      command: 'pnpm run build',
      outputDir: './dist',
    },
    upload: {
      target: 'temporary-public-storage',
    },
    collect: {
      // Test the built static files
      staticDistDir: './dist',
      // URLs to audit (relative to staticDistDir)
      url: ['http://localhost/index.html'],
      numberOfRuns: 3,
      settings: {
        // Run desktop audits for better performance consistency
        preset: 'desktop',
        // Skip certain audits that might not be relevant for a demo app
        skipAudits: [
          'canonical', // Demo app doesn't need canonical URLs
          'meta-description', // Demo app might not have meta descriptions
        ],
        // Configure Chrome flags for consistent testing
        chromeFlags: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--headless'],
      },
    },
    assert: {
      assertions: {
        // Performance thresholds
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.8 }],

        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],

        // Bundle size checks
        'total-byte-weight': ['warn', { maxNumericValue: 1024000 }], // 1MB
        'unused-javascript': ['warn', { maxNumericValue: 51200 }], // 50KB

        // Security
        'is-on-https': 'off', // Static hosting might not use HTTPS in CI
        'redirects-http': 'off',
      },
    },
  },
}
