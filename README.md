# Auxiliary Crypto & System Dashboard

A lightweight, horizontal, always-on dashboard for a portable HDMI monitor displaying live crypto prices and system monitoring.

## Features

- **Live Crypto Prices** - Real-time prices from CoinGecko (BTC, ETH, SOL, etc.)
- **System Monitoring** - CPU, GPU, RAM, and Network stats
- **Ultra-Low GPU Usage** - No animations, no WebGL, text-only updates
- **Easy Configuration** - Web-based settings page
- **Auto-Start with Windows** - Runs automatically on boot
- **Dark Theme** - Power-efficient design

## Installation

### 1. Install Node.js

Download and install Node.js from [nodejs.org](https://nodejs.org/) (LTS version recommended)

### 2. Install Dependencies

Open a terminal in the dashboard folder and run:

```bash
npm install
```

This will install:
- `express` - Web server
- `systeminformation` - System stats monitoring

### 3. Run the Dashboard

**Option A: Manual Start**
```bash
npm start
```

**Option B: Use the Batch File**
```bash
startup\start.bat
```

The dashboard will open at `http://localhost:3000`

### 4. Configure Settings

Visit `http://localhost:3000/config` to customize:
- Which crypto symbols to display
- System widgets (CPU, GPU, RAM, Network)
- Refresh intervals
- Temperature units (°C / °F)

## Auto-Start on Windows Boot

To make the dashboard start automatically when Windows boots:

1. Press `Win + R` and type `shell:startup`, press Enter
2. Create a shortcut to `startup\start.bat` in this folder
3. The dashboard will now launch automatically on Windows startup

## Project Structure

```
dashboard/
│
├── server/
│   ├── server.js          # Express server
│   ├── systemStats.js     # System monitoring module
│   ├── crypto.js          # Crypto price fetching module
│   └── config.json        # Configuration file
│
├── public/
│   ├── index.html         # Main dashboard page
│   ├── config.html        # Configuration page
│   ├── css/
│   │   └── style.css      # Dashboard styles
│   └── js/
│       ├── dashboard.js   # Dashboard client logic
│       └── config.js      # Configuration page logic
│
├── startup/
│   └── start.bat          # Windows startup script
│
├── package.json           # Node.js dependencies
└── README.md             # This file
```

## API Endpoints

- `GET /api/crypto` - Get current crypto prices
- `GET /api/system` - Get system statistics
- `GET /api/config` - Get current configuration
- `POST /api/config` - Update configuration

## Configuration Options

### Crypto Settings
- **enabled**: Enable/disable crypto prices
- **symbols**: Array of CoinGecko coin IDs
- **refreshInterval**: Update frequency in seconds (10-300)

### System Settings
- **cpu/gpu/ram/network.enabled**: Toggle individual widgets
- **refreshInterval**: Update frequency in seconds (1-60)

### Display Settings
- **theme**: Color theme (dark only in MVP)
- **temperatureUnit**: C or F

## Supported Crypto Symbols

Use CoinGecko coin IDs in the configuration:
- `bitcoin` → BTC
- `ethereum` → ETH
- `solana` → SOL
- `cardano` → ADA
- `polkadot` → DOT
- `chainlink` → LINK
- `avalanche-2` → AVAX
- `polygon` → MATIC

Find more at: https://www.coingecko.com/

## Display Recommendations

**Resolution:** 1920×480, 1920×600, or 1920×720
**Orientation:** Horizontal
**Refresh Rate:** 30-60 Hz

## Performance

- **GPU Usage:** Near-zero (text-only rendering)
- **CPU Usage:** Minimal (server-side data fetching)
- **Memory Usage:** ~50-100 MB
- **Network Usage:** Minimal (cached API responses)

## Troubleshooting

**Dashboard won't load:**
- Check if Node.js is installed: `node --version`
- Check if server is running: `npm start`
- Try a different port if 3000 is in use

**No crypto prices showing:**
- Check your internet connection
- Verify crypto symbols are correct CoinGecko IDs
- Check browser console for errors

**System stats not accurate:**
- GPU stats may not work on all systems
- Temperatures require hardware sensors
- Network stats show primary interface only

**Auto-start not working:**
- Verify shortcut is in `shell:startup` folder
- Check that Node.js is in system PATH
- Try running `start.bat` manually first

## Future Enhancements

- Price alerts
- Solana wallet tracking
- Telegram notifications
- AI-generated market commentary
- Multi-theme support

## License

MIT License - Use freely for personal or commercial projects

## Support

For issues or questions, check the configuration page or review the console logs when running `npm start`.
