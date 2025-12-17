# Power Optimization Guide for 24/7 Display Panel

This dashboard is designed to run 24/7 on your laptop with minimal power consumption. Here's how to optimize it:

## Already Optimized in the Code

✅ **Refresh interval increased to 60 seconds** (from 30s)
- Reduces API calls by 50%
- Less CPU processing
- Lower network usage

✅ **Efficient caching system**
- 15-second cache on crypto API
- Reduces unnecessary API requests

✅ **Lightweight server**
- Node.js Express is very efficient
- Minimal memory footprint (~50-80MB)

✅ **Optimized frontend**
- No heavy frameworks (vanilla JS)
- Minimal DOM updates
- CSS animations use GPU acceleration
- Static SVG charts (no heavy charting libraries)

## Additional Power Saving Steps

### 1. Windows Power Settings (IMPORTANT)

**Step 1: Power Plan**
- Open **Control Panel** → **Power Options**
- Select **Power saver** plan
- Click **Change plan settings** → **Change advanced power settings**

**Step 2: Configure these settings:**
```
Processor power management:
  - Minimum processor state: 5%
  - Maximum processor state: 50-70% (sufficient for this dashboard)

Display:
  - Turn off display: Never (for portable monitor)

Sleep:
  - Sleep after: Never
  - Hibernate after: Never

PCI Express:
  - Link State Power Management: Maximum power savings

Wireless Adapter Settings:
  - Power Saving Mode: Maximum Performance (if using WiFi for APIs)
```

**Step 3: Laptop Lid Settings**
- Control Panel → Power Options → Choose what closing the lid does
- When I close the lid (Plugged in): **Do nothing**
- This allows laptop to run with lid closed

### 2. Display Settings

**Reduce Brightness on Portable Monitor:**
- Lower brightness = less power consumption
- Adjust using monitor's physical buttons
- Recommended: 40-60% brightness for 24/7 use

**Disable Laptop's Built-in Display:**
- Right-click Desktop → **Display Settings**
- Select laptop display → Scroll down → **Disconnect this display**
- This saves significant power!

### 3. Browser Optimization

**Chrome Power Saving:**
Chrome uses the most power. Here's how to reduce it:

1. **Use Hardware Acceleration:**
   - Chrome Settings → Advanced → System
   - Enable "Use hardware acceleration when available"
   - This offloads work to GPU (more efficient)

2. **Disable Unnecessary Extensions:**
   - Chrome uses more power with extensions
   - For kiosk mode, you don't need any

3. **Alternative: Use Edge Browser (More efficient on Windows)**
   Edit `start-dashboard-kiosk.bat` and change:
   ```batch
   start chrome --kiosk --app=http://localhost:3000
   ```
   To:
   ```batch
   start msedge --kiosk --app=http://localhost:3000
   ```
   Edge uses less battery on Windows laptops (10-15% improvement)

### 4. Disable Unnecessary Windows Features

**Turn off these background services:**
- Windows Search (if you don't need it)
- Windows Update (set to manual, update when needed)
- OneDrive sync (if not needed)
- Background apps

**How to do it:**
1. Press `Win + R` → type `services.msc`
2. Find and stop/disable these services:
   - Windows Search
   - SysMain (Superfetch)
   - Connected User Experiences and Telemetry

### 5. Increase Refresh Interval (Optional)

If you want even less power usage, you can increase the refresh interval:

**Edit:** `server/config.json`
```json
{
  "crypto": {
    "enabled": true,
    "coinLimit": 50,
    "refreshInterval": 120
  }
}
```

Change `60` to `120` (2 minutes) or even `300` (5 minutes).

For market data, 2-5 minutes is still reasonable and saves more power.

### 6. Network Optimization

**Use Ethernet Instead of WiFi:**
- WiFi radio uses more power than Ethernet
- If possible, connect laptop to router via cable
- Can reduce power consumption by 1-2W

### 7. Laptop Hardware Tips

**Battery Health (Long-term):**
- In BIOS/UEFI, look for "Battery Care" or "Conservation Mode"
- This limits charge to 60-80% to prolong battery life
- Available on many laptops (Lenovo, ASUS, HP, Dell)

**Cooling:**
- Ensure laptop has good ventilation
- Consider a laptop cooling pad
- Cooler laptop = more efficient = less power

## Expected Power Consumption

With these optimizations:
- **Node.js Server:** ~0.5-1W (very minimal)
- **Chrome/Edge Browser:** ~2-5W (in kiosk mode, minimal tabs)
- **Portable Monitor:** ~3-8W (depending on size and brightness)
- **Total System Idle:** ~15-25W

**Compare to:**
- Laptop normal use: 30-60W
- Laptop gaming: 60-120W

Your setup should be very efficient!

## Monitoring Power Usage

**Windows Battery Report:**
```batch
powercfg /batteryreport
```
This creates an HTML report showing power usage over time.

**Task Manager:**
- Press `Ctrl + Shift + Esc`
- Go to **Performance** tab
- Check **CPU** and **Memory** usage
- Node.js should be <1% CPU
- Chrome should be <5% CPU

## Summary - Quick Setup Checklist

- [ ] Copy dashboard folder to laptop
- [ ] Set Windows Power Plan to "Power saver"
- [ ] Set max CPU to 50-70%
- [ ] Disable laptop display (use only portable monitor)
- [ ] Lower portable monitor brightness to 40-60%
- [ ] Close laptop lid (set to "Do nothing")
- [ ] Consider using Edge instead of Chrome
- [ ] Optional: Increase refresh interval to 120+ seconds
- [ ] Optional: Use Ethernet instead of WiFi

## Result

Your laptop should run cool, quiet, and use minimal power - perfect for a 24/7 display panel!
