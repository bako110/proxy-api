const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

const VPS_URL = process.env.VPS_URL || 'http://161.97.117.46:8090';
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://bf1-d4h8.onrender.com';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use('/api/v1', createProxyMiddleware({
  target: VPS_URL,
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      res.status(502).json({ error: 'Proxy error', message: err.message });
    },
  },
}));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT} → ${VPS_URL}`);
});
