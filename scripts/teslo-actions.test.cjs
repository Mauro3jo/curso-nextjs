const test = require('node:test');
const assert = require('node:assert/strict');
const loadTs = require('./load-ts.cjs');

function fixture(user = { id: 'alice', role: 'user' }, overrides = {}) {
  const state = {
    addresses: {
      alice: { userId: 'alice', firstName: 'Alice', lastName: 'Test', address: 'A', address2: null, countryId: 'AR', city: 'City', postalCode: '1000', phone: '000' },
      bob: { userId: 'bob', firstName: 'Bob', lastName: 'Test', address: 'B', address2: null, countryId: 'AR', city: 'City', postalCode: '2000', phone: '000' },
    },
    orders: {
      'order-alice': { id: 'order-alice', userId: 'alice', total: 100, transactionId: 'TXN-ALICE', isPaid: false, paidAt: null },
      'order-bob': { id: 'order-bob', userId: 'bob', total: 100, transactionId: 'TXN-BOB', isPaid: false, paidAt: null },
    },
    products: [],
    images: [{ id: 1, url: 'https://res.cloudinary.com/demo/image/upload/v1/sample.png', product: { slug: 'sample' } }],
    deletedCloudImages: [], requests: 0,
  };
  // Prisma 5 omits undefined fields from filters.
  const matches = (row, where) => Object.entries(where).every(([key, value]) => value === undefined || row[key] === value);
  const prisma = {
    userAddress: {
      findUnique: async ({ where }) => state.addresses[where.userId] ?? null,
      create: async ({ data }) => (state.addresses[data.userId] = { ...data }),
      update: async ({ where, data }) => (state.addresses[where.userId] = { ...state.addresses[where.userId], ...data }),
      delete: async ({ where }) => { const old = state.addresses[where.userId]; delete state.addresses[where.userId]; return old; },
    },
    product: {
      create: async ({ data }) => { const product = { id: 'product', ...data }; state.products.push(product); return product; },
    },
    productImage: {
      findUnique: async ({ where }) => state.images.find(image => image.id === where.id) ?? null,
      createMany: async () => ({ count: 0 }),
      delete: async ({ where }) => { const image = state.images.find(image => image.id === where.id); state.images = state.images.filter(image => image.id !== where.id); return image; },
    },
    order: {
      findFirst: async ({ where }) => Object.values(state.orders).find(order => matches(order, where)) ?? null,
      update: async ({ where, data }) => Object.assign(state.orders[where.id], data),
      updateMany: async ({ where, data }) => {
        const rows = Object.values(state.orders).filter(order => matches(order, where));
        for (const row of rows) Object.assign(row, data);
        return { count: rows.length };
      },
    },
  };
  prisma.$transaction = async action => action(prisma);
  const response = {
    id: 'TXN-ALICE', intent: 'CAPTURE', status: 'COMPLETED',
    purchase_units: [{
      reference_id: 'default', invoice_id: 'order-alice',
      amount: { currency_code: 'USD', value: '100.00' },
      payee: { email_address: 'seller@example.test', merchant_id: 'MERCHANT-TEST' },
      payments: { captures: [{ id: 'capture-test', status: 'COMPLETED', final_capture: true, amount: { currency_code: 'USD', value: '100.00' } }] },
    }],
  };
  const mocks = {
    '@/lib/prisma': prisma,
    '@/auth.config': { auth: async () => user ? { user } : null },
    'next/cache': { revalidatePath() {} },
    cloudinary: { v2: { config() {}, uploader: { destroy: async name => { state.deletedCloudImages.push(name); }, upload: async () => { throw new Error('No uploads in tests'); } } } },
  };
  const globals = {
    process: { env: { PAYPAL_MERCHANT_ID: 'MERCHANT-TEST', NEXT_PUBLIC_PAYPAL_CLIENT_ID: 'client-test', PAYPAL_SECRET: 'test-only', PAYPAL_OAUTH_URL: 'https://example.test/oauth', PAYPAL_ORDERS_URL: 'https://example.test/orders', ...overrides } },
    fetch: async url => {
      state.requests++;
      return new Response(JSON.stringify(String(url).endsWith('/oauth') ? { access_token: 'test-only' } : response), { status: state.providerStatus ?? 200 });
    },
  };
  return { state, response, load: file => loadTs('teslo-shop', `src/actions/${file}.ts`, mocks, globals) };
}

