# Space Explorer — 3D Solar System Observatory (`کاوشگر فضا`)

An interactive, bilingual (Persian RTL & English LTR) 3D Solar System Observatory built with **React 19**, **TypeScript**, **Three.js**, **Tailwind CSS v4**, and **Vite 8**. Designed in Google Stitch and upgraded with a persistent WebGL Solar System, scroll-synchronized planetary choreography, procedural planetary & lunar surface textures, and interactive 3D moon exploration.

---

## 1. Environment & Node.js / npm Requirements

- **Node.js**: `^20.19.0 || >=22.12.0` (Recommended LTS: **Node.js `22.14.0`**, specified in `.nvmrc`)
- **npm**: `>=10.0.0` (Tested with `npm 10.9.x`)

### Why Dependency Stabilization Was Needed
`vite@8.3.5` requires `esbuild@^0.27.0 || ^0.28.0` as a peer dependency. An older `esbuild@^0.25.0` entry in `devDependencies` previously triggered an `npm ERESOLVE` peer-dependency conflict on fresh installs. Upgrading `esbuild` to `^0.28.0` (`0.28.2`) and replacing Unix-only `rm -rf` scripts with cross-platform Node `fs.rmSync` ensures clean installs (`npm install` and `npm ci`) across **Windows PowerShell**, **macOS**, and **Linux** without `--legacy-peer-deps` or `--force`.

---

## 2. Quick Start (Windows PowerShell, macOS & Linux)

### Standard Install & Development Server
```powershell
# 1. Install exact locked dependencies cleanly (no flags needed)
npm ci

# 2. Start the development server on http://localhost:3000
npm run dev
```

### Clean Reinstall on Windows PowerShell (If Upgrading from an Older Checkout)
```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
npm run dev
```

### Validation, Unit Tests & Production Build
```powershell
# Run astronomy & orbital unit tests (Node built-in test runner via tsx)
npm test

# Run TypeScript typechecking
npm run lint

# Build production bundle into dist/
npm run build

# Cross-platform clean of dist/ and server.js
npm run clean
```

---

## 3. Features & Architecture

- **Persistent Three.js Solar System (`src/components/SolarSystemCanvas.tsx`)**:
  - Single persistent WebGL canvas mounted across scroll sections and view transitions.
  - Scroll-driven camera choreography visiting the **Overview**, **Sun**, **Mercury**, **Venus**, **Earth**, **Mars**, **Asteroid Belt**, **Jupiter**, **Saturn**, **Uranus**, and **Neptune**.
  - Aspect-ratio-aware camera framing (`viewportAspect < 0.95`) that elevates the 3D planet into the upper viewport on mobile portrait screens so bottom-aligned telemetry cards never obscure the planet.
  - Automatic `prefers-reduced-motion` detection and graceful WebGL context-loss fallback.
- **12 Interactive 3D Moons + Reference Moon Catalogs (`src/data/solarSystemData.ts`)**:
  - **Earth**: `Moon (Luna)` with dedicated 3D camera focus and return-to-Earth transition.
  - **Mars**: `Phobos`, `Deimos`
  - **Jupiter**: `Io`, `Europa`, `Ganymede`, `Callisto` (+ Reference catalog: Amalthea, Himalia, Thebe, Metis)
  - **Saturn**: `Enceladus`, `Titan` (+ Reference catalog: Mimas, Dione, Rhea, Iapetus, Hyperion)
  - **Uranus**: `Titania`, `Oberon` (+ Reference catalog: Miranda, Ariel, Umbriel, Puck)
  - **Neptune**: `Triton` (+ Reference catalog: Proteus, Nereid, Larissa, Galatea)
- **Self-Contained Procedural Planetary & Lunar Textures (`src/three/proceduralTextures.ts`)**:
  - Zero external texture network dependencies or CORS failures; all planetary surfaces, normal/bump maps, Earth continent/cloud layers, Jupiter storm bands & Great Red Spot, Saturn multi-band Cassini division rings, and 8 distinct lunar surface archetypes are generated deterministically via HTML5 2D Canvas and cached in memory.
  - Because all textures are procedurally synthesized in code, no third-party image attribution is required.
- **Responsive Navigation (`src/components/Header.tsx`)**:
  - Desktop (`>= 1024px`) preserves the inline navigation bar, quick-jump planetary strip, and simulation controls.
  - Mobile & Tablet (`< 1024px`) provides an accessible hamburger menu button (`aria-expanded`, `aria-controls`) with a slide-down drawer supporting all 4 views, all 11 orbital stations, simulation speed/orbit/label toggles, `Escape` key closing, outside-click dismissal, and automatic close on resize to desktop.
