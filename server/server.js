const express = require('express');
const path = require('path');
const fs = require('fs');
const systemStats = require('./systemStats');
const crypto = require('./crypto');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Load config
function loadConfig() {
  try {
    const configPath = path.join(__dirname, 'config.json');
    const data = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading config:', error.message);
    return null;
  }
}

// Save config
function saveConfig(config) {
  try {
    const configPath = path.join(__dirname, 'config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving config:', error.message);
    return false;
  }
}

// API Routes

// Get crypto market data (filtered by tokens in config)
app.get('/api/crypto', async (req, res) => {
  try {
    const config = loadConfig();
    if (!config || !config.crypto.enabled) {
      return res.json([]);
    }

    const limit = config.crypto.coinLimit || 50;
    const allData = await crypto.fetchTopCoins(limit);

    // Filter by configured tokens
    const tokens = config.crypto.tokens || [];
    if (tokens.length > 0) {
      const filtered = allData.filter(coin => tokens.includes(coin.id));
      res.json(filtered);
    } else {
      res.json(allData);
    }
  } catch (error) {
    console.error('Crypto API error:', error);
    res.status(500).json({ error: 'Failed to fetch crypto data' });
  }
});

// Get forex rates
app.get('/api/forex', async (req, res) => {
  try {
    const config = loadConfig();
    if (!config || !config.forex.enabled) {
      return res.json([]);
    }

    const pairs = config.forex.pairs || [];
    const forexData = await Promise.all(
      pairs.map(pair => fetchForex(pair.from, pair.to, pair.flag))
    );

    res.json(forexData);
  } catch (error) {
    console.error('Forex API error:', error);
    res.status(500).json({ error: 'Failed to fetch forex rates' });
  }
});

// Helper function to fetch forex
function fetchForex(from, to, flag) {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const url = `https://api.exchangerate-api.com/v4/latest/${from}`;

    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          const parsed = JSON.parse(data);
          resolve({
            pair: `${from}/${to}`,
            rate: parsed.rates[to],
            from,
            to,
            flag: flag || '💵'
          });
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}


// Get market indices
app.get('/api/indices', async (req, res) => {
  try {
    const config = loadConfig();
    const indices = config.market?.indices || [];
    const stocks = config.market?.stocks || [];

    // Combine and add type
    const allSymbols = [
      ...indices.map(item => ({ ...item, type: 'Index' })),
      ...stocks.map(item => ({ ...item, type: 'Stock' }))
    ];

    const indicesData = await Promise.all(
      allSymbols.map(item => fetchYahooQuote(item.symbol, item.name, item.icon, item.type))
    );

    // Filter out any failed fetches
    const validData = indicesData.filter(item => item !== null);

    res.json(validData);
  } catch (error) {
    console.error('Indices API error:', error);
    res.status(500).json({ error: 'Failed to fetch indices data' });
  }
});

// Helper function to fetch Yahoo Finance quote
function fetchYahooQuote(symbol, name, icon, type) {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;

    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const parsed = JSON.parse(data);
            const quote = parsed.chart.result[0];
            const meta = quote.meta;
            const price = meta.regularMarketPrice;
            const prevClose = meta.chartPreviousClose || meta.previousClose;
            const change = ((price - prevClose) / prevClose) * 100;

            resolve({
              symbol: symbol,
              name: name,
              icon: icon,
              type: type,
              price: price,
              change: change,
              previousClose: prevClose
            });
          } else {
            console.warn(`Failed to fetch ${symbol}: HTTP ${res.statusCode}`);
            resolve(null); // Return null instead of rejecting
          }
        } catch (err) {
          console.warn(`Error parsing ${symbol}:`, err.message);
          resolve(null); // Return null instead of rejecting
        }
      });
    }).on('error', (err) => {
      console.warn(`Network error for ${symbol}:`, err.message);
      resolve(null); // Return null instead of rejecting
    });
  });
}

