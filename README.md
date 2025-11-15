# 🚀 Traffic Flow Prediction (Frontend)

> The frontend user interface for a multi-model traffic prediction dashboard — a lightweight, responsive static site that lets users pick a prediction engine, interact with maps, and view model-specific visualizations.

[![GitHub Repo](https://img.shields.io/badge/repo-Traffic--Flow--Prediction--Frontend-blue)](https://github.com/PrajwalShetty-114/Traffic-Flow-Prediction-Frontend) [![Status](https://img.shields.io/badge/status-active-brightgreen)](#)

---

### ✨ Key Features

- **Dynamic Theme Toggle:** A sleek light/dark mode switch (see `assets/js/theme-toggle.js` and `assets/css/style.css`) that remembers the user's choice using `localStorage`.
- **Responsive Design:** Mobile-first, responsive layout with media queries and a hamburger menu for small screens (see `assets/js/main.js` and `assets/css/style.css`).
- **Dual-Dashboard System:**
  - **Simple Dashboard:** `dashboard.html` — a straightforward map + controls view for quick predictions.
  - **Model Selection Page:** `modelSelection.html` — creative card-based model chooser (Lottie animations on each card).
  - **Expert Dashboard:** `expert-dashboard.html` + `assets/js/expert-dashboard.js` — a dynamic interface that changes forms, map behavior, and chart types depending on the selected expert model.
- **Rich Animations:** Lottie animations are used on the model selection cards for a polished interactive experience (`assets/js/model-selection.js`).
- **Interactive Map:** Leaflet.js powered maps allow users to click anywhere to select a location (`assets/js/dashboard.js`, `assets/js/expert-dashboard.js`).
- **Dynamic Charts:** Chart.js is used to render model-specific charts (line, bar, pie) in the expert views.

---

## 🛠️ Tech Stack

- **Core:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Libraries:**
  - Leaflet.js (maps)
  - Chart.js (charts)
  - Lottie / lottie-player (animations)
- **Tools & Assets:** Font Awesome, Google Fonts

---

## 📂 Project Structure

Top-level frontend layout (important files/folders):

```
frontend/
├─ index.html
├─ dashboard.html
├─ expert-dashboard.html
├─ modelSelection.html
├─ methodology.html
├─ assets/
│  ├─ css/
│  │  └─ style.css
│  ├─ images/
│  ├─ js/
│  │  ├─ main.js
│  │  ├─ dashboard.js
│  │  ├─ expert-dashboard.js
│  │  ├─ model-selection.js
│  │  └─ theme-toggle.js
│  └─ lottie/
│     └─ (animations .json)
```

The `assets` folder contains all front-end resources: stylesheets, images, JavaScript logic, and Lottie animations.

---

## 🏃 How to Run Locally

This is a static frontend. There are two simple ways to run it locally:

1. Open files directly

   - Open `index.html` (or `dashboard.html`) in your browser. Note: for full functionality you still need the backend (see below).

2. Serve with a lightweight HTTP server (recommended)

   - Using Python 3:

   ```bash
   cd frontend
   python -m http.server 8000
   # Then open http://localhost:8000 in your browser
   ```

   - Or using `npx serve`:

   ```bash
   cd frontend
   npx serve -s . -l 8000
   # Then open http://localhost:8000
   ```

### Note: Backend required for predictions

The frontend makes API calls to a backend gateway. To use the dashboards end-to-end, run the backend service in the repository root `backend/` folder. Typical commands in the `backend` folder are:

```bash
cd backend
# install dependencies (if not already)
npm install
# start the API gateway (example)
npm start
# or
node server.js
```

The frontend expects the gateway at `http://localhost:3000` (see `assets/js/expert-dashboard.js`, `assets/js/dashboard.js`).

---

## 🌐 API Connection

This repository contains only the frontend UI. Prediction requests are sent to a separate **Node.js Backend Gateway** (in the sibling `backend/` folder), which in turn routes to Python ML microservices. The frontend passes a JSON payload describing the chosen model, coordinates and prediction options to the gateway endpoint(s) (for example: `/api/predict`, `/api/expert-predict`).

---

## 🔧 Development Tips & Troubleshooting

- If charts fail to initialize with `Chart is not defined`, ensure the correct Chart.js UMD build is loaded. The project uses the UMD script for broad compatibility.
- Leaflet map rendering can sometimes appear blank on layout changes — the code calls `map.invalidateSize()` after initialization and on window resize to fix this. If the map appears clipped, try resizing the browser or reloading.
- Model selection uses `localStorage` key `selectedPredictionModel` to pass the selected model to the Expert Dashboard. If the expert dashboard always loads the default model, check that the selection page sets this key correctly.

---

## ✅ Quick Feature Map (where to look)

- Theme toggle: `assets/js/theme-toggle.js` + `assets/css/style.css`
- Hamburger / nav: `assets/js/main.js`
- Model selection + Lottie: `modelSelection.html`, `assets/js/model-selection.js`, `assets/lottie/`
- Dashboards & map interactions: `dashboard.html`, `expert-dashboard.html`, `assets/js/dashboard.js`, `assets/js/expert-dashboard.js`

---

## ❤️ Contributing

If you'd like to improve the frontend: fix bugs, tune responsive breakpoints, or add accessibility features — feel free to open a pull request. Include a short description of the change and the pages tested.

---

Made with ❤️ in India — TrafficFlow AI