const address = { firstName: 'Alice', lastName: 'Test', address: 'New', address2: '', country: 'AR', city: 'City', postalCode: '1000', phone: '000', rememberAddress: true };
for (const user of [null, { id: 'alice', role: 'user' }]) {
  const name = user ? 'another user' : 'anonymous caller';
  test(`${name} cannot read Bob's address`, async () => {
    const f = fixture(user);
    assert.equal(await f.load('address/get-user-address').getUserAddress('bob'), null);
  });
  test(`${name} cannot overwrite Bob's address`, async () => {
    const f = fixture(user);
    assert.equal((await f.load('address/set-user-address').setUserAddress(address, 'bob')).ok, false);
    assert.equal(f.state.addresses.bob.address, 'B');
  });
  test(`${name} cannot delete Bob's address`, async () => {
    const f = fixture(user);
    assert.equal((await f.load('address/delete-user-address').deleteUserAddress('bob')).ok, false);
    assert.ok(f.state.addresses.bob);
  });
}

test('an owner can read, update and remove their own saved address', async () => {
  const f = fixture();
  assert.equal((await f.load('address/get-user-address').getUserAddress('alice')).country, 'AR');
  assert.equal((await f.load('address/set-user-address').setUserAddress(address, 'alice')).ok, true);
  assert.equal(f.state.addresses.alice.address, 'New');
  assert.equal((await f.load('address/delete-user-address').deleteUserAddress('alice')).ok, true);
  assert.equal(f.state.addresses.alice, undefined);
});

function productForm() {
  const form = new FormData();
  for (const [key, value] of Object.entries({ title: 'Test product', slug: 'test-product', description: 'Example', price: '10', inStock: '2', categoryId: '00000000-0000-4000-8000-000000000001', sizes: 'M', tags: 'test', gender: 'men' })) form.set(key, value);
  return form;
}
for (const user of [null, { id: 'alice', role: 'user' }]) {
  test(`${user ? 'a normal user' : 'an anonymous caller'} cannot create products`, async () => {
    const f = fixture(user);
    assert.equal((await f.load('product/create-update-product').createUpdateProduct(productForm())).ok, false);
    assert.equal(f.state.products.length, 0);
  });
  test(`${user ? 'a normal user' : 'an anonymous caller'} cannot delete product images`, async () => {
    const f = fixture(user);
    await f.load('product/delete-product-image').deleteProductImage(1, f.state.images[0].url);
    assert.equal(f.state.images.length, 1);
    assert.equal(f.state.deletedCloudImages.length, 0);
  });
}
test('an administrator can create a product and delete its recorded image', async () => {
  const f = fixture({ id: 'admin', role: 'admin' });
  assert.equal((await f.load('product/create-update-product').createUpdateProduct(productForm())).ok, true);
  assert.equal(f.state.products.length, 1);
  await f.load('product/delete-product-image').deleteProductImage(1, f.state.images[0].url);
  assert.equal(f.state.images.length, 0);
  assert.equal(f.state.deletedCloudImages[0], 'sample');
});
test('an image deletion cannot substitute a different cloud URL', async () => {
  const f = fixture({ id: 'admin', role: 'admin' });
  await f.load('product/delete-product-image').deleteProductImage(1, 'https://res.cloudinary.com/demo/image/upload/v1/other.png');
  assert.equal(f.state.images.length, 1);
  assert.equal(f.state.deletedCloudImages.length, 0);
});

