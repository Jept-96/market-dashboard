const https = require('https');

class CryptoService {
  constructor() {
    this.cache = {};
    this.lastFetch = 0;
    this.cacheDuration = 15000; // 15 seconds cache
  }

  clearCache() {
    this.cache = {};
    this.lastFetch = 0;
  }

  // Fetch global crypto market data
  async fetchGlobalData() {
    try {
      // Fetch global market data from CoinGecko
      const globalUrl = 'https://api.coingecko.com/api/v3/global';
      const globalData = await this.httpsGet(globalUrl);
      const global = JSON.parse(globalData);

      // Fetch fear & greed index (using alternative.me API)
      const fgUrl = 'https://api.alternative.me/fng/?limit=1';
      const fgData = await this.httpsGet(fgUrl);
      const fearGreed = JSON.parse(fgData);

      const fearGreedValue = parseInt(fearGreed.data[0].value);
      let fearGreedText = 'Neutral';
      if (fearGreedValue < 25) fearGreedText = 'Extreme Fear';
      else if (fearGreedValue < 40) fearGreedText = 'Fear';
      else if (fearGreedValue < 60) fearGreedText = 'Neutral';
      else if (fearGreedValue < 75) fearGreedText = 'Greed';
      else fearGreedText = 'Extreme Greed';

      return {
        fearGreedIndex: fearGreedValue,
        fearGreedText: fearGreedText,
        btcDominance: global.data.market_cap_percentage.btc || 0,
        totalMarketCap: global.data.total_market_cap.usd || 0,
        totalVolume: global.data.total_volume.usd || 0
      };
    } catch (error) {
      console.error('Error fetching global crypto data:', error.message);
      // Return default values
      return {
        fearGreedIndex: 50,
        fearGreedText: 'Neutral',
        btcDominance: 50,
        totalMarketCap: 0,
        totalVolume: 0
      };
    }
  }

  // Fetch top 50 coins with full market data
  async fetchTopCoins(limit = 50) {
    const now = Date.now();

    // Return cached data if still fresh
    if (now - this.lastFetch < this.cacheDuration && this.cache.length > 0) {
      return this.cache;
    }

    try {
      // Using CoinGecko's markets endpoint for comprehensive data
      const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=24h`;

      const data = await this.httpsGet(url);
      const markets = JSON.parse(data);

      // Transform to our format
      const result = markets.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        image: coin.image,
        currentPrice: coin.current_price,
        priceChange24h: coin.price_change_percentage_24h,
        high24h: coin.high_24h,
        low24h: coin.low_24h,
        marketCap: coin.market_cap,
        volume24h: coin.total_volume,
        circulatingSupply: coin.circulating_supply,
        sparkline: coin.sparkline_in_7d?.price || [],
        lastUpdated: coin.last_updated
      }));

      this.cache = result;
      this.lastFetch = now;
      return result;
    } catch (error) {
      console.error('Error fetching crypto data:', error.message);
      // Return cached data if available, otherwise empty array
      return this.cache.length > 0 ? this.cache : [];
    }
  }

  httpsGet(url) {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      };

      https.get(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            resolve(data);
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      }).on('error', reject);
    });
  }
}

module.exports = new CryptoService();
