# Vianna

**Vianna** is a Universal Life Management Hub designed to help you organize your life with style and efficiency. From capturing quick notes to managing complex data, Vianna provides a sleek, modern, and high-performance interface for all your productivity needs.

## ✨ Features

- 📝 **Advanced Note-Taking**: rich text editing and organization.
- 🗄️ **Local SQLite Database**: Fast, reliable, and completely local storage.
- 🎨 **Premium UI/UX**: Built with React and Tailwind CSS for a smooth, glassmorphic experience.
- 🖥️ **Desktop Powered**: Runs as a native desktop application using Electron.
- 📦 **Offline First**: All your data stays on your machine, always accessible.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Desktop Wrapper**: [Electron](https://www.electronjs.org/)
- **Database**: [SQLite](https://www.sqlite.org/) via [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vince/vianna.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Vianna
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Rebuild native modules (required for better-sqlite3):
   ```bash
   npm run rebuild
   ```

## 💻 Development

Run the development server:
```bash
npm run dev
```

## 🏗️ Build

To build the application for production:
```bash
npm run build
```

## 📜 License

Distributed under the GPL-3.0 License. See `LICENSE` for more information.

---
Created by **Vincent Haney Jr.**
