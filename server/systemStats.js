const si = require('systeminformation');
const os = require('os');

class SystemStats {
  constructor() {
    this.cache = {};
    this.lastFetch = 0;
    this.cacheDuration = 2000; // 2 seconds cache
  }

  async getStats() {
    const now = Date.now();

    // Return cached data if still fresh
    if (now - this.lastFetch < this.cacheDuration && Object.keys(this.cache).length > 0) {
      return this.cache;
    }

    try {
      const [cpuLoad, cpuTemp, mem, networkStats, graphics] = await Promise.all([
        si.currentLoad(),
        si.cpuTemperature(),
        si.mem(),
        si.networkStats(),
        si.graphics()
      ]);

      // CPU stats
      const cpu = {
        usage: Math.round(cpuLoad.currentLoad) || 0,
        temp: Math.round(cpuTemp.main) || 0
      };

      // GPU stats
      let gpu = { usage: 0, temp: 0 };
      if (graphics.controllers && graphics.controllers.length > 0) {
        const gpuController = graphics.controllers[0];
        gpu.usage = Math.round(gpuController.utilizationGpu) || 0;
        gpu.temp = Math.round(gpuController.temperatureGpu) || 0;
      }

      // RAM stats
      const ram = {
        used: (mem.used / (1024 ** 3)).toFixed(1), // GB
        total: (mem.total / (1024 ** 3)).toFixed(1) // GB
      };

      // Network stats (primary interface)
      let network = { down: 0, up: 0 };
      if (networkStats && networkStats.length > 0) {
        const netInterface = networkStats[0];
        network.down = (netInterface.rx_sec / (1024 ** 2)).toFixed(1); // MB/s
        network.up = (netInterface.tx_sec / (1024 ** 2)).toFixed(1); // MB/s
      }

      const result = { cpu, gpu, ram, network };
      this.cache = result;
      this.lastFetch = now;

      return result;
    } catch (error) {
      console.error('Error fetching system stats:', error.message);
      // Return cached data if available, otherwise default values
      return Object.keys(this.cache).length > 0 ? this.cache : {
        cpu: { usage: 0, temp: 0 },
        gpu: { usage: 0, temp: 0 },
        ram: { used: 0, total: 0 },
        network: { down: 0, up: 0 }
      };
    }
  }
}

module.exports = new SystemStats();
