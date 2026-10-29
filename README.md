# Mingo Chat App (MERN Stack Architecture)

A modern, high-performance real-time messaging application built on the **MERN Stack** (React 19 + Vite 8 frontend, Express 5 + Node.js backend, and MongoDB Atlas database with Socket.IO real-time websockets).

---

## 🏛️ Architecture Overview

The application follows the decoupled MERN architecture standards, migrating away from monolithic Next.js constraints while maintaining strict security boundaries:

```
Mingo-ChatApp/
├── .github/workflows/ci.yml   # Automated CI/CD pipeline
├── package.json               # Root workspace script orchestrator
│
├── client/                    # Frontend SPA (React 19 + Vite 8)
│   ├── index.html             # Vite HTML root entry
│   ├── vite.config.js         # Vite configuration with '@/' path alias
│   ├── jsconfig.json          # JavaScript JSX compiler settings
│   ├── eslint.config.js       # ESLint flat config
│   ├── .env.example           # Client environment template
│   ├── test/                  # Frontend unit tests
│   └── src/
│       ├── main.jsx           # React DOM root render
│       ├── App.jsx            # React Router DOM (v7) route definitions
│       ├── index.css          # Tailwind CSS v4 + FlyonUI styles
│       ├── config/            # Axios API client & WebSocket singleton
│       ├── context/           # Global authentication context
│       ├── pages/             # Route views (Home, Login, Register, Chat, etc.)
│       └── components/        # Reusable UI widgets and modals
│
└── server/                    # Backend API (Express 5 + Node.js + Socket.IO)
    ├── index.js               # Express app & HTTP Socket.IO server
    ├── lint.js                # Native AST syntax linter
    ├── .env.example           # Server environment template
    ├── test/                  # Backend unit tests
    └── src/
        ├── config/            # MongoDB connection & Email simulator
        ├── controllers/       # Auth, User, and Message controllers
        ├── middleware/        # JWT auth protection & error handlers
        ├── models/            # Mongoose schemas (User, Message, OTP)
        ├── routers/           # Express route definitions
        └── utils/             # Helper utilities (OTP, Mailer)
```

---

## 🔄 Next.js to MERN Standards Mapping

| Feature | Next.js Standard | MERN / React + Vite Equivalent |
| :--- | :--- | :--- |
| **Routing** | File-based App/Pages Router | `react-router-dom` `<Routes>` & `<Route>` in `App.jsx` |
| **Navigation** | `<Link href="...">` | `<Link to="...">` from `react-router-dom` |
| **Programmatic Nav** | `useRouter()`, `usePathname()` | `useNavigate()`, `useLocation()` |
| **API Endpoints** | `/pages/api/*` or `route.js` | Express Routers & Controllers (`server/src/routers/`) |
| **Images** | `next/image` | Responsive standard `<img>` or SVG with lazy loading |
| **Environment Vars** | `NEXT_PUBLIC_*` | `VITE_*` accessed via `import.meta.env.VITE_*` |
| **Server Secrets** | Private server components | Backend `.env` loaded via `dotenv` (never leaked to client) |
| **404 Handling** | `not-found.jsx` | Wildcard `<Route path="*" element={<NotFound />} />` |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **MongoDB Atlas** database URI or local MongoDB instance

### 2. Environment Setup

**Client:**
```bash
cp client/.env.example client/.env
```
Ensure `VITE_BACKEND_URL=http://localhost:5000` is set.

**Server:**
```bash
cp server/.env.example server/.env
```
Configure your `MONGO_DB_URI` and `JWT_SECRET`.

### 3. Installation
```bash
# Install frontend dependencies
cd client && npm install

# Install backend dependencies
cd ../server && npm install
```

### 4. Running Locally
From the project root:
```bash
# Run frontend development server (Vite on http://localhost:5173)
npm run dev

# Or run backend server directly:
cd server && npm run dev
```

---

## 🧪 Testing & Quality Suite

Run all verification checks across the entire stack directly from the root folder:

```bash
# 1. Lint Verification (Zero errors, zero warnings)
npm run lint

# 2. Automated Unit Tests (Client & Server)
npm run test

# 3. Production Build Check
npm run build

# 4. Type & Syntax Validation
npm run typecheck

# 5. Dead Export Audit
npm run ts-prune

# 6. Spellcheck
npm run spellcheck
```

---

## 🔒 Security Best Practices Implemented

- **CORS Protection**: Restricted to trusted frontend origins (`credentials: true`).
- **Fingerprint Protection**: Express `x-powered-by` header disabled.
- **Data Sanitization**: Mongoose parameterized schemas prevent NoSQL injections.
- **Password Security**: Salted hashing with `bcrypt`.
- **JWT Protection**: Secure cookie tokens for authenticated sessions.
- **Health Probes**: Explicit `/health` endpoint for monitoring and uptime checks.

---

## 🚢 Deployment Guidelines

- **Frontend (Static SPA):** Deploy `client/dist/` to Vercel, Netlify, Cloudflare Pages, or AWS S3 + CloudFront.
- **Backend (Node Server):** Deploy `server/` with PM2 or Docker on Render, Railway, DigitalOcean, or AWS ECS.
- **Database:** MongoDB Atlas (Cloud Managed with IP Whitelist access).

