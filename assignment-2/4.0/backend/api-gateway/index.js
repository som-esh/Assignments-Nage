const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const winston = require('winston');

const app = express();

// Configure CORS
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',       // Svelte dev server
      'http://127.0.0.1:5173',
      'https://your-production-domain.com' // Production domain
    ];

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// Use CORS middleware
app.use(cors(corsOptions)); // Add this before other middleware

// app.options('*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', req.headers.origin);
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.sendStatus(200);
// });

app.options('*', cors(corsOptions));

// Add after CORS setup
app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request for ${req.url}`);
  next();
});

// In all services
app.options('*', (req, res) => {
  res.sendStatus(200);
});

app.use('/auth', createProxyMiddleware({
  target: 'http://auth-service:3001',
  changeOrigin: true,
  pathRewrite: { '^/auth': '' }
}));
app.use('/products', createProxyMiddleware({
  target: 'http://product-service:3002',
  changeOrigin: true,
  pathRewrite: { '^/products': '' }
}));
app.use('/cart', createProxyMiddleware({
  target: 'http://cart-service:3003',
  changeOrigin: true,
  pathRewrite: { '^/cart': '' }
}));
app.use('/order', createProxyMiddleware({
  target: 'http://order-service:3004',
  changeOrigin: true,
  pathRewrite: { '^/order': '' }
}));
app.use('/payments', createProxyMiddleware({
  target: 'http://payment-service:3005',
  changeOrigin: true,
  pathRewrite: { '^/payments': '' }
}));

app.listen(3000, () => logger.info('API Gateway running on 3000'));




