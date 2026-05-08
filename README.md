<div align="center">
  <h1>🎨 Collaborative Whiteboard</h1>
  <p>A fast, infinite-canvas real-time collaborative whiteboard built with React, Tldraw, and Yjs.</p>

  <!-- Visual Badges -->
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tldraw-FFB020?style=for-the-badge&logo=react&logoColor=white" alt="Tldraw" />
  <img src="https://img.shields.io/badge/Yjs-333333?style=for-the-badge" alt="Yjs" />
</div>

---

## ✨ Features

- **Infinite Canvas:** Powered by [Tldraw](https://tldraw.dev/), providing a beautiful, polished, and performant drawing experience out-of-the-box.
- **Rich Toolset:** Use pens, erasers, arrows, text, shapes, and sticky notes.
- **Real-Time Multiplayer:** Instant peer-to-peer synchronization powered by [Yjs](https://yjs.dev/) and WebRTC.
- **No Backend Required:** Utilizes public WebRTC signaling servers so you can collaborate across the internet without deploying a custom database or WebSocket server.
- **Private Rooms:** Automatically creates unique rooms based on the URL query parameter (e.g., `?room=my-secret-room`).

## 🛠️ Technologies

- **Frontend:** React, TypeScript, Vite
- **Whiteboard Engine:** `tldraw`
- **CRDT & Sync:** `yjs`, `@tldraw/yjs`, `y-webrtc`, `y-utility`

---

## 🚀 Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CUBeis/collaborative-whiteboard.git
   cd collaborative-whiteboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Collaborate Locally:**
   Open `http://localhost:5173` in two different browser windows to see real-time drawing in action!

---

## 🌐 How Multiplayer Works

This application uses **WebRTC** for peer-to-peer data synchronization. When you open the application, it looks at the URL for a room ID:
- `http://localhost:5173/` -> Connects to `default-whiteboard-room-v1`
- `http://localhost:5173/?room=awesome-design` -> Connects to `awesome-design`

To collaborate with friends, simply share the exact URL you are using. As long as you are all connected to the internet and on the same URL, Yjs will synchronize your screens automatically.

> **Note:** WebRTC is peer-to-peer. The data lives in the browsers of the connected users. If everyone leaves the room, the drawing data is cleared.

---

## ☁️ Free Deployment

Since this project uses public signaling servers for WebRTC, you only need to host the static frontend files. It is 100% free to deploy.

### Option 1: Vercel (Recommended)
1. Push your code to GitHub.
2. Log into [Vercel](https://vercel.com/) and click **Add New** -> **Project**.
3. Import your GitHub repository.
4. Vercel will auto-detect Vite. Leave the default settings and click **Deploy**.

### Option 2: Netlify
1. Push your code to GitHub.
2. Log into [Netlify](https://www.netlify.com/) and click **Add new site** -> **Import an existing project**.
3. Select your GitHub repository.
4. Netlify will auto-detect Vite. Click **Deploy Site**.

Once deployed, send the live `.vercel.app` or `.netlify.app` link to your friends and start drawing together instantly!
a