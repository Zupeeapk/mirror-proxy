const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const { Buffer } = require('buffer');
const app = express();

const target = 'https://animixplay.st'; // Or animixplay if you’re proxying that

app.use('/', createProxyMiddleware({
  target,
  changeOrigin: true,
  selfHandleResponse: true,
  onProxyRes: async (proxyRes, req, res) => {
    const chunks = [];

    proxyRes.on('data', chunk => chunks.push(chunk));
    proxyRes.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');

      let modified = body;

      // Inject custom script to override the logo
      if (proxyRes.headers['content-type']?.includes('text/html')) {
        modified = body.replace('</head>', `
          <style>
            img[src*="animixplay"] {
              display: none !important;
            }
            #custom-logo {
              display: block;
              margin: 10px;
            }
          </style>
          <script>
            window.addEventListener('DOMContentLoaded', function () {
              const logoContainer = document.querySelector('header, .navbar, .top-nav'); // adjust to match actual container
              if (logoContainer) {
                const img = document.createElement('img');
                img.src = 'http://humanainsurance.mom/wp-content/uploads/2025/05/SSTikTok-logo.jpg'; // your logo URL
                img.id = 'custom-logo';
                img.style.height = '40px';
                logoContainer.prepend(img);
              }
            });
          </script>
        </head>`);
      }

      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      res.end(modified);
    });
  }
}));

app.listen(3000, () => console.log('Proxy running at http://localhost:3000'));
