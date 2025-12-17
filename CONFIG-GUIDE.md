# Dashboard Configuration Guide

This guide explains how to customize your market dashboard by editing the configuration file.

## Configuration File Location

`server/config.json`

## How to Configure

### 1. Cryptocurrency Tokens

Edit the `crypto.tokens` array to show specific cryptocurrencies:

```json
"crypto": {
  "enabled": true,
  "coinLimit": 50,
  "refreshInterval": 60,
  "tokens": ["bitcoin", "ethereum", "binancecoin", "solana"]
}
```

**How to add/change tokens:**
- Replace the token IDs in the array with your desired cryptocurrencies
- Find token IDs from CoinGecko: https://www.coingecko.com/
  - Example: Bitcoin = "bitcoin", Ethereum = "ethereum", Cardano = "cardano"
- You can add as many tokens as you want
- They will be displayed in the order listed

**Example - Add Cardano and Ripple:**
```json
"tokens": ["bitcoin", "ethereum", "binancecoin", "solana", "cardano", "ripple"]
```

### 2. Forex Exchange Rates

Edit the `forex.pairs` array to customize currency pairs:

```json
"forex": {
  "enabled": true,
  "pairs": [
    { "from": "USD", "to": "SGD", "flag": "🇸🇬" },
    { "from": "USD", "to": "THB", "flag": "🇹🇭" },
    { "from": "USD", "to": "MYR", "flag": "🇲🇾" }
  ]
}
```

**How to add/change forex pairs:**
- Each pair needs three properties:
  - `from`: Source currency (3-letter code)
  - `to`: Target currency (3-letter code)
  - `flag`: Country flag emoji

**Example - Add USD to EUR:**
```json
{ "from": "USD", "to": "EUR", "flag": "🇪🇺" }
```

**Example - Add GBP to JPY:**
```json
{ "from": "GBP", "to": "JPY", "flag": "🇯🇵" }
```

**Common Currency Codes:**
- USD = US Dollar
- EUR = Euro
- GBP = British Pound
- JPY = Japanese Yen
- AUD = Australian Dollar
- CAD = Canadian Dollar
- CNY = Chinese Yuan
- INR = Indian Rupee
- SGD = Singapore Dollar
- THB = Thai Baht
- MYR = Malaysian Ringgit

### 3. Market Indices

Edit the `market.indices` array to customize which market indices to display:

```json
"indices": [
  { "symbol": "^GSPC", "name": "S&P 500", "icon": "📈" },
  { "symbol": "^IXIC", "name": "Nasdaq Composite", "icon": "💻" },
  { "symbol": "^DJI", "name": "Dow Jones", "icon": "🏛️" },
  { "symbol": "^RUT", "name": "Russell 2000", "icon": "📊" },
  { "symbol": "^VIX", "name": "VIX", "icon": "⚡" }
]
```

**How to add/change indices:**
- Each index needs three properties:
  - `symbol`: Yahoo Finance symbol (usually starts with ^)
  - `name`: Display name
  - `icon`: Emoji icon

**Common Market Indices:**
- ^GSPC = S&P 500
- ^IXIC = Nasdaq Composite
- ^DJI = Dow Jones Industrial Average
- ^RUT = Russell 2000
- ^VIX = Volatility Index
- ^FTSE = FTSE 100 (UK)
- ^N225 = Nikkei 225 (Japan)
- ^HSI = Hang Seng (Hong Kong)

### 4. Stocks

Edit the `market.stocks` array to customize which stocks to track:

```json
"stocks": [
  { "symbol": "AAPL", "name": "Apple", "icon": "🍎" },
  { "symbol": "MSFT", "name": "Microsoft", "icon": "💻" },
  { "symbol": "GOOGL", "name": "Google", "icon": "🔍" },
  { "symbol": "AMZN", "name": "Amazon", "icon": "📦" },
  { "symbol": "NVDA", "name": "NVIDIA", "icon": "🎮" },
  { "symbol": "TSLA", "name": "Tesla", "icon": "⚡" },
  { "symbol": "META", "name": "Meta", "icon": "📱" },
  { "symbol": "NFLX", "name": "Netflix", "icon": "🎬" },
  { "symbol": "JPM", "name": "JPMorgan Chase", "icon": "🏦" },
  { "symbol": "V", "name": "Visa", "icon": "💳" },
  { "symbol": "DIS", "name": "Disney", "icon": "🏰" },
  { "symbol": "BA", "name": "Boeing", "icon": "✈️" }
]
```

