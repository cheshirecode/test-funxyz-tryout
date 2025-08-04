# @funkit/api-base API Exploration Report

## Overview
This document catalogs all 128 available exports from the @funkit/api-base package and categorizes them by functionality to identify additional metadata and features that can enhance the token swap application.

## Current Usage
The application currently uses only 4 functions:
- `getUserUniqueId` - Get user unique identifier
- `getGroups` - Get user groups
- `getUserWalletIdentities` - Get wallet identities
- `getAllowedAssets` - Get allowed assets

## Complete Function Categorization

### 🪙 **Asset & Token Functions** (High Priority)
These functions provide enhanced token metadata and pricing information:

**Currently Used:**
- `getAssetErc20ByChainAndSymbol` - Get ERC20 token by chain and symbol
- `getAssetPriceInfo` - Get asset price information
- `getAllowedAssets` - Get allowed assets

**Available for Enhancement:**
- `getAssetFromFaucet` - Get test tokens from faucet
- `getAllWalletTokens` - Get all tokens in a wallet
- `getAllWalletTokensByChainId` - Get tokens by specific chain
- `getAllWalletNFTs` - Get all NFTs in a wallet
- `getAllWalletNFTsByChainId` - Get NFTs by specific chain
- `getNftAddress` - Get NFT contract address
- `getNftName` - Get NFT collection name

### 🔗 **Chain & Network Functions** (Medium Priority)
Functions for multi-chain support and network information:

- `getChainFromId` - Get chain info from chain ID
- `getChainFromName` - Get chain info from name
- `getUserOpGasPrice` - Get gas prices for user operations

### 💰 **Payment & Checkout Functions** (Medium Priority)
Functions for crypto-to-fiat integration:

**Stripe Integration:**
- `createStripeBuySession` - Create Stripe payment session
- `getStripeBuyQuote` - Get Stripe purchase quote
- `getStripeBuySession` - Get Stripe session details

**Moonpay Integration:**
- `getMoonpayBuyQuoteForCreditCard` - Get Moonpay quote
- `getMoonpayUrlSignature` - Get signed Moonpay URL

**Meld Integration:**
- `getMeldDefaultFiat` - Get default fiat currency
- `getMeldFiatLimits` - Get fiat purchase limits
- `getMeldQuotes` - Get Meld quotes
- `getMeldSupportedFiat` - Get supported fiat currencies
- `startMeldSession` - Start Meld session

**Checkout System:**
- `initializeCheckout` - Initialize payment checkout
- `initializeCheckoutTokenTransferAddress` - Initialize token transfer
- `getCheckoutQuote` - Get checkout quote
- `getCheckoutByDepositAddress` - Get checkout by address
- `getCheckoutsByFunWalletAddress` - Get checkouts by wallet
- `getCheckoutsByRecipientAddress` - Get checkouts by recipient
- `getCheckoutsByUserId` - Get user checkouts
- `deactivateCheckout` - Deactivate checkout
- `generateRandomCheckoutSalt` - Generate checkout salt

### 🌉 **Bridge & Banking Functions** (Low Priority)
Functions for traditional banking integration:

- `createBridgeBankAccount` - Create bank account
- `createBridgeCustomer` - Create bridge customer
- `getBridgeBankAccounts` - Get bank accounts
- `getBridgeCustomer` - Get customer info
- `getBridgeKycLink` - Get KYC verification link

### 🔄 **Transaction & Operation Functions** (High Priority)
Functions for advanced transaction handling:

**Operation Management:**
- `createOp` - Create user operation
- `estimateOp` - Estimate operation gas
- `executeOp` - Execute operation
- `scheduleOp` - Schedule operation
- `signOp` - Sign operation
- `deleteOp` - Delete operation
- `getOps` - Get operations
- `getOpsOfWallet` - Get wallet operations

**Transaction Management:**
- `addTransaction` - Add transaction
- `createDirectExecution` - Create direct execution
- `getDirectExecutionByTxHash` - Get execution by tx hash
- `getDirectExecutionsByUserId` - Get user executions
- `getFullReceipt` - Get full transaction receipt

**Paymaster Integration:**
- `getPaymasterDataForCheckoutSponsoredTransfer` - Get paymaster data

### 👤 **User & Wallet Management** (Medium Priority)
Extended user and wallet functionality:

**User Management:**
- `createUser` - Create new user
- `addUserToWallet` - Add user to wallet
- `getUserWalletsByAddr` - Get wallets by address

**Wallet Operations:**
- `checkWalletAccessInitialization` - Check wallet access
- `initializeWalletAccess` - Initialize wallet access

### 🕸️ **Mesh Integration Functions** (Low Priority)
Mesh network integration for cross-chain operations:

