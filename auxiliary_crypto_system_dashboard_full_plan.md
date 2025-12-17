# Auxiliary Crypto & System Dashboard

A lightweight, horizontal, always-on dashboard for a portable HDMI monitor.

---

## 1. Project Overview

**Purpose**  
Create a **static, GPU-light auxiliary dashboard** that displays:
- Live crypto prices (top bar)
- System monitoring (CPU, GPU, RAM, network)
- Runs locally
- Auto-starts with Windows
- Easy configuration via a settings page

This dashboard is designed to behave like an **appliance**, not a web app.

---

## 2. Design Goals

- Ultra-low GPU usage
- No animations
- No frameworks
- No build process
- Static layout
- Horizontal screen orientation
- Readable from distance
- Dark theme (power efficient)

---

## 3. Target Display

**Orientation:** Horizontal  
**Recommended resolution:**
- 1920×480
- 1920×600
- 1920×720

**Refresh rate:** 30–60 Hz

---

## 4. Technology Stack

### Frontend
- HTML
- CSS
- Vanilla JavaScript

### Backend (Local)
- Node.js
- Express

### Data Sources
- Crypto prices: CoinGecko (server-side fetch)
- System stats: Node OS libraries

---

## 5. Application Structure

```
dashboard/
│
├── server/
│   ├── server.js
│   ├── systemStats.js
│   ├── crypto.js
│   └── config.json
│
├── public/
│   ├── index.html
│   ├── config.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── dashboard.js
│       └── config.js
│
└── startup/
    └── start.bat
```

---

## 6. Dashboard Layout (index.html)

### Section 1 – Crypto Bar (Top)

- Fixed height
- Displays selected crypto symbols
- Example:
  - BTC | ETH | SOL | TIME

Update interval: **15–30 seconds**

---

### Section 2 – System Monitoring

Displayed as rows with text + simple bars:

- CPU usage (%)
- CPU temperature (°C)
- GPU usage (%)
- GPU temperature (°C)
- RAM usage (GB)
- Network up/down

Update interval: **2–5 seconds**

---

### Section 3 – Status / Alerts (Optional)

- Text only
- Used for:
  - Price alerts
  - System warnings
  - Custom messages

---

## 7. Configuration Page (config.html)

Accessible via browser manually (not on the dashboard screen).

### Configurable Options

**Crypto Settings**
- Enable / disable symbols
- Set symbols list
- Set refresh interval

**System Widgets**
- Toggle CPU stats
- Toggle GPU stats
- Toggle RAM stats
- Toggle network stats

**Display Settings**
- Theme (dark only for MVP)
- Temperature unit (°C / °F)

All settings saved to:
```
server/config.json
```

---

## 8. Backend API Design

### `/api/crypto`
Returns:
```
{
  "BTC": 68420,
  "ETH": 3520,
  "SOL": 145
}
```

### `/api/system`
Returns:
```
{
  "cpu": { "usage": 32, "temp": 58 },
  "gpu": { "usage": 21, "temp": 62 },
  "ram": { "used": 12.4, "total": 32 },
  "network": { "down": 12, "up": 2 }
}
```

---

## 9. Auto-Startup on Windows

### Behavior

On Windows boot:
1. Node server starts
2. Browser opens dashboard in app mode
3. Dashboard goes fullscreen
4. Runs on portable monitor

### Implementation

- `start.bat` launches:
  - Node server
  - Chrome / Edge in app mode

- Shortcut placed in:
```
shell:startup
```

---

## 10. Performance Strategy

- No canvas
- No WebGL
- No animations
- Text-only DOM updates
- Server-side data fetching
- Cached API responses
- Controlled polling intervals

Expected GPU usage: **near-zero**

---

## 11. MVP Scope (Phase 1)

Included:
- BTC / ETH / SOL prices
- CPU / GPU / RAM stats
- Config page
- Auto-start

Excluded:
- Alerts
- AI features
- Charts
- Animations

---

## 12. Future Enhancements (Optional)

- Price alerts
- Solana wallet tracking
- Telegram notifications
- AI-generated market commentary (text-only)
- Multi-theme support


---

## 14. Final Notes

This project intentionally avoids complexity. The value comes from **stability, clarity, and zero distraction**.

Treat it like a hardware dashboard — not a website.

