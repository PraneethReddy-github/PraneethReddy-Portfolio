# 🖥️ Praneeth's Interactive Portfolio (Ubuntu Desktop & iOS Replica)

[![Next.js](https://img.shields.io/badge/Next.js-13-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Python](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi)](https://fastapi.tiangolo.com/)

A state-of-the-art interactive web portfolio designed to deliver an authentic **Ubuntu 20.04 LTS Desktop Experience** on desktop computers and an immersive **iOS Replica Interface** on mobile devices.

Live Portfolio: **[praneethreddydev.web.app](https://praneethreddydev.web.app)**

---

## 🌟 Dual Device Architecture

The portfolio automatically detects the client device type and renders an interface tailored specifically for the user's viewport.

```
                     ┌───────────────────────────┐
                     │   Device Detection Layer  │
                     └─────────────┬─────────────┘
                                   │
                  ┌────────────────┴────────────────┐
                  ▼                                 ▼
    ┌──────────────────────────┐      ┌──────────────────────────┐
    │ 🖥️ Desktop Interface     │      │ 📱 Mobile Interface      │
    │ (Ubuntu 20.04 Desktop)   │      │ (iOS Replica Experience) │
    └──────────────────────────┘      └──────────────────────────┘
```

---

## 💻 1. Desktop Experience (Ubuntu 20.04 OS)

When opened on laptops or desktop screens, the portfolio launches a full-featured Linux desktop operating system simulation inside the browser.

### Key Desktop Features:
- **Full Window Manager:** Draggable, resizable, minimizable, and maximizable windows with z-index ordering and smooth desktop animations.
- **Top Bar & Side Dock:** Functional top bar with real-time clock, calendar dropdown, network status, volume controls, and power options.
- **Desktop Icons & Context Menu:** Right-click context menus, shortcut creation, wallpaper customization, and terminal launching.
- **Lock Screen & Boot Sequence:** Realistic Ubuntu boot splash, login screen, password authentication, and power-off animations.

### Desktop Applications:

| Application | Icon | Description |
| :--- | :---: | :--- |
| **Varshion AI** | 🤖 | AI Chatbot clone powered by FastAPI + Ollama (Qwen 1.7B) knowledge base. |
| **Ubuntu Terminal** | 🖥️ | Interactive command-line shell supporting `ls`, `cd`, `cat`, `whoami`, `projects`, `skills`, `education`, `resume`, and more. |
| **Praneeth's Profile** | 👤 | Interactive profile detailing work at Simnovus, 7 IEEE publications, 2 Indian patents, education (Amrita CPI 8.01), and Karate Black Belt. |
| **Gedit Text Editor** | 📝 | Multi-tab text editor and integrated contact form powered by EmailJS. |
| **Chrome Browser** | 🌐 | Embedded web browser simulation with custom tabs, navigation, and bookmarks. |
| **VS Code Editor** | 💻 | Embedded VS Code editor layout showcasing project code structure. |
| **Doom Game** | 🎮 | Fully playable classic DOOM engine running directly inside the browser window. |
| **2048 Game** | 🧩 | Classic tile-matching puzzle game. |
| **Settings** | ⚙️ | System settings to change desktop wallpapers, display modes, and accent colors. |
| **Trash** | 🗑️ | Interactive recycle bin. |

---

## 📱 2. Mobile Experience (iOS Replica)

When accessed via smartphones or tablets (iOS & Android), the portfolio automatically morphs into a mobile-first **iOS Replica Environment**.

### Key Mobile Features:
- **iOS Lock Screen:** Dynamic time & date display, swipe-up to unlock, flashlight & camera quick action buttons, and active notifications.
- **Home Screen & App Library:** Multi-page app grid with smooth touch gestures, haptic visual feedback, and a search-enabled App Library.
- **Control Center:** Swipe down from top-right to toggle Wi-Fi, Bluetooth, Dark Mode, Flashlight, Volume, Brightness sliders, and Music Player controls.
- **Interactive iOS Widgets:** Real-time Weather, Calendar, Clock, and Battery widgets on the Home Screen.
- **Status Bar:** Dynamic live indicators for carrier, signal strength, Wi-Fi, battery percentage, and time.

### Mobile Apps:
- **Varshion AI Mobile:** Touch-optimized chat interface for mobile query answering.
- **Portfolio App:** Full native-style view of experience, research publications, patents, and technical skills.
- **Safari & Search:** Simulated browser with Google search results and Wikipedia profile view.
- **Mail App:** Quick email contact form optimized for mobile touch input.
- **Camera & Photos:** Viewfinder simulation and photo gallery.
- **Games Suite:** Playable mobile retro games (Snake, Flappy Bird, 2048).
- **Clock & Timer:** Functional alarm timer with audio alerts.

---

## 🛠️ Local Development & Setup

### Prerequisites
- **Node.js**: `>= 16.x` (Node 18 or 20 recommended)
- **Package Manager**: `npm` or `yarn`

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/PraneethReddy-github/PraneethReddy-Portfolio.git
cd PraneethReddy-Portfolio

# Install dependencies
npm install
```

### 2. Environment Variables Configuration

Create a `.env.local` file in the root directory:

```env
# EmailJS Configuration (Contact Form)
NEXT_PUBLIC_USER_ID="YOUR_EMAILJS_PUBLIC_KEY"
NEXT_PUBLIC_SERVICE_ID="YOUR_EMAILJS_SERVICE_ID"
NEXT_PUBLIC_TEMPLATE_ID="YOUR_EMAILJS_TEMPLATE_ID"

# Varshion AI Backend Endpoint
NEXT_PUBLIC_CHAT_API_URL="http://localhost:8000/chat"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
# Compile and export static HTML/JS files to /out
npm run build && npm run export
```

---

## 🤖 Varshion AI Backend (Local / Docker Sandbox)

The backend service is located in `varshion-backend/` and exposes a REST endpoint for the AI chatbot.

### Sandboxed Container Execution (Docker Compose)
To run the backend inside an isolated non-root container sandbox:

```bash
# Start backend container & Cloudflare tunnel sidecar
docker compose up -d
```

### Local Standalone Execution
```bash
cd varshion-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run FastAPI server
python main.py
```

---

## 💡 Additional Enhancements & Roadmap

Future recommendations and feature extensions for this project:

- [ ] **Named Cloudflare Tunnel:** Map the local Ollama backend to a persistent custom domain (`https://varshion.yourdomain.com`) to eliminate tunnel resets on reboot.
- [ ] **Voice Assistant (Web Speech API):** Add speech recognition and text-to-speech for hands-free conversations with Varshion AI.
- [ ] **Progressive Web App (PWA):** Add a service worker and `manifest.json` so users can install the portfolio directly onto iOS/Android home screens with offline access.
- [ ] **Systemd Quadlet Service:** Autostart the Docker container on machine boot for 24/7 backend availability.

---

## 📄 License & Attribution

- Built by **[P Praneeth Reddy](https://github.com/PraneethReddy-github)**
- Desktop layout inspired by open-source Ubuntu web interfaces.