for (const user of [null, { id: 'alice', role: 'user' }]) {
  test(`${user ? 'another user' : 'an anonymous caller'} cannot attach a transaction to Bob's order`, async () => {
    const f = fixture(user);
    assert.equal((await f.load('payments/set-transaction-id').setTransactionId('order-bob', 'NEW')).ok, false);
    assert.equal(f.state.orders['order-bob'].transactionId, 'TXN-BOB');
  });
}
test('an owner can attach a transaction only before the order is paid', async () => {
  const f = fixture();
  const { setTransactionId } = f.load('payments/set-transaction-id');
  assert.equal((await setTransactionId('order-alice', 'NEW')).ok, true);
  assert.equal(f.state.orders['order-alice'].transactionId, 'NEW');
  f.state.orders['order-alice'].isPaid = true;
  assert.equal((await setTransactionId('order-alice', 'REPLACED')).ok, false);
  assert.equal(f.state.orders['order-alice'].transactionId, 'NEW');
});

test('an absent order id cannot broaden a transaction update', async () => {
  const f = fixture();
  assert.equal((await f.load('payments/set-transaction-id').setTransactionId(undefined, 'NEW')).ok, false);
  assert.equal(f.state.orders['order-alice'].transactionId, 'TXN-ALICE');
});

test('an anonymous payment check cannot contact the provider or mark an order paid', async () => {
  const f = fixture(null);
  assert.equal((await f.load('payments/paypal-check-payment').paypalCheckPayment('TXN-ALICE')).ok, false);
  assert.equal(f.state.requests, 0);
  assert.equal(f.state.orders['order-alice'].isPaid, false);
});
test('a payment check cannot mark another owner order paid', async () => {
  const f = fixture({ id: 'bob', role: 'user' });
  assert.equal((await f.load('payments/paypal-check-payment').paypalCheckPayment('TXN-ALICE')).ok, false);
  assert.equal(f.state.orders['order-alice'].isPaid, false);
});
test('a matching completed capture marks the authenticated owner order paid', async () => {
  const f = fixture();
  assert.equal((await f.load('payments/paypal-check-payment').paypalCheckPayment('TXN-ALICE')).ok, true);
  assert.equal(f.state.orders['order-alice'].isPaid, true);
});
for (const [name, mutate] of [
  ['amount', response => { response.purchase_units[0].amount.value = '1.00'; }],
  ['currency', response => { response.purchase_units[0].amount.currency_code = 'EUR'; }],
  ['merchant', response => { response.purchase_units[0].payee.merchant_id = 'OTHER'; }],
  ['invoice', response => { response.purchase_units[0].invoice_id = 'order-bob'; }],
  ['transaction', response => { response.id = 'OTHER'; }],
  ['capture status', response => { response.purchase_units[0].payments.captures[0].status = 'PENDING'; }],
]) {
  test(`a mismatched ${name} cannot mark an order paid`, async () => {
    const f = fixture(); mutate(f.response);
    assert.equal((await f.load('payments/paypal-check-payment').paypalCheckPayment('TXN-ALICE')).ok, false);
    assert.equal(f.state.orders['order-alice'].isPaid, false);
    assert.equal(f.state.orders['order-bob'].isPaid, false);
  });
}
test('a payment check fails closed when the expected merchant is not configured', async () => {
  const f = fixture(undefined, { PAYPAL_MERCHANT_ID: '' });
  assert.equal((await f.load('payments/paypal-check-payment').paypalCheckPayment('TXN-ALICE')).ok, false);
  assert.equal(f.state.orders['order-alice'].isPaid, false);
});
test('rechecking a valid paid order does not change its payment timestamp', async () => {
  const f = fixture();
  f.state.orders['order-alice'].isPaid = true;
  f.state.orders['order-alice'].paidAt = new Date('2020-01-01T00:00:00Z');
  assert.equal((await f.load('payments/paypal-check-payment').paypalCheckPayment('TXN-ALICE')).ok, true);
  assert.equal(f.state.orders['order-alice'].paidAt.toISOString(), '2020-01-01T00:00:00.000Z');
});

test('a provider HTTP error cannot mark an order paid', async () => {
  const f = fixture();
  f.state.providerStatus = 500;
  assert.equal((await f.load('payments/paypal-check-payment').paypalCheckPayment('TXN-ALICE')).ok, false);
  assert.equal(f.state.orders['order-alice'].isPaid, false);
});
