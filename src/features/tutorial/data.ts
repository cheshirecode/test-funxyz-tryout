import { TutorialStep } from './types'

export const tutorialSteps: TutorialStep[] = [
  {
    id: 'demo-button',
    title: 'Demo & API Examples',
    description:
      'Click here to view interactive demos and API examples. Learn how to integrate the token swap functionality into your own applications.',
    targetSelector: '[data-tutorial="demo-button"]',
    position: 'bottom',
  },
  {
    id: 'theme-switcher',
    title: 'Theme Switcher',
    description:
      'Toggle between light and dark themes. The interface automatically adapts to your preference and remembers your choice.',
    targetSelector: '[data-tutorial="theme-switcher"]',
    position: 'bottom',
  },
  {
    id: 'quick-select',
    title: 'Quick Token Selection',
    description:
      'Use these buttons to quickly select popular tokens like USDC, ETH, or USDT for your swap.',
    targetSelector: '[data-tutorial="quick-select"]',
    position: 'bottom',
  },
  {
    id: 'amount-input',
    title: 'USD Amount Input',
    description:
      'Enter the USD amount you want to swap. The system will automatically calculate the equivalent token amounts.',
    targetSelector: '[data-tutorial="amount-input"]',
    position: 'bottom',
  },
  {
    id: 'source-token',
    title: 'Source Token (From)',
    description: "Select the token you want to swap from. This is what you're selling.",
    targetSelector: '[data-tutorial="source-token"]',
    position: 'right',
  },
  {
    id: 'swap-direction',
    title: 'Swap Direction',
    description: 'Click this button to quickly swap the source and target tokens.',
    targetSelector: '[data-tutorial="swap-direction"]',
    position: 'bottom',
  },
  {
    id: 'target-token',
    title: 'Target Token (To)',
    description: 'Select the token you want to swap to. This is what you will receive.',
    targetSelector: '[data-tutorial="target-token"]',
    position: 'left',
  },
  {
    id: 'swap-button',
    title: 'Execute Swap',
    description: 'Click here to execute your token swap. Review the details before confirming.',
    targetSelector: '[data-tutorial="swap-button"]',
    position: 'top',
  },
  {
    id: 'refresh-toggle',
    title: 'Refresh Rate',
    description:
      'Control how often the exchange rates are updated. Choose between manual, 5s, 10s, or 30s intervals.',
    targetSelector: '[data-tutorial="refresh-toggle"]',
    position: 'left',
  },
]
