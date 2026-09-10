# Customer App - Order Flow & Status Tracking

An interactive, high-fidelity mobile order tracking experience built with **React**, **Tailwind CSS**, and **Framer Motion**. Designed for laundry, dry cleaning, and specialty garment care platforms.

---

## 📱 Features

- **Realistic iPhone Shell Preview**: Pixel-accurate mobile viewport with Dynamic Island, status bar, and smooth spring-based transitions.
- **Single & Multi-Service Tracking**:
  - Supports individual services as well as multi-service bundles (2-Service and 5-Service orders).
  - Synchronized progress progression across bundled services.
  - In-card multi-service tab bars: **Underline**, **Pills**, **Rings**, and **Chips**.
- **Interactive Timeline & Processing Drawer**:
  - Full end-to-end timeline from **Order Placed** to **Delivered**.
  - Expandable **Processing** sub-steps drawer with auto-height animations.
  - Dedicated workflow for **Premium Care**:
    1. *VIP Assessment*
    2. *Quote Confirmation*
    3. *Eco Solvent & Hand Cleaning*
    4. *Hand-Finishing & Restoration*
    5. *Premium Packaging*
- **Customizable Layouts & Line Styles**:
  - Layout variants: *List*, *Overlap Stack*, *Service Below*, and *Icon Below*.
  - Timeline styles: *Solid*, *Dashed*, *Dotted*, *Split Rail*, *Segments*, *Nodes*, *Num Circle*, *01 Mono*, and *Squircle*.
  - Dynamic **Pattern Rail** that seamlessly scales with the active timeline height.
- **Interactive Simulation Engine**:
  - Live order progression simulation with step intervals and pause/resume.
  - Manual step selection by clicking timeline milestones directly.
  - Hidden developer control panel toggleable via keyboard shortcut (`C`) or URL parameter (`?controls=true`).

---

## 🧺 Supported Services

| Service | Category | Steps |
|---|---|---|
| **Wash & Fold** | Daily Laundry | 9 Steps |
| **Clean & Press** | Formal & Garments | 9 Steps |
| **Press Only** | Ironing & Finishing | 8 Steps |
| **Bed & Bath** | Linens & Towels | 8 Steps |
| **Bags & Shoes** | Leather & Accessories | 9 Steps |
| **Premium Care** | Luxury & Delicate Items | 5 Custom Sub-steps |
| **2 Service Bundle** | Multi-service Order | Sync Timeline |
| **5 Service Bundle** | Multi-service Order | Sync Timeline |

---

## 🛠 Tech Stack

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Language**: JavaScript (ESM)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:IRQGYP/customer-app-steps-flow.git
   cd customer-app-steps-flow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⌨️ Controls & Shortcuts

- **Toggle Controls Panel**: Press <kbd>C</kbd> on your keyboard to reveal/hide the developer simulation and styling controls.
- **URL Parameter**: Append `?controls=true` to the URL (e.g. `http://localhost:5173/?controls=true`) to load with controls visible by default.

---

## 📦 Build & Deployment

To create an optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 📄 License

Private & Proprietary. All rights reserved.