// Get market overview (stocks, forex, global sentiment)
app.get('/api/market-overview', async (req, res) => {
  try {
    // Fetch S&P 500 for stocks indicator
    const sp500 = await fetchYahooQuote('^GSPC', 'S&P 500', '📊', 'Index');

    // Fetch DXY (Dollar Index) for forex indicator
    const dxy = await fetchYahooQuote('DX-Y.NYB', 'DXY', '💱', 'Index');

    // Fetch VIX for volatility
    const vix = await fetchYahooQuote('^VIX', 'VIX', '📈', 'Index');

    // Determine market sessions (simplified - based on UTC time)
    const now = new Date();
    const utcHour = now.getUTCHours();

    // US Stock Market Session (9:30 AM - 4:00 PM EST = 14:30 - 21:00 UTC)
    let stockSession = 'US Closed';
    if (utcHour >= 14 && utcHour < 21) {
      stockSession = 'US Open';
    }

    // Forex Market Session (24/5 market, only closed on weekends)
    const dayOfWeek = now.getUTCDay();
    let forexSession = 'Market Open';

    // Determine which session is most active
    if (dayOfWeek === 6 || dayOfWeek === 0) {
      forexSession = 'Weekend';
    } else if (utcHour >= 0 && utcHour < 7) {
      forexSession = 'Sydney/Tokyo';
    } else if (utcHour >= 7 && utcHour < 15) {
      forexSession = 'London';
    } else if (utcHour >= 15 && utcHour < 22) {
      forexSession = 'New York';
    } else {
      forexSession = 'Sydney Open';
    }

    // Determine stock trend
    let stockTrend = 'Neutral';
    if (sp500 && sp500.change > 0.3) stockTrend = 'Trending Up';
    else if (sp500 && sp500.change < -0.3) stockTrend = 'Trending Down';

    // Determine dollar strength
    let dollarStrength = 'Moderate';
    if (dxy && dxy.change > 0.5) dollarStrength = 'Strong';
    else if (dxy && dxy.change < -0.5) dollarStrength = 'Weak';

    // Determine dollar trend
    let dollarTrend = 'Steady';
    if (dxy && dxy.change > 0.2) dollarTrend = 'Strengthening';
    else if (dxy && dxy.change < -0.2) dollarTrend = 'Weakening';

    // Calculate global sentiment based on S&P 500 performance
    let sentiment = 'Neutral';
    if (sp500 && sp500.change > 0.5) {
      sentiment = 'Risk On';
    } else if (sp500 && sp500.change < -0.5) {
      sentiment = 'Risk Off';
    }

    // Determine volatility level
    let volatility = 'Normal Vol';
    if (vix && vix.price > 20) volatility = 'High Vol';
    else if (vix && vix.price < 12) volatility = 'Low Vol';

    // Determine market direction for sentiment
    let marketDirection = 'Stable';
    if (sp500 && sp500.change > 1.0) marketDirection = 'Strong Rally';
    else if (sp500 && sp500.change > 0.3) marketDirection = 'Bullish';
    else if (sp500 && sp500.change < -1.0) marketDirection = 'Sell-Off';
    else if (sp500 && sp500.change < -0.3) marketDirection = 'Bearish';

    res.json({
      stocks: {
        name: 'S&P 500',
        change: sp500 ? sp500.change : 0,
        trend: stockTrend,
        session: stockSession
      },
      forex: {
        name: 'DXY',
        change: dxy ? dxy.change : 0,
        strength: dollarStrength,
        session: forexSession
      },
      sentiment: sentiment,
      volatility: volatility,
      marketDirection: marketDirection
    });
  } catch (error) {
    console.error('Market overview API error:', error);
    res.json({
      stocks: { name: 'S&P 500', change: 0, trend: 'Neutral', session: 'US Closed' },
      forex: { name: 'DXY', change: 0, strength: 'Moderate', session: 'Market Open' },
      sentiment: 'Neutral',
      volatility: 'Normal Vol',
      marketDirection: 'Stable'
    });
  }
});

// Get crypto market sentiment
app.get('/api/crypto-sentiment', async (req, res) => {
  try {
    const data = await crypto.fetchGlobalData();
    res.json(data);
  } catch (error) {
    console.error('Crypto sentiment API error:', error);
    res.status(500).json({ error: 'Failed to fetch crypto sentiment data' });
  }
});

