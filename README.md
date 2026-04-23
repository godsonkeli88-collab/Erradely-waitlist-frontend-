# Erranda React Frontend

## Stack
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Router v6 (routing)
- Axios (API calls)
- Socket.IO Client (real-time)
- React Hook Form (forms)
- React Hot Toast (notifications)
- Leaflet + React Leaflet (maps)
- Vite PWA Plugin (installable PWA)

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL to your backend URL
npm run dev
```

Open: http://localhost:3000

## Build for Production
```bash
npm run build
# Deploy the /dist folder to Netlify, Vercel, or any static host
```

## Deploy to Netlify
1. `npm run build`
2. Drag the `/dist` folder to netlify.com/drop
3. Done — live URL in seconds

## Environment Variables
| Variable | Description |
|---|---|
| VITE_API_URL | Backend API URL (e.g. https://your-backend.railway.app/api) |
| VITE_SOCKET_URL | Backend Socket URL (e.g. https://your-backend.railway.app) |

## Routes
| Path | Component | Access |
|---|---|---|
| / | Landing | Public |
| /login | Login | Public |
| /signup | Signup | Public |
| /dashboard/* | Client Dashboard | client |
| /worker/* | Worker Dashboard | worker, delivery, business |
| /freelancer/* | Freelancer (Locked) | freelancer |
| /admin/* | Admin Dashboard | admin |