- `meshConfigureTransfer` - Configure mesh transfer
- `meshConfigureTransferProxy` - Configure via proxy
- `meshExecuteTransfer` - Execute mesh transfer
- `meshExecuteTransferProxy` - Execute via proxy
- `meshGetCryptocurrencyHoldings` - Get crypto holdings
- `meshGetCryptocurrencyHoldingsProxy` - Get holdings via proxy
- `meshGetLinkToken` - Get link token
- `meshGetTransferIntegrations` - Get transfer integrations
- `meshPreviewTransfer` - Preview transfer
- `meshPreviewTransferProxy` - Preview via proxy
- `saveTokensToMeshProxy` - Save tokens to mesh
- `removeTokensFromMeshProxy` - Remove tokens from mesh

### 🏦 **DeFi Integration Functions** (Medium Priority)
Specialized DeFi protocol integrations:

- `getWalletLidoWithdrawalsByChainId` - Get Lido withdrawals
- `createFrogAccount` - Create Frog protocol account
- `getFrogAccount` - Get Frog account details

### 🔒 **Security & Risk Functions** (Medium Priority)
Security and compliance features:

- `getRiskAssessmentForAddress` - Get address risk assessment
- `sendSupportMessage` - Send support message

### 🛠️ **Utility Functions** (Low Priority)
Helper and utility functions:

- `randomBytes` - Generate random bytes
- `roundToNearestBottomTenth` - Math utility
- `errorAbortHandler` - Error handling
- `getOrganizationIdByApiKey` - Get org ID from API key

### 🌐 **HTTP Utilities** (Low Priority)
Direct HTTP request functions:

- `sendDeleteRequest` - Send DELETE request
- `sendGetRequest` - Send GET request
- `sendPostRequest` - Send POST request
- `sendPutRequest` - Send PUT request
- `sendRequest` - Send generic request

### 📊 **Constants & Configuration** (Reference)
Configuration constants and enums:

**API Keys & URLs:**
- `API_BASE_URL` - Base API URL
- `DEV_API_KEY` - Development API key
- `FUN_FAUCET_URL` - Faucet URL
- `MESH_API_BASE_URL` - Mesh API URL
- Various partner API keys (BANKR, BENQI, BSX, DEGEN, etc.)

**Status Enums:**
- `AuthType`, `BridgeCustomerStatus`, `BridgeCustomerType`
- `CheckoutRefundState`, `CheckoutState`
- `DirectExecutionType`, `MeldServiceProvider`
- `OperationStatus`, `OperationType`, `PaymasterType`
- `RelayExecutionStatus`

**State Arrays:**
- `FROM_PROGRESS_CHECKOUT_STATES`
- `IN_PROGRESS_CHECKOUT_STATES`
- `TERMINAL_CHECKOUT_STATES`
- `TO_PROGRESS_CHECKOUT_STATES`

**Configuration:**
- `DEFAULT_RETRY_OPTIONS` - Default retry configuration
- `MELD_PROVIDER_CATEGORIES` - Meld provider categories

## Recommended Implementation Priority

### 🏆 **Immediate High-Value Additions**

1. **Enhanced Token Information**
   - `getAllWalletTokens` - Show user's complete token portfolio
   - `getAllWalletTokensByChainId` - Multi-chain token discovery
   - `getChainFromId` - Display chain names instead of IDs

2. **Advanced Transaction Features**
   - `estimateOp` - Gas estimation for swaps
   - `getUserOpGasPrice` - Real-time gas pricing
   - `getFullReceipt` - Detailed transaction receipts

3. **Portfolio & NFT Features**
   - `getAllWalletNFTs` - NFT portfolio display
   - `getNftName` - NFT collection metadata

### 🎯 **Medium-Term Enhancements**

1. **Fiat Integration**
   - `getStripeBuyQuote` - Fiat-to-crypto quotes
   - `getMoonpayBuyQuoteForCreditCard` - Alternative fiat on-ramp

2. **Multi-Chain Support**
   - `getChainFromName` - Chain discovery
   - `getAllWalletTokensByChainId` - Cross-chain token management

3. **Security Features**
   - `getRiskAssessmentForAddress` - Address risk scoring

## Next Steps

1. **Create Enhanced Token Service** - Implement portfolio and NFT functions
2. **Add Gas Estimation** - Integrate operation estimation
3. **Build Fiat Integration** - Add Stripe/Moonpay support
4. **Implement Multi-Chain** - Add chain switching and discovery
5. **Add Security Layer** - Integrate risk assessment

## Conclusion

The @funkit/api-base package provides 128 functions with extensive capabilities far beyond basic token swapping. The highest impact additions would be:

- **Portfolio Management** (token and NFT holdings)
- **Gas Estimation** (transaction cost prediction)
- **Fiat Integration** (on/off ramps)
- **Multi-Chain Support** (cross-chain operations)
- **Advanced Transaction Management** (operation scheduling and tracking)

This positions the application to evolve from a simple token swap tool into a comprehensive DeFi portfolio and transaction management platform.