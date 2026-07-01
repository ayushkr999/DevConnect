// BASE_URL — all REST API calls go to /api/...
// VITE_BASE_URL is set in .env (local) or Vercel dashboard (production)
const base = import.meta.env.VITE_BASE_URL;

if (!base) {
  console.error(
    "[DevConnect] VITE_BASE_URL is not set. " +
    "Add it to your .env file (local) or Vercel environment variables (production)."
  );
}

export const BASE_URL = `${base}/api`;
export const SOCKET_URL = base;