**How to add/change stocks:**
- Each stock needs three properties:
  - `symbol`: Stock ticker symbol (from Yahoo Finance)
  - `name`: Company name
  - `icon`: Emoji icon

**Example - Add Coca-Cola:**
```json
{ "symbol": "KO", "name": "Coca-Cola", "icon": "🥤" }
```

**Popular Stock Symbols:**
- Tech: AAPL, MSFT, GOOGL, AMZN, META, NVDA, TSLA, NFLX, AMD, INTC
- Finance: JPM, BAC, WFC, GS, MS, V, MA, AXP
- Consumer: DIS, NKE, SBUX, MCD, KO, PEP
- Healthcare: JNJ, UNH, PFE, ABBV, TMO
- Energy: XOM, CVX, COP, SLB

### 5. Refresh Interval

Change how often the dashboard updates (in seconds):

```json
"crypto": {
  "refreshInterval": 60
}
```

- Default: 60 seconds (recommended for power saving)
- Minimum: 30 seconds
- Maximum: 300 seconds (5 minutes)

**Power saving tip:** Higher refresh interval = less power consumption

## Video Backgrounds

Place your MP4 video files in the `public` folder:
- `green.mp4` - Plays when market is bullish (green border)
- `red.mp4` - Plays when market is bearish (red border)

The videos will automatically fade between each other based on market sentiment.

## After Making Changes

1. Save the `config.json` file
2. Restart the server:
   - Close the running server (Ctrl+C)
   - Run `node server/server.js` again
   - OR double-click `RESTART-SERVER.bat`
3. Refresh your browser (F5)

## Example Full Configuration

```json
{
  "crypto": {
    "enabled": true,
    "coinLimit": 50,
    "refreshInterval": 60,
    "tokens": ["bitcoin", "ethereum", "binancecoin", "solana"]
  },
  "forex": {
    "enabled": true,
    "pairs": [
      { "from": "USD", "to": "SGD", "flag": "🇸🇬" },
      { "from": "USD", "to": "THB", "flag": "🇹🇭" },
      { "from": "USD", "to": "MYR", "flag": "🇲🇾" }
    ]
  },
  "market": {
    "indices": [
      { "symbol": "^GSPC", "name": "S&P 500", "icon": "📈" },
      { "symbol": "^IXIC", "name": "Nasdaq", "icon": "💻" },
      { "symbol": "^DJI", "name": "Dow Jones", "icon": "🏛️" }
    ],
    "stocks": [
      { "symbol": "AAPL", "name": "Apple", "icon": "🍎" },
      { "symbol": "MSFT", "name": "Microsoft", "icon": "💻" },
      { "symbol": "TSLA", "name": "Tesla", "icon": "⚡" },
      { "symbol": "NVDA", "name": "NVIDIA", "icon": "🎮" }
    ]
  },
  "display": {
    "theme": "dark"
  },
  "powerSaving": {
    "enabled": true,
    "description": "Power-optimized for 24/7 display panel usage"
  }
}
```

## Tips

1. **Keep it simple** - Don't add too many items or the dashboard will become cluttered
2. **Match your interests** - Customize to show the markets/stocks you care about
3. **Test changes** - Make one change at a time and test before adding more
4. **Backup config** - Keep a copy of your working configuration before making major changes
5. **Use valid JSON** - Make sure commas, brackets, and quotes are correct

## Troubleshooting

**Dashboard not updating after config changes?**
- Make sure you saved the config.json file
- Restart the server
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

**Tokens/stocks not showing?**
- Check that symbol/ID is correct (case-sensitive)
- Verify JSON syntax is valid (no missing commas or brackets)
- Check server console for error messages

**Need help?**
- Check the server console for error messages
- Verify your JSON is valid using: https://jsonlint.com/
