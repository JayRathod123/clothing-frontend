const http = require('http');

async function get(path, headers = {}) {
  return new Promise((resolve) => {
    const url = new URL(`http://192.168.1.22:5012${path}`);
    const options = {
      method: 'GET',
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { 'Accept': 'application/json', ...headers },
      timeout: 5000,
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', (err) => resolve({ status: 0, error: err.message }));
    req.end();
  });
}

async function post(path, body, headers = {}) {
  return new Promise((resolve) => {
    const url = new URL(`http://192.168.1.22:5012${path}`);
    const payload = JSON.stringify(body);
    const options = {
      method: 'POST',
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers,
      },
      timeout: 5000,
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', (err) => resolve({ status: 0, error: err.message }));
    req.write(payload);
    req.end();
  });
}

async function inspect() {
  console.log('--- 1. SETTINGS / PUBLIC ---');
  const settings = await get('/api/settings/public');
  console.log(JSON.stringify(settings, null, 2));

  console.log('\n--- 2. BANNERS ---');
  const banners = await get('/api/banners');
  console.log(JSON.stringify(banners, null, 2));

  console.log('\n--- 3. CATEGORIES ---');
  const categories = await get('/api/categories?limit=5');
  console.log(JSON.stringify(categories, null, 2));

  console.log('\n--- 4. PRODUCTS ---');
  const products = await get('/api/products?limit=2');
  console.log(JSON.stringify(products, null, 2));

  console.log('\n--- 5. COLLECTIONS ---');
  const collections = await get('/api/collections?limit=5');
  console.log(JSON.stringify(collections, null, 2));

  if (products.body?.data?.items?.[0]) {
    const p = products.body.data.items[0];
    console.log(`\n--- 6. PRODUCT BY SLUG / ID (${p.slug}) ---`);
    const singleProduct = await get(`/api/products/slug/${p.slug}`);
    console.log('Single product status:', singleProduct.status);
    console.log('Variants:', singleProduct.body?.data?.variants?.length);
    console.log('Variants sample:', JSON.stringify(singleProduct.body?.data?.variants?.[0], null, 2));
    console.log('Images:', singleProduct.body?.data?.images?.length);

    console.log(`\n--- 7. REVIEWS FOR PRODUCT (${p.id}) ---`);
    const reviews = await get(`/api/reviews/product/${p.id}`);
    console.log(JSON.stringify(reviews, null, 2));

    if (singleProduct.body?.data?.variants?.[0]) {
      const v = singleProduct.body.data.variants[0];
      console.log(`\n--- 8. ADD TO CART (Variant ${v.id}) ---`);
      const addRes = await post(
        '/api/cart/items',
        { variantId: v.id, quantity: 1 },
        { 'x-session-id': 'session-verify-123' }
      );
      console.log('Add to cart status:', addRes.status);
      console.log('Add to cart body:', JSON.stringify(addRes.body, null, 2));

      console.log('\n--- 9. GET CART ---');
      const getCartRes = await get('/api/cart', { 'x-session-id': 'session-verify-123' });
      console.log('Get cart status:', getCartRes.status);
      console.log('Get cart items:', getCartRes.body?.data?.items?.length);
      console.log('Get cart subtotal:', getCartRes.body?.data?.subtotal);
    }
  }
}

inspect();
