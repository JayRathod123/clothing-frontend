const http = require('http');

const BASE_URL = 'http://192.168.1.22:5012';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve) => {
    const url = new URL(`${BASE_URL}${path}`);
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      'Accept': 'application/json',
      ...headers,
    };
    if (payload) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: reqHeaders,
      timeout: 6000,
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, data });
        }
      });
    });
    req.on('error', (err) => resolve({ status: 0, ok: false, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 408, ok: false, error: 'Timeout' }); });
    if (payload) req.write(payload);
    req.end();
  });
}

async function runAudit() {
  console.log('================================================================');
  console.log('       LIVE BACKEND API AUDIT REPORT (http://192.168.1.22:5012)  ');
  console.log('================================================================\n');

  const report = [];

  // 1. Health
  const health = await request('GET', '/api/health');
  report.push({ name: 'System Health Check', endpoint: 'GET /api/health', status: health.status, ok: health.ok, details: health.data?.data?.database?.status || 'OK' });

  // 2. Categories
  const categories = await request('GET', '/api/categories?page=1&limit=50');
  const catItems = categories.data?.data?.items || [];
  report.push({ name: 'Categories List', endpoint: 'GET /api/categories', status: categories.status, ok: categories.ok, count: catItems.length, sample: catItems[0]?.name });

  // 3. Category Tree
  const catTree = await request('GET', '/api/categories/tree');
  report.push({ name: 'Category Hierarchy Tree', endpoint: 'GET /api/categories/tree', status: catTree.status, ok: catTree.ok, count: Array.isArray(catTree.data?.data) ? catTree.data.data.length : 0 });

  // 4. Products
  const products = await request('GET', '/api/products?page=1&limit=50');
  const prodItems = products.data?.data?.items || [];
  report.push({ name: 'Products Storefront List', endpoint: 'GET /api/products', status: products.status, ok: products.ok, count: prodItems.length, sample: prodItems.map(p => p.name).join(', ') });

  let testSlug = prodItems[0]?.slug;
  let testId = prodItems[0]?.id;
  let testVariantId = prodItems[0]?.variants?.[0]?.id;

  // 5. Product by Slug
  if (testSlug) {
    const prodBySlug = await request('GET', `/api/products/slug/${testSlug}`);
    report.push({ name: 'Product Details By Slug', endpoint: `GET /api/products/slug/${testSlug}`, status: prodBySlug.status, ok: prodBySlug.ok, variants: prodBySlug.data?.data?.variants?.length, images: prodBySlug.data?.data?.images?.length });
  }

  // 6. Collections
  const collections = await request('GET', '/api/collections');
  report.push({ name: 'Collections List', endpoint: 'GET /api/collections', status: collections.status, ok: collections.ok, count: collections.data?.data?.data?.length || 0 });

  // 7. Cart Lifecycle (with guest session)
  const sessionId = 'audit-session-' + Date.now();
  const getCartEmpty = await request('GET', '/api/cart', null, { 'x-session-id': sessionId });
  report.push({ name: 'Cart Retrieval (Initial)', endpoint: 'GET /api/cart', status: getCartEmpty.status, ok: getCartEmpty.ok, itemsCount: getCartEmpty.data?.data?.items?.length || 0 });

  let cartItemId = null;
  if (testVariantId) {
    const addItem = await request('POST', '/api/cart/items', { variantId: testVariantId, quantity: 2 }, { 'x-session-id': sessionId });
    cartItemId = addItem.data?.data?.items?.[0]?.id;
    report.push({ name: 'Cart Add Item', endpoint: 'POST /api/cart/items', status: addItem.status, ok: addItem.ok, subtotal: addItem.data?.data?.subtotal, addedItem: addItem.data?.data?.items?.[0]?.product?.name });
  }

  if (cartItemId) {
    const updateItem = await request('PATCH', `/api/cart/items/${cartItemId}`, { quantity: 3 }, { 'x-session-id': sessionId });
    report.push({ name: 'Cart Update Quantity', endpoint: `PATCH /api/cart/items/${cartItemId}`, status: updateItem.status, ok: updateItem.ok, newQty: updateItem.data?.data?.items?.[0]?.quantity });

    const deleteItem = await request('DELETE', `/api/cart/items/${cartItemId}`, null, { 'x-session-id': sessionId });
    report.push({ name: 'Cart Remove Item', endpoint: `DELETE /api/cart/items/${cartItemId}`, status: deleteItem.status, ok: deleteItem.ok, remaining: deleteItem.data?.data?.items?.length || 0 });
  }

  // 8. Shipping Serviceability Check
  const checkPin = await request('GET', '/api/shipping/check/110001');
  report.push({ name: 'Shipping Pincode Check', endpoint: 'GET /api/shipping/check/110001', status: checkPin.status, ok: checkPin.ok, message: checkPin.data?.data?.message });

  // 9. Reviews by Product ID
  if (testId) {
    const reviews = await request('GET', `/api/reviews/product/${testId}`);
    report.push({ name: 'Product Reviews & Ratings', endpoint: `GET /api/reviews/product/${testId}`, status: reviews.status, ok: reviews.ok, totalReviews: reviews.data?.data?.ratingSummary?.totalReviews ?? 0 });
  }

  // 10. Public Store Settings
  const settings = await request('GET', '/api/settings/public');
  report.push({ name: 'Store Public Settings', endpoint: 'GET /api/settings/public', status: settings.status, ok: settings.ok, storeName: settings.data?.data?.storeName || 'Default' });

  // 11. Banners
  const banners = await request('GET', '/api/banners');
  report.push({ name: 'Promotional Banners', endpoint: 'GET /api/banners', status: banners.status, ok: banners.ok, count: Array.isArray(banners.data?.data) ? banners.data.data.length : 0 });

  console.log(JSON.stringify(report, null, 2));
}

runAudit();
