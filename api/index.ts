import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server.ts';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Preserve full API path if Vercel routes through rewrite
  const matchedPath = req.headers['x-matched-path'] as string;
  if (matchedPath && (req.url === '/api' || req.url === '/')) {
    req.url = matchedPath;
  }

  return app(req, res);
}
