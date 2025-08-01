const express = require('express');
const winston = require('winston');
const Consul = require('consul');
const consul = new Consul(
  {
    host: 'consul',
    port: '8500',
    promisify: true
  }
);
const app = express();
app.use(express.json());

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

const users = [
  { id: 1, username: 'user1', password: 'pass1' },
  { id: 2, username: 'user2', password: 'pass2' }
];

// app.options('*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', req.headers.origin);
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.sendStatus(200);
// });

// Authentication

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    logger.info(`Login successful for user${user.username}`);
    return res.json({ success: true, userId: user.username });
  } else {
    logger.warn(`Failed login attempt for username ${username}`);
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// app.post('/login', (req, res) => {
//   const { username, password } = req.body || {};
//   const user = users.find(u =>
//     u.username === req.body.username &&
//     u.password === req.body.password
//   );
//   if (user) {
//     logger.info(`Login successful for user ${user.username}`);
//     return res.json({ success: true, userId: user.username });
//   }
//   // logger.warn(`Failed login attempt for username ${user.username}`);
//   res.status(401).json({ success: false, message: 'Invalid credentials' });
//   // user ? res.json({ success: true }) : res.status(401).json({ success: false, message: 'Invalid credentials' });
// });

// Service Registration
consul.agent.service.register({
  name: 'auth-service',
  address: 'auth-service',
  port: 3001,
  check: {
    http: 'http://auth-service:3001/health',
    interval: '10s'
  }
});

app.get('/health', (req, res) => res.sendStatus(200));
app.listen(3001, () => console.log('Auth Service running on port 3001'));