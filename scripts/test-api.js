const fs = require('fs');
const http = require('http');

async function testEndpoint(method, path, headers = {}, body = null) {
  return new Promise((resolve) => {
    const url = new URL(`http://192.168.1.22:5012${path}`);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, data: parsed });
        } catch {
          resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, raw: data });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, ok: false, error: err.message });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 408, ok: false, error: 'Timeout' });
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log('Testing connection to backend http://192.168.1.22:5012 ...');

  const tests = [
    { name: 'Health check', method: 'GET', path: '/api/health' },
    { name: 'Root info', method: 'GET', path: '/api' },
    { name: 'Categories list', method: 'GET', path: '/api/categories?page=1&limit=20' },
    { name: 'Categories tree', method: 'GET', path: '/api/categories/tree' },
    { name: 'Products list', method: 'GET', path: '/api/products?page=1&limit=10' },
    { name: 'Collections list', method: 'GET', path: '/api/collections?page=1&limit=10' },
    { name: 'Shipping check pincode 110001', method: 'GET', path: '/api/shipping/check/110001' },
    { name: 'Shipping check pincode 400001', method: 'GET', path: '/api/shipping/check/400001' },
    { name: 'Shipping calculate', method: 'POST', path: '/api/shipping/calculate', body: { subtotal: 999, pincode: '110001' } },
    { name: 'Cart get (guest)', method: 'GET', path: '/api/cart', headers: { 'x-session-id': 'test-guest-session-123' } },
    { name: 'Coupons list', method: 'GET', path: '/api/coupons?page=1&limit=10' },
  ];

  for (const t of tests) {
    const res = await testEndpoint(t.method, t.path, t.headers, t.body);
    console.log(`[${res.status}] ${t.method} ${t.path} -> ${res.ok ? 'SUCCESS' : 'FAILED'}`);
    if (!res.ok) {
      console.log('   Error/Response:', JSON.stringify(res.data || res.raw || res.error).slice(0, 200));
    } else {
      const summary = Array.isArray(res.data) 
        ? `Array(${res.data.length})` 
        : typeof res.data === 'object' && res.data !== null
        ? Object.keys(res.data).join(', ')
        : String(res.data);
      console.log(`   Keys: ${summary}`);
      if (res.data?.data) {
        const d = res.data.data;
        const inner = Array.isArray(d) ? `Array(${d.length})` : typeof d === 'object' ? Object.keys(d).join(', ') : d;
        console.log(`   Data: ${inner}`);
      }
    }
  }

  // Also extract all endpoints from swagger.json to check what exists
  try {
    const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));
    console.log('\n--- SWAGGER ENDPOINTS SUMMARY ---');
    const tags = {};
    for (const [path, methods] of Object.entries(swagger.paths)) {
      for (const [m, op] of Object.entries(methods)) {
        const tag = op.tags?.[0] || 'Default';
        if (!tags[tag]) tags[tag] = [];
        tags[tag].push(`${m.toUpperCase()} ${path}`);
      }
    }
    for (const [tag, endpoints] of Object.entries(tags)) {
      console.log(`\n[${tag}] (${endpoints.length} endpoints):`);
      endpoints.forEach(e => console.log(`  - ${e}`));
    }
  } catch (e) {
    console.error('Error reading swagger.json:', e.message);
  }
}

run();
