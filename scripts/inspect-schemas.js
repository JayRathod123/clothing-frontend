const fs = require('fs');
const swagger = JSON.parse(fs.readFileSync('swagger.json', 'utf8'));

const checkoutEndpoint = swagger.paths['/api/orders/checkout'];
console.log('Checkout endpoint:');
console.log(JSON.stringify(checkoutEndpoint, null, 2));

const schemaRef = checkoutEndpoint?.post?.requestBody?.content?.['application/json']?.schema?.$ref;
if (schemaRef) {
  const schemaName = schemaRef.split('/').pop();
  console.log('\nSchema:', schemaName);
  console.log(JSON.stringify(swagger.components.schemas[schemaName], null, 2));
}

const couponsApply = swagger.paths['/api/coupons/apply'];
console.log('\nCoupons apply endpoint:');
console.log(JSON.stringify(couponsApply, null, 2));
const couponRef = couponsApply?.post?.requestBody?.content?.['application/json']?.schema?.$ref;
if (couponRef) {
  const schemaName = couponRef.split('/').pop();
  console.log('\nCoupon Schema:', schemaName);
  console.log(JSON.stringify(swagger.components.schemas[schemaName], null, 2));
}

const shippingCalc = swagger.paths['/api/shipping/calculate'];
console.log('\nShipping calculate endpoint:');
console.log(JSON.stringify(shippingCalc, null, 2));
const shipRef = shippingCalc?.post?.requestBody?.content?.['application/json']?.schema?.$ref;
if (shipRef) {
  const schemaName = shipRef.split('/').pop();
  console.log('\nShipping Schema:', schemaName);
  console.log(JSON.stringify(swagger.components.schemas[schemaName], null, 2));
}
