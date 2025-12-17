// Configuration Page JavaScript

let config = null;

// Setup video mode toggle
function setupVideoModeToggle() {
  const videoModeRadios = document.querySelectorAll('input[name="videoMode"]');
  const manualVideoSelector = document.getElementById('manualVideoSelector');

  videoModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'manual') {
        manualVideoSelector.style.display = 'block';
      } else {
        manualVideoSelector.style.display = 'none';
      }
    });
  });
}

// Load configuration on page load
window.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  setupVideoModeToggle();
});

async function loadConfig() {
  try {
    const response = await fetch('/api/config');
    config = await response.json();

    // Populate form fields
    document.getElementById('refreshInterval').value = config.crypto?.refreshInterval || 60;
    document.getElementById('powerSaving').checked = config.powerSaving?.enabled || false;
    document.getElementById('videoEnabled').checked = config.display?.videoBackground?.enabled || false;
    document.getElementById('greenVideo').value = config.display?.videoBackground?.greenVideo || 'green.mp4';
    document.getElementById('neutralVideo').value = config.display?.videoBackground?.neutralVideo || 'neutral.mp4';
    document.getElementById('redVideo').value = config.display?.videoBackground?.redVideo || 'red.mp4';

    // Populate video mode
    const videoMode = config.display?.videoBackground?.mode || 'auto';
    const manualVideoChoice = config.display?.videoBackground?.manualChoice || 'neutral';

    if (videoMode === 'manual') {
      document.getElementById('videoModeManual').checked = true;
      document.getElementById('manualVideoSelector').style.display = 'block';
    } else {
      document.getElementById('videoModeAuto').checked = true;
    }
    document.getElementById('manualVideoChoice').value = manualVideoChoice;

    // Render lists
    renderCryptoTokens();
    renderForexPairs();
    renderMarketIndices();
    renderStocks();
  } catch (error) {
    showNotification('Failed to load configuration', 'error');
    console.error('Load config error:', error);
  }
}

// Render Crypto Tokens
function renderCryptoTokens() {
  const container = document.getElementById('cryptoTokens');
  const tokens = config.crypto?.tokens || [];

  container.innerHTML = tokens.map((token, index) => `
    <div class="token-item">
      <input type="text" value="${token}" onchange="updateCryptoToken(${index}, this.value)" placeholder="Token ID (e.g., bitcoin)">
      <button class="btn btn-remove" onclick="removeCryptoToken(${index})">×</button>
    </div>
  `).join('');
}

function addCryptoToken() {
  if (!config.crypto.tokens) config.crypto.tokens = [];
  config.crypto.tokens.push('');
  renderCryptoTokens();
}

function updateCryptoToken(index, value) {
  config.crypto.tokens[index] = value.toLowerCase().trim();
}

function removeCryptoToken(index) {
  config.crypto.tokens.splice(index, 1);
  renderCryptoTokens();
}

// Render Forex Pairs
function renderForexPairs() {
  const container = document.getElementById('forexPairs');
  const pairs = config.forex?.pairs || [];

  container.innerHTML = pairs.map((pair, index) => `
    <div class="forex-item">
      <input type="text" value="${pair.from}" onchange="updateForexPair(${index}, 'from', this.value)" placeholder="From (e.g., USD)">
      <input type="text" value="${pair.to}" onchange="updateForexPair(${index}, 'to', this.value)" placeholder="To (e.g., SGD)">
      <input type="text" value="${pair.flag}" onchange="updateForexPair(${index}, 'flag', this.value)" placeholder="Flag" maxlength="2">
      <button class="btn btn-remove" onclick="removeForexPair(${index})">×</button>
    </div>
  `).join('');
}

function addForexPair() {
  if (!config.forex) config.forex = { enabled: true, pairs: [] };
  if (!config.forex.pairs) config.forex.pairs = [];
  config.forex.pairs.push({ from: '', to: '', flag: '💵' });
  renderForexPairs();
}

function updateForexPair(index, field, value) {
  config.forex.pairs[index][field] = value.toUpperCase().trim();
}

function removeForexPair(index) {
  config.forex.pairs.splice(index, 1);
  renderForexPairs();
}

// Render Market Indices
function renderMarketIndices() {
  const container = document.getElementById('marketIndices');
  const indices = config.market?.indices || [];

  container.innerHTML = indices.map((item, index) => `
    <div class="market-item-config">
      <input type="text" value="${item.symbol}" onchange="updateMarketIndex(${index}, 'symbol', this.value)" placeholder="Symbol (e.g., ^GSPC)">
      <input type="text" value="${item.name}" onchange="updateMarketIndex(${index}, 'name', this.value)" placeholder="Name (e.g., S&P 500)">
      <input type="text" value="${item.icon}" onchange="updateMarketIndex(${index}, 'icon', this.value)" placeholder="Icon" maxlength="2">
      <button class="btn btn-remove" onclick="removeMarketIndex(${index})">×</button>
    </div>
  `).join('');
}

function addMarketIndex() {
  if (!config.market) config.market = { indices: [], stocks: [] };
  if (!config.market.indices) config.market.indices = [];
  config.market.indices.push({ symbol: '', name: '', icon: '📈' });
  renderMarketIndices();
}

function updateMarketIndex(index, field, value) {
  config.market.indices[index][field] = value.trim();
}

function removeMarketIndex(index) {
  config.market.indices.splice(index, 1);
  renderMarketIndices();
}

// Render Stocks
function renderStocks() {
  const container = document.getElementById('stocksList');
  const stocks = config.market?.stocks || [];

  container.innerHTML = stocks.map((item, index) => `
    <div class="market-item-config">
      <input type="text" value="${item.symbol}" onchange="updateStock(${index}, 'symbol', this.value)" placeholder="Symbol (e.g., AAPL)">
      <input type="text" value="${item.name}" onchange="updateStock(${index}, 'name', this.value)" placeholder="Name (e.g., Apple)">
      <input type="text" value="${item.icon}" onchange="updateStock(${index}, 'icon', this.value)" placeholder="Icon" maxlength="2">
      <button class="btn btn-remove" onclick="removeStock(${index})">×</button>
    </div>
  `).join('');
}

function addStock() {
  if (!config.market) config.market = { indices: [], stocks: [] };
  if (!config.market.stocks) config.market.stocks = [];
  config.market.stocks.push({ symbol: '', name: '', icon: '📊' });
  renderStocks();
}

function updateStock(index, field, value) {
  config.market.stocks[index][field] = value.trim();
}

function removeStock(index) {
  config.market.stocks.splice(index, 1);
  renderStocks();
}

// Save Configuration
async function saveConfig() {
  try {
    // Update config from form
    config.crypto.refreshInterval = parseInt(document.getElementById('refreshInterval').value);
    config.powerSaving.enabled = document.getElementById('powerSaving').checked;

    // Update video background settings
    if (!config.display) config.display = {};
    if (!config.display.videoBackground) config.display.videoBackground = {};
    config.display.videoBackground.enabled = document.getElementById('videoEnabled').checked;
    config.display.videoBackground.greenVideo = document.getElementById('greenVideo').value.trim() || 'green.mp4';
    config.display.videoBackground.neutralVideo = document.getElementById('neutralVideo').value.trim() || 'neutral.mp4';
    config.display.videoBackground.redVideo = document.getElementById('redVideo').value.trim() || 'red.mp4';

    // Update video mode
    const videoModeRadio = document.querySelector('input[name="videoMode"]:checked');
    config.display.videoBackground.mode = videoModeRadio ? videoModeRadio.value : 'auto';
    config.display.videoBackground.manualChoice = document.getElementById('manualVideoChoice').value;

    // Filter out empty entries
    config.crypto.tokens = config.crypto.tokens.filter(t => t.trim() !== '');
    if (config.forex?.pairs) {
      config.forex.pairs = config.forex.pairs.filter(p => p.from && p.to);
    }
    if (config.market?.indices) {
      config.market.indices = config.market.indices.filter(i => i.symbol && i.name);
    }
    if (config.market?.stocks) {
      config.market.stocks = config.market.stocks.filter(s => s.symbol && s.name);
    }

    // Save to server
    const response = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });

    if (response.ok) {
      showNotification('Configuration saved successfully!', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else {
      showNotification('Failed to save configuration', 'error');
    }
  } catch (error) {
    showNotification('Failed to save configuration', 'error');
    console.error('Save config error:', error);
  }
}

// Reset to Default
async function resetToDefault() {
  if (!confirm('Are you sure you want to reset to default configuration? This will reload the page.')) {
    return;
  }

  const defaultConfig = {
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
        { "symbol": "^IXIC", "name": "Nasdaq Composite", "icon": "💻" },
        { "symbol": "^DJI", "name": "Dow Jones", "icon": "🏛️" },
        { "symbol": "^RUT", "name": "Russell 2000", "icon": "📊" },
        { "symbol": "^VIX", "name": "VIX", "icon": "⚡" }
      ],
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
    },
    "display": {
      "theme": "dark",
      "videoBackground": {
        "enabled": true,
        "mode": "auto",
        "manualChoice": "neutral",
        "greenVideo": "green.mp4",
        "neutralVideo": "neutral.mp4",
        "redVideo": "red.mp4"
      }
    },
    "powerSaving": {
      "enabled": true,
      "description": "Power-optimized for 24/7 display panel usage"
    }
  };

  config = defaultConfig;

  try {
    const response = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });

    if (response.ok) {
      showNotification('Reset to default configuration', 'success');
      setTimeout(() => location.reload(), 1000);
    }
  } catch (error) {
    showNotification('Failed to reset configuration', 'error');
  }
}

// Show Notification
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Button Event Listeners
document.getElementById('saveBtn').addEventListener('click', saveConfig);
document.getElementById('saveFooterBtn').addEventListener('click', saveConfig);
document.getElementById('resetBtn').addEventListener('click', resetToDefault);
