# Job Tracker Frontend

React (Vite) frontend for the AI-assisted job application tracker. Ships with
four screens: Login, Signup, Dashboard, and Application Detail (which
includes the AI follow-up assistant panel).

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and point it at your running backend:
   ```
   cp .env.example .env
   ```

3. Start the dev server:
   ```
   npm run dev
   ```
   Visit `http://localhost:5173`. Make sure the backend (see `../backend`)
   is running first.

## Design

Visual identity: a "ledger" theme — warm paper background, a serif display
face (Fraunces) paired with Inter for UI text, and a monospace face for
dates/metadata. Status badges are styled like dashed rubber stamps, tying
into the paperwork/tracking metaphor of the product.

## Structure
```
src/
  api/client.js          fetch wrapper with auth header + error handling
  context/AuthContext.jsx  token/user state, persisted to localStorage
  components/            Layout, StatusBadge, ProtectedRoute
  pages/                 Login, Signup, Dashboard, NewApplication, ApplicationDetail
```

## Build for deployment
```
npm run build
```
Outputs static files to `dist/`, deployable to Vercel, Netlify, etc.
Set `VITE_API_URL` to your deployed backend URL as an environment variable
on the hosting platform.
