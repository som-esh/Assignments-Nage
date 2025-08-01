const express = require('express');
const { products } = require('./inventory.cjs');
const rateLimit = require('express-rate-limit');
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

// let products = [
//   { id: 1, name: 'Product 1', price: 100, stock: 10 },
//   { id: 2, name: 'Product 2', price: 200, stock: 5 }
// ];

// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Helper: case-insensitive string includes
function includesIgnoreCase(str, substr) {
  return str.toLowerCase().includes(substr.toLowerCase());
}

// Product Endpoints
// app.get('/', (req, res) => res.json(products));
app.get('/', (req, res) => {
  try {
    let filteredProducts = [...products];
    const { search, sort, order = 'asc', page = '1', limit = '10' } = req.query;

    // Name search filter
    if (search) {
      filteredProducts = filteredProducts.filter(p => includesIgnoreCase(p.name, search));
    }

    // Add 'availability'
    filteredProducts = filteredProducts.map(p => ({
      ...p,
      availability: p.stock > 0,
    }));

    // Sort (name, price, availability)
    if (sort && ['name', 'price', 'availability'].includes(sort)) {
      filteredProducts.sort((a, b) => {
        let aVal = a[sort];
        let bVal = b[sort];
        if (sort === 'availability') {
          aVal = aVal ? 1 : 0;
          bVal = bVal ? 1 : 0;
        }
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const perPage = parseInt(limit, 10);
    const total = filteredProducts.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    if (pageNum > totalPages) {
      return res.status(400).json({ message: 'Page out of range' });
    }
    const start = (pageNum - 1) * perPage;
    const pagedProducts = filteredProducts.slice(start, start + perPage);

    res.json({
      page: pageNum,
      perPage,
      total,
      totalPages,
      products: pagedProducts
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Example Express route to serve product by ID
app.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  res.json(product);
});


app.post('/check-stock', (req, res) => {
  const sufficientStock = req.body.items.every(item =>
    products.find(p => p.id === item.productId)?.stock >= item.quantity
  );
  res.json({ inStock: sufficientStock });
});

app.post('/update-inventory', (req, res) => {
  const { items } = req.body;

  try {
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;  // Deduct stock
        } else {
          throw new Error(`Not enough stock for product ${item.productId}`);
        }
      } else {
        throw new Error(`Product ${item.productId} not found`);
      }
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Inventory update failed:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Service Registration
consul.agent.service.register({
  name: 'product-service',
  address: 'product-service',
  port: 3002,
  check: {
    http: 'http://product-service:3002/health',
    interval: '10s'
  }
});

app.get('/health', (req, res) => res.sendStatus(200));
app.listen(3002, () => console.log('Product Service running on port 3002'));