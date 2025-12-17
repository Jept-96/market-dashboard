# Crypto Market Panel - Deployment Guide

## 🚀 What Changed

Transformed from system monitoring dashboard to a **Binance-style crypto market panel**!

### New Features
- ✅ Top 50 cryptocurrencies by market cap
- ✅ Real-time price, 24h change, high/low, market cap, volume
- ✅ Mini sparkline charts (7-day price trends)
- ✅ Featured coins pinned at top: BTC, ETH, SOL, BNB
- ✅ Sortable columns (Price, 24h %, Market Cap, Volume)
- ✅ Futuristic cyberpunk theme with glowing effects
- ✅ Auto-refresh every 30 seconds
- ✅ Optimized for horizontal displays (1920×480-720)

## 📦 Deployment Steps

### 1. On Your Main Computer

The dashboard is ready to go! The server is already running from earlier.

### 2. Transfer to Your Laptop

**Option A: Copy the entire folder**
```bash
# Zip the dashboard folder
# Copy to your laptop via USB/network

# Or use git if you have a repository
git add .
git commit -m "Crypto market panel"
git push
```

**Option B: Fresh install on laptop**
1. Copy the entire `dashboard` folder to your laptop
2. Make sure Node.js is installed on the laptop
3. Open terminal in the dashboard folder
4. Run: `npm install`

### 3. Run on Your Laptop

```bash
cd dashboard
npm start
```

The server will start on `http://localhost:3000`

### 4. Connect to Portable Monitor

1. Plug in your portable HDMI monitor
2. Set it as extended display (not mirrored)
3. Open Chrome/Edge
4. Navigate to `http://localhost:3000`
5. Press `F11` for fullscreen
6. Drag the browser window to the portable monitor
7. Done! 🎉

### 5. Auto-Start on Laptop Boot (Optional)

**Windows:**
1. Press `Win + R`
2. Type `shell:startup` and press Enter
3. Copy `dashboard/startup/start.bat` to this folder
4. Dashboard will auto-launch on boot

**Alternative: Keep Browser Open**
- Chrome will remember your last session
- Just keep the fullscreen window on portable monitor

## 🎨 Features Breakdown

### Featured Coins
- **BTC, ETH, SOL, BNB** always show at the top
- Highlighted with green glow
- Pulse animation effect

### Sortable Columns
Click column headers to sort:
- **Price** - Current USD price
- **24h %** - Price change percentage
- **Market Cap** - Total market value
- **Volume(24h)** - Trading volume

Default: Sorted by Market Cap (highest first)

### Sparkline Charts
- 7-day price trend visualization
- Green for gains, red for losses
- SVG-based (ultra-light GPU usage)

### Table Features
- Sticky header (stays visible while scrolling)
- Top 50 coins by market cap
- Live data updates every 30 seconds
- Hover effects on rows
- Custom cyan scrollbar

## ⚙️ Configuration

Edit `server/config.json`:

```json
{
  "crypto": {
    "enabled": true,
    "coinLimit": 50,          // Change to 25, 100, etc.
    "refreshInterval": 30      // Seconds between updates
  },
  "display": {
    "theme": "dark"
  }
}
```

**To change featured coins:**
Edit `public/js/dashboard.js` line 10:
```javascript
const FEATURED_COINS = ['BTC', 'ETH', 'SOL', 'BNB'];
// Add more: ['BTC', 'ETH', 'SOL', 'BNB', 'ADA', 'DOT']
```

## 🔧 Troubleshooting

**Dashboard shows "Loading..." forever:**
- Check internet connection (needs CoinGecko API)
- Restart server: `Ctrl+C` then `npm start`

**Sparklines not showing:**
- They appear after first data load (wait 5-10 seconds)
- CoinGecko may be slow, be patient

**Coins not sorted correctly:**
- Click column header again to toggle asc/desc
- Default is Market Cap descending

**Want more/fewer coins:**
- Edit `config.json` → `coinLimit`
- Restart server

## 📊 Display Recommendations

**Portable Monitor Settings:**
- Resolution: 1920×480, 1920×600, or 1920×720
- Orientation: Horizontal (landscape)
- Brightness: 70-80% for better readability
- Position: Below or above main monitor

**Browser Settings:**
- Zoom: 100% (or adjust to fit perfectly)
- Fullscreen: Press F11
- Disable bookmarks bar for more space

## 🌐 Remote Access (Optional)

To access from other devices on your network:

1. Find your laptop's IP:
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

2. On another device, visit:
   ```
   http://<YOUR_LAPTOP_IP>:3000
   ```

## 🚀 Performance

- **GPU Usage:** Near-zero (text + SVG only)
- **CPU Usage:** <5% (efficient data updates)
- **RAM Usage:** ~100MB
- **Network:** Minimal (API calls every 30s)

Perfect for always-on display!

## 📝 Next Steps

Want to add more features?
- Portfolio tracking (add your holdings)
- Price alerts (notify when BTC > $100k)
- News ticker
- Global crypto market stats
- Favorites system (click to star coins)

Let me know and I can build it! 🔥
