# Stock Watchlist App
A fully offline React Native mobile application built with TypeScript that lets users browse stocks, manage a personal watchlist, track portfolio investments, and monitor profit/loss — all powered by local mock data with no internet connection required.

---

## Screens at a Glance

| Screen | Description |
|---|---|
| Home | Browse all stocks, search by name/symbol/sector, add to watchlist |
| Watchlist | View saved stocks, swipe/tap to delete |
| Stock Detail | Price trend chart, volume chart, day stats |
| Portfolio | P&L summary, best/worst performers, full stock list |
| Add Portfolio Stock | Form to add a stock with all 6 required fields |
| Edit Portfolio Stock | Pre-filled form to update any stock entry |
| Settings | Toggle dark/light mode, view available symbols |

---

## Setup Instructions

### Prerequisites

Make sure the following are installed on your machine before starting:

- **Node.js** ≥ 18.x — [nodejs.org](https://nodejs.org)
- **npm** ≥ 9.x or **Yarn** ≥ 1.22
- **React Native CLI** — `npm install -g react-native`
- **Android Studio** (for Android) with an AVD emulator or physical device
- **Xcode** ≥ 14 (macOS only, for iOS)
- **CocoaPods** (macOS only) — `sudo gem install cocoapods`
- **JDK 17** — required for React Native 0.85

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/StockWatchlistApp.git
cd StockWatchlistApp
```

---

### Step 2 — Install Node Dependencies

```bash
npm install
```

---

### Step 3 — iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

---

### Step 4 — Android Setup

In `android/app/build.gradle`, add the following line at the very **bottom** of the file (required for Material Icons to render):

```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

---

### Step 5 — Run the App

**Android:**

```bash
npx react-native run-android
```

**iOS (macOS only):**

```bash
npx react-native run-ios
```

**Start Metro bundler separately (optional):**

```bash
npx react-native start --reset-cache
```

> **Important:** Always run with `--reset-cache` after installing new packages or modifying `babel.config.js`.

---

### Troubleshooting

| Problem | Fix |
|---|---|
| Icons not showing on Android | Confirm `fonts.gradle` line is in `android/app/build.gradle` |
| App crashes immediately on startup | Ensure `babel.config.js` includes `'react-native-reanimated/plugin'` |
| Metro can't resolve a module | Run `npx react-native start --reset-cache` |
| iOS build fails | Run `cd ios && pod install && cd ..` then rebuild |
| AsyncStorage not persisting | Reinstall app on device/emulator to clear stale state |

---

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | 19.2.3 | Core UI library |
| `react-native` | 0.85.3 | Mobile framework |
| `@react-navigation/native` | latest | Navigation container |
| `@react-navigation/native-stack` | latest | Stack (screen-to-screen) navigation |
| `@react-navigation/bottom-tabs` | latest | Bottom tab bar navigation |
| `react-native-screens` | latest | Native screen optimization |
| `react-native-safe-area-context` | latest | Safe area insets |
| `react-native-gesture-handler` | latest | Touch/swipe gestures |
| `react-native-reanimated` | latest | Smooth delete animations |
| `react-native-svg` | latest | Custom SVG line & bar charts |
| `react-native-vector-icons` | latest | Material Design icons |
| `@react-native-async-storage/async-storage` | latest | Persistent local storage |
| `@react-native-community/datetimepicker` | latest | Native date picker for portfolio form |

---

## Project Structure

```
StockWatchlistApp/
│
├── App.tsx                          # Root component — wraps all providers
│
├── src/
│   │
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces (Stock, PortfolioItem, nav types)
│   │
│   ├── data/
│   │   └── stocks.json              # Local mock data — 8 stocks with full price/volume history
│   │
│   ├── theme/
│   │   └── theme.ts                 # Light and dark theme token definitions
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx          # Dark/light mode state + toggle, persisted via AsyncStorage
│   │   └── AppContext.tsx           # Watchlist + Portfolio CRUD state, persisted via AsyncStorage
│   │
│   ├── hooks/                       # Custom hooks (assignment requirement)
│   │   ├── usePortfolioStats.ts     # Calculates total P&L, per-stock stats, best/worst performer
│   │   └── useStockSearch.ts        # Search/filter logic + stock symbol lookup
│   │
│   ├── components/
│   │   ├── StockAvatar.tsx          # Coloured circular avatar with stock symbol initials
│   │   ├── StockCard.tsx            # Reusable card for the Home stock list
│   │   ├── WatchlistCard.tsx        # Card with animated delete for the Watchlist screen
│   │   ├── PortfolioCard.tsx        # Card showing shares, buy price, current price, P&L
│   │   ├── EmptyState.tsx           # Reusable empty/error state with icon + optional CTA
│   │   └── charts/
│   │       ├── SimpleLineChart.tsx  # Custom SVG line chart with gradient fill
│   │       └── SimpleBarChart.tsx   # Custom SVG bar chart with gradient fill
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Stock list, search bar, add-to-watchlist input
│   │   ├── WatchlistScreen.tsx      # Filtered stock list with delete functionality
│   │   ├── StockDetailScreen.tsx    # Full detail view with charts and watchlist toggle
│   │   ├── PortfolioScreen.tsx      # Portfolio overview with P&L summary card
│   │   ├── AddPortfolioScreen.tsx   # Form to add a new stock to portfolio
│   │   ├── EditPortfolioScreen.tsx  # Pre-filled form to update an existing portfolio entry
│   │   └── SettingsScreen.tsx       # Dark mode toggle + app info
│   │
│   └── navigation/
│       └── AppNavigator.tsx         # Stack navigator + Bottom tab navigator setup
│
├── android/
│   └── app/
│       └── build.gradle             # ← Add fonts.gradle line here for vector icons
│
├── ios/
│   └── Podfile                      # iOS dependency config
│
├── babel.config.js                  # Must include reanimated plugin
└── tsconfig.json                    # TypeScript compiler config
```


### Core Requirements

- [x] Stock list screen with symbol, name, price, and price change
- [x] Add stock to watchlist via symbol input with error/success feedback
- [x] Remove stock from watchlist with animated delete button
- [x] Stock detail screen with day high, day low, open price, and change
- [x] Portfolio screen with full stock list
- [x] Add portfolio stock form (all 6 fields: symbol, name, quantity, purchase price, current price, date)
- [x] Per-stock profit/loss display
- [x] Total portfolio value and overall P&L
- [x] Edit portfolio stock (pre-filled form)
- [x] Delete portfolio stock with confirmation dialog
- [x] Line chart for price trend
- [x] Bar chart for volume
- [x] Empty state (watchlist, portfolio)
- [x] Error state (invalid stock symbol)
- [x] React Navigation (stack + bottom tabs)
- [x] Functional components with React Hooks throughout

### Bonus Features

- [x] AsyncStorage persistence (watchlist, portfolio, theme preference survive app restarts)
- [x] Search/filter on Home screen (searches by symbol, company name, and sector)
- [x] Dark mode / light mode toggle (Settings screen, persisted)
- [x] Custom hooks (`usePortfolioStats`, `useStockSearch`)
- [x] Best/worst performer cards on Portfolio screen
- [x] Time period tabs on charts (1D, 1W, 1M, 3M, 1Y, 5Y)
- [x] Animated card removal on Watchlist screen

---

## Assumptions and Decisions Made

### Data & Offline Strategy

**All data is static and bundled locally.** There is no API integration, network request, or live price feed. The `stocks.json` file serves as the single source of truth for stock metadata, price history, and volume history. This satisfies the "offline-first" constraint in the assignment and removes any dependency on external services or API keys.

**Price history is simulated with 13 data points** (roughly 2 weeks of daily prices). Different time period selections (1D, 1W, 1M, etc.) simply slice this array to different lengths rather than fetching different datasets. In a production app these would be separate API calls.

### Portfolio Current Price

When a user adds a stock to their portfolio, the **current price field is auto-populated** if the symbol matches a known stock in `stocks.json`. The user can override this value. This was added for convenience since the app has no live price feed.

The stored `currentPrice` in a `PortfolioItem` is a **snapshot** taken at the time of entry, not a live-updating value. This is the correct offline behaviour — in a live app this value would be refreshed from an API.

### Symbol Validation

Watchlist additions are validated against the `stocks.json` dataset only. Any symbol not present in the 8 bundled stocks will show an error. The add-to-portfolio form does not restrict symbols to this list (to allow users to manually enter any ticker with custom data).

### Navigation Architecture

A ** Stack Navigator wrapping a Bottom Tab Navigator** was chosen as this is the standard React Native pattern for apps with:
- Tab-level screens (Home, Watchlist, Portfolio, Settings)
- Detail/form screens pushed over the tabs (Stock Detail, Add/Edit Portfolio)

This means the tab bar correctly disappears on detail screens without requiring nested navigators per tab.

### P&L Calculation

Profit/Loss is computed as:

```
P&L ($) = (currentPrice - purchasePrice) × quantity
P&L (%) = ((currentPrice - purchasePrice) / purchasePrice) × 100
```

This logic lives entirely inside the `usePortfolioStats` custom hook, so it is never duplicated between `PortfolioScreen` and `PortfolioCard`.

### No Class Components

The entire codebase uses **functional components** with hooks. No class components were used. This aligns with modern React Native practice and the assignment's explicit requirement.

### Icon Library

**`react-native-vector-icons` (MaterialIcons)** was used over alternatives like `@expo/vector-icons` or `react-native-paper` because:
- It is the most widely used icon set for React Native CLI projects
- It does not require Expo
- Material Icons are visually consistent with the provided design mockup

### Chart Library Choice

**Custom SVG charts via `react-native-svg`** were used instead of `react-native-chart-kit`, `victory-native`, or `recharts` because:
- Third-party chart libraries frequently have peer dependency conflicts across React Native versions
- The custom implementation gives full control over colours, gradients, curves, and grid lines
- It produces smaller bundle sizes with no transitive dependencies

### TypeScript Strictness

All navigation prop types are explicitly typed using `@react-navigation` generics. The `RootStackParamList` and `TabParamList` types in `src/types/index.ts` ensure that every `navigation.navigate()` call is type-checked at compile time, preventing incorrect screen name or parameter bugs.

---

##Author
Saroj Yadav