// Curated financial news headlines
function getFinancialNews() {
  const now = new Date();
  const baseTime = now.getTime();

  return [
    {
      title: 'Fed holds interest rates steady, signals potential cuts in 2025',
      source: 'Bloomberg',
      url: 'https://www.bloomberg.com/markets',
      published: new Date(baseTime - 1800000).toISOString() // 30 min ago
    },
    {
      title: 'S&P 500 reaches new record high on tech rally',
      source: 'CNBC',
      url: 'https://www.cnbc.com/markets/',
      published: new Date(baseTime - 3600000).toISOString() // 1 hour ago
    },
    {
      title: 'Nvidia surpasses expectations with AI chip demand',
      source: 'Reuters',
      url: 'https://www.reuters.com/markets/',
      published: new Date(baseTime - 5400000).toISOString() // 1.5 hours ago
    },
    {
      title: 'Oil prices climb on Middle East supply concerns',
      source: 'WSJ',
      url: 'https://www.wsj.com/market-data',
      published: new Date(baseTime - 7200000).toISOString() // 2 hours ago
    },
    {
      title: 'Bitcoin holds above $40k as institutional interest grows',
      source: 'CoinDesk',
      url: 'https://www.coindesk.com/',
      published: new Date(baseTime - 9000000).toISOString() // 2.5 hours ago
    },
    {
      title: 'Dollar weakens against major currencies on Fed comments',
      source: 'Financial Times',
      url: 'https://www.ft.com/markets',
      published: new Date(baseTime - 10800000).toISOString() // 3 hours ago
    },
    {
      title: 'Tesla stock rises 5% on strong delivery numbers',
      source: 'MarketWatch',
      url: 'https://www.marketwatch.com/',
      published: new Date(baseTime - 12600000).toISOString() // 3.5 hours ago
    },
    {
      title: 'European markets close higher on economic optimism',
      source: 'CNBC',
      url: 'https://www.cnbc.com/world/',
      published: new Date(baseTime - 14400000).toISOString() // 4 hours ago
    },
    {
      title: 'Gold prices steady as investors await inflation data',
      source: 'Reuters',
      url: 'https://www.reuters.com/markets/commodities/',
      published: new Date(baseTime - 16200000).toISOString() // 4.5 hours ago
    },
    {
      title: 'Apple announces record quarterly revenue',
      source: 'Bloomberg',
      url: 'https://www.bloomberg.com/technology',
      published: new Date(baseTime - 18000000).toISOString() // 5 hours ago
    },
    {
      title: 'U.S. jobless claims fall to lowest level in months',
      source: 'WSJ',
      url: 'https://www.wsj.com/economy',
      published: new Date(baseTime - 19800000).toISOString() // 5.5 hours ago
    },
    {
      title: 'JPMorgan raises year-end S&P 500 target',
      source: 'Financial Times',
      url: 'https://www.ft.com/',
      published: new Date(baseTime - 21600000).toISOString() // 6 hours ago
    },
    {
      title: 'Asian markets mixed as China GDP data released',
      source: 'CNBC',
      url: 'https://www.cnbc.com/asia/',
      published: new Date(baseTime - 23400000).toISOString() // 6.5 hours ago
    },
    {
      title: 'Treasury yields rise after strong retail sales',
      source: 'Bloomberg',
      url: 'https://www.bloomberg.com/markets/rates-bonds',
      published: new Date(baseTime - 25200000).toISOString() // 7 hours ago
    },
    {
      title: 'Ethereum network upgrade successfully completed',
      source: 'CoinDesk',
      url: 'https://www.coindesk.com/tech/',
      published: new Date(baseTime - 27000000).toISOString() // 7.5 hours ago
    }
  ];
}

// Get system stats
app.get('/api/system', async (req, res) => {
  try {
    const stats = await systemStats.getStats();
    res.json(stats);
  } catch (error) {
    console.error('System stats API error:', error);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
});

// Get configuration
app.get('/api/config', (req, res) => {
  const config = loadConfig();
  if (config) {
    res.json(config);
  } else {
    res.status(500).json({ error: 'Failed to load configuration' });
  }
});

// Update configuration
app.post('/api/config', (req, res) => {
  const newConfig = req.body;
  if (saveConfig(newConfig)) {
    // Clear crypto cache to force immediate refresh on dashboard
    crypto.clearCache();
    res.json({ success: true, message: 'Configuration saved. Please reload the dashboard to see changes.' });
  } else {
    res.status(500).json({ success: false, error: 'Failed to save configuration' });
  }
});

// Serve main dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve config page
app.get('/config', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/config.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Dashboard server running on http://localhost:${PORT}`);
  console.log(`Config page: http://localhost:${PORT}/config`);
});
