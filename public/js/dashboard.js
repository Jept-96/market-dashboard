// Market Dashboard - Card-based Layout

let config = null;
let updateInterval = null;

// Specific coins to track
const TRACKED_COINS = ['bitcoin', 'ethereum', 'binancecoin', 'solana'];
const COIN_SYMBOLS = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'binancecoin': 'BNB',
  'solana': 'SOL'
};

// Initialize dashboard
async function init() {
  try {
    // Load configuration
    const response = await fetch('/api/config');
    config = await response.json();

    // Initial update
    await Promise.all([
      updateCrypto(),
      updateForex(),
      updateMarketOverview(),
      updateCryptoSentiment()
    ]);

    // Start auto-update
    startAutoUpdate();

    updateLastUpdate();
    updateMarketSentiment();
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Switch video background based on market sentiment
function switchVideoBackground(sentiment) {
  const greenVideo = document.getElementById('bgVideoGreen');
  const redVideo = document.getElementById('bgVideoRed');
  const neutralVideo = document.getElementById('bgVideoNeutral');

  // Remove active from all videos
  greenVideo.classList.remove('active');
  redVideo.classList.remove('active');
  neutralVideo.classList.remove('active');

  // Activate the appropriate video
  if (sentiment === 'bearish') {
    redVideo.classList.add('active');
  } else if (sentiment === 'bullish') {
    greenVideo.classList.add('active');
  } else {
    neutralVideo.classList.add('active');
  }
}

// Start auto-update loop
function startAutoUpdate() {
  const interval = (config?.crypto?.refreshInterval || 30) * 1000;
  updateInterval = setInterval(async () => {
    await Promise.all([
      updateCrypto(),
      updateForex(),
      updateMarketOverview(),
      updateCryptoSentiment()
    ]);
    updateLastUpdate();
    updateMarketSentiment();
  }, interval);
}

// Update crypto cards
async function updateCrypto() {
  try {
    const response = await fetch('/api/crypto');
    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn('No crypto data');
      return;
    }

    // Filter to our tracked coins
    const trackedData = data.filter(coin => TRACKED_COINS.includes(coin.id));

    renderCryptoCards(trackedData);
  } catch (error) {
    console.error('Error updating crypto:', error);
  }
}

// Render crypto cards
function renderCryptoCards(coins) {
  const container = document.getElementById('cryptoCards');

  let html = '';
  coins.forEach(coin => {
    const changeClass = coin.priceChange24h >= 0 ? 'positive' : 'negative';
    const changeIcon = coin.priceChange24h >= 0 ? '▲' : '▼';

    html += `
      <div class="card">
        <div class="crypto-card-header">
          <img src="${coin.image}" alt="${coin.symbol}" class="crypto-logo">
          <div class="crypto-info">
            <span class="crypto-symbol">${coin.symbol}</span>
            <span class="crypto-name">${coin.name}</span>
          </div>
        </div>

        <div class="crypto-price">${formatPrice(coin.currentPrice)}</div>

        <div class="crypto-change ${changeClass}">
          <span class="change-icon">${changeIcon}</span>
          <span>${Math.abs(coin.priceChange24h).toFixed(2)}%</span>
        </div>

        <div class="sparkline">
          ${generateSparkline(coin.sparkline, coin.priceChange24h >= 0)}
        </div>

        <div class="crypto-stats">
          <div class="stat">
            <span class="stat-label">24h High</span>
            <span class="stat-value">${formatPrice(coin.high24h)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">24h Low</span>
            <span class="stat-value">${formatPrice(coin.low24h)}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Update forex rates
async function updateForex() {
  try {
    const response = await fetch('/api/forex');
    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn('No forex data');
      return;
    }

    renderForexCards(data);
  } catch (error) {
    console.error('Error updating forex:', error);
  }
}

// Render forex cards
function renderForexCards(rates) {
  const container = document.getElementById('forexCards');

  let html = '';
  rates.forEach(rate => {
    html += `
      <div class="card">
        <div class="forex-card-header">
          <span class="forex-pair">${rate.pair}</span>
          <span class="forex-flag">${rate.flag}</span>
        </div>

        <div class="forex-rate">${rate.rate.toFixed(4)}</div>

        <div class="forex-info">
          <span>1 ${rate.from} = ${rate.rate.toFixed(4)} ${rate.to}</span>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Generate sparkline
function generateSparkline(data, isPositive) {
  if (!data || data.length === 0) {
    return '<div class="sparkline"></div>';
  }

  const sampleSize = 30;
  const step = Math.max(1, Math.floor(data.length / sampleSize));
  const sampledData = data.filter((_, i) => i % step === 0).slice(0, sampleSize);

  const max = Math.max(...sampledData);
  const min = Math.min(...sampledData);
  const range = max - min || 1;

  const width = 240;
  const height = 60;
  const points = sampledData.map((val, i) => {
    const x = (i / (sampledData.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  const color = isPositive ? '#0ECB81' : '#F6465D';
  const gradientId = `gradient-${Date.now()}-${Math.random()}`;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:${color};stop-opacity:0" />
        </linearGradient>
      </defs>
      <polyline
        points="${points}"
        fill="none"
        stroke="${color}"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <polyline
        points="0,${height} ${points} ${width},${height}"
        fill="url(#${gradientId})"
        stroke="none"
      />
    </svg>
  `;
}

// Format price
function formatPrice(price) {
  if (!price) return '$0.00';

  if (price >= 1000) {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  } else if (price >= 1) {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else if (price >= 0.01) {
    return '$' + price.toFixed(4);
  } else {
    return '$' + price.toFixed(6);
  }
}

// Format large numbers
function formatLargeNumber(num) {
  if (!num) return '$0';

  if (num >= 1e12) {
    return '$' + (num / 1e12).toFixed(2) + 'T';
  } else if (num >= 1e9) {
    return '$' + (num / 1e9).toFixed(2) + 'B';
  } else if (num >= 1e6) {
    return '$' + (num / 1e6).toFixed(2) + 'M';
  } else if (num >= 1e3) {
    return '$' + (num / 1e3).toFixed(2) + 'K';
  } else {
    return '$' + num.toFixed(2);
  }
}

// Update market overview
async function updateMarketOverview() {
  try {
    const response = await fetch('/api/market-overview');
    const data = await response.json();

    if (!data) {
      console.warn('No market overview data');
      return;
    }

    renderMarketOverview(data);
  } catch (error) {
    console.error('Error updating market overview:', error);
  }
}

// Render market overview
function renderMarketOverview(data) {
  const container = document.getElementById('marketOverview');

  const html = `
    <div class="overview-grid">
      <div class="overview-item">
        <div class="overview-icon">📊</div>
        <div class="overview-label">Stocks</div>
        <div class="overview-value ${data.stocks.change >= 0 ? 'positive' : 'negative'}">
          <span class="overview-arrow">${data.stocks.change >= 0 ? '▲' : '▼'}</span>
          ${Math.abs(data.stocks.change).toFixed(2)}%
        </div>
        <div class="overview-subtext">${data.stocks.trend}</div>
        <div class="overview-subtext">${data.stocks.session}</div>
        <div class="overview-subtext">S&P 500: ${data.stocks.price.toFixed(2)}</div>
      </div>

      <div class="overview-item">
        <div class="overview-icon">💱</div>
        <div class="overview-label">Forex</div>
        <div class="overview-value ${data.forex.change >= 0 ? 'positive' : 'negative'}">
          <span class="overview-arrow">${data.forex.change >= 0 ? '▲' : '▼'}</span>
          ${Math.abs(data.forex.change).toFixed(2)}%
        </div>
        <div class="overview-subtext">${data.forex.strength}</div>
        <div class="overview-subtext">${data.forex.session}</div>
        <div class="overview-subtext">${data.forex.dollarTrend}</div>
      </div>

      <div class="overview-item">
        <div class="overview-icon">🌍</div>
        <div class="overview-label">Global Sentiment</div>
        <div class="overview-value ${data.sentiment === 'Risk On' ? 'positive' : data.sentiment === 'Risk Off' ? 'negative' : 'neutral'}">
          ${data.sentiment}
        </div>
        <div class="overview-subtext">${data.volatility}</div>
        <div class="overview-subtext">${data.marketDirection}</div>
        <div class="overview-subtext">VIX: ${data.vixValue}</div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// Update crypto sentiment
async function updateCryptoSentiment() {
  try {
    const response = await fetch('/api/crypto-sentiment');
    const data = await response.json();

    if (!data) {
      console.warn('No crypto sentiment data');
      return;
    }

    renderCryptoSentiment(data);
  } catch (error) {
    console.error('Error updating crypto sentiment:', error);
  }
}

// Render crypto sentiment
function renderCryptoSentiment(data) {
  const container = document.getElementById('cryptoSentiment');

  // Determine Fear & Greed class
  let fgClass = 'neutral';
  if (data.fearGreedIndex < 40) fgClass = 'fear';
  else if (data.fearGreedIndex > 60) fgClass = 'greed';

  const html = `
    <div class="sentiment-grid">
      <div class="sentiment-item" style="grid-column: 1 / -1;">
        <div class="sentiment-label">Fear & Greed Index</div>
        <div class="sentiment-value ${fgClass}">${data.fearGreedIndex}</div>
        <div class="sentiment-subtext">${data.fearGreedText}</div>
        <div class="fear-greed-bar">
          <div class="fear-greed-indicator" style="left: ${data.fearGreedIndex}%"></div>
        </div>
      </div>

      <div class="sentiment-item">
        <div class="sentiment-label">BTC Dominance</div>
        <div class="sentiment-value">${data.btcDominance.toFixed(2)}%</div>
      </div>

      <div class="sentiment-item">
        <div class="sentiment-label">Total Market Cap</div>
        <div class="sentiment-value">${formatLargeNumber(data.totalMarketCap)}</div>
      </div>

      <div class="sentiment-item" style="grid-column: 1 / -1;">
        <div class="sentiment-label">24h Trading Volume</div>
        <div class="sentiment-value">${formatLargeNumber(data.totalVolume)}</div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Calculate time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Update market sentiment border
function updateMarketSentiment() {
  const dashboard = document.querySelector('.dashboard');

  // Get all percentage changes from crypto ONLY
  const cryptoChanges = Array.from(document.querySelectorAll('.crypto-change')).map(el => {
    // Extract just the number from text like "▲ 3.59%" or "▼ 2.45%"
    const match = el.textContent.match(/[\d.]+/);
    if (!match) return 0;
    const value = parseFloat(match[0]);
    // Check if negative by looking at class
    return el.classList.contains('negative') ? -value : value;
  });

  if (cryptoChanges.length === 0) return;

  // Calculate average change
  const avgChange = cryptoChanges.reduce((a, b) => a + b, 0) / cryptoChanges.length;

  // Determine sentiment: bullish (>0.5%), neutral (-0.5% to 0.5%), bearish (<-0.5%)
  let sentiment = 'neutral';
  if (avgChange > 0.5) {
    sentiment = 'bullish';
  } else if (avgChange < -0.5) {
    sentiment = 'bearish';
  }

  console.log('Market Sentiment Debug:', {
    cryptoChanges,
    avgChange: avgChange.toFixed(2) + '%',
    sentiment: sentiment.toUpperCase()
  });

  // Check video mode
  const videoMode = config?.display?.videoBackground?.mode || 'auto';

  if (videoMode === 'auto') {
    // Auto mode - update border and video based on sentiment
    dashboard.classList.remove('bearish', 'neutral', 'bullish');

    if (sentiment === 'bearish') {
      dashboard.classList.add('bearish');
    } else if (sentiment === 'neutral') {
      dashboard.classList.add('neutral');
    } else {
      dashboard.classList.add('bullish');
    }

    // Switch video background
    switchVideoBackground(sentiment);
  } else {
    // Manual mode - use the configured manual choice
    const manualChoice = config?.display?.videoBackground?.manualChoice || 'neutral';

    // Update border based on manual choice
    dashboard.classList.remove('bearish', 'neutral', 'bullish');

    // Map manual choice to sentiment and border class
    let videoSentiment = 'neutral';
    if (manualChoice === 'red') {
      dashboard.classList.add('bearish');
      videoSentiment = 'bearish';
    } else if (manualChoice === 'neutral') {
      dashboard.classList.add('neutral');
      videoSentiment = 'neutral';
    } else if (manualChoice === 'green') {
      dashboard.classList.add('bullish');
      videoSentiment = 'bullish';
    }

    // Switch video background with mapped sentiment
    switchVideoBackground(videoSentiment);
  }
}

// Update last update time
function updateLastUpdate() {
  const lastUpdate = document.getElementById('lastUpdate');
  if (lastUpdate) {
    const now = new Date();
    lastUpdate.textContent = `Last updated: ${now.toLocaleTimeString()}`;
  }
}

// Start the dashboard
init();
