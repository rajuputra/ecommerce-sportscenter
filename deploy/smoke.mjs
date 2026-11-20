import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

const base = process.argv[2] ?? "http://127.0.0.1:15481";
const id = () => randomUUID().replaceAll("-", "");
const headers = token => token ? { Authorization: `Bearer ${token}` } : {};

async function request(path, status, { method = "GET", body, token } = {}) {
  const response = await fetch(new URL(path, base), {
    method,
    headers: { ...headers(token), ...(body && { "Content-Type": "application/json" }) },
    body: body && JSON.stringify(body),
  });
  const data = await response.text();
  assert.equal(response.status, status, `${method} ${path}: ${data.slice(0, 300)}`);
  return data ? JSON.parse(data) : undefined;
}

async function register() {
  const username = `demo_${id().slice(0, 18)}`;
  const password = id();
  const body = { username, email: `${username}@example.test`, password };
  await request("/api/auth/register", 201, { method: "POST", body });
  await request("/api/auth/register", 409, { method: "POST", body });
  return request("/api/auth/login", 200, { method: "POST", body: { username, password } });
}

const catalog = await request("/api/products?size=2&sort=price&order=asc", 200);
assert.equal(catalog.content.length, 2);
assert.ok(catalog.page.totalElements > 2);
assert.ok(catalog.content[0].price <= catalog.content[1].price);
const product = catalog.content.find(item => item.stock > 0);
assert.ok(product);
const alice = await register();
const bob = await register();
const { token } = alice;
assert.deepEqual(await request("/api/auth/user", 200, { token }), { username: alice.username, admin: false });
await request("/api/orders", 401);
await request("/api/admin/products", 403, { token });

const body = {
  basketId: id(),
  shippingAddress: { name: "Demo Buyer", address1: "123 Sample Street", city: "Jakarta",
    state: "Jakarta", zipCode: "10110", country: "Indonesia" },
  items: [{ productId: product.id, unitPrice: product.price, quantity: 1 }],
};

const checkout = () => request("/api/orders", 201, { method: "POST", body, token });
const [first, retry] = await Promise.all([checkout(), checkout()]);
assert.equal(first, retry);
const detail = await request(`/api/orders/${first}`, 200, { token });
assert.equal(detail.summary.total, product.price + 35000);
assert.equal(detail.items[0].price, product.price);
assert.equal(detail.items[0].name, product.name);
assert.ok(detail.summary.orderDate);
assert.equal((await request(`/api/products/${product.id}`, 200)).stock, product.stock - 1);
assert.equal((await request("/api/orders", 200, { token })).page.totalElements, 1);
assert.equal((await request("/api/orders", 200, { token: bob.token })).page.totalElements, 0);
await request(`/api/orders/${first}`, 404, { token: bob.token });

const cancel = () => request(`/api/orders/${first}/cancel`, 200, { method: "POST", token });
const [cancelled, repeated] = await Promise.all([cancel(), cancel()]);
assert.equal(cancelled.orderStatus, "Cancelled");
assert.equal(repeated.orderStatus, "Cancelled");
assert.equal((await request(`/api/products/${product.id}`, 200)).stock, product.stock);
console.log("Catalog, accounts, order ownership, concurrent checkout retry, and single stock restoration passed.");

if (process.env.SMOKE_ADMIN_USERNAME && process.env.SMOKE_ADMIN_PASSWORD) {
  const admin = await request("/api/auth/login", 200, { method: "POST", body: {
    username: process.env.SMOKE_ADMIN_USERNAME, password: process.env.SMOKE_ADMIN_PASSWORD,
  } });
  assert.equal(admin.admin, true);
  const adminOptions = { token: admin.token };
  const [brand] = await request("/api/products/brands", 200);
  const [type] = await request("/api/products/types", 200);
  const newProduct = { name: "Smoke test product", description: "Sample smoke test item", price: 123000,
    stock: 1, brandId: brand.id, typeId: type.id, pictureUrl: product.pictureUrl.split("/").pop(), active: true };
  const created = await request("/api/admin/products", 201, { ...adminOptions, method: "POST", body: newProduct });

  const lastItem = { ...body, items: [{ productId: created.id, unitPrice: newProduct.price, quantity: 1 }] };
  const competingOrders = await Promise.all([alice, bob].map(account =>
    fetch(new URL("/api/orders", base), {
      method: "POST", headers: { ...headers(account.token), "Content-Type": "application/json" },
      body: JSON.stringify({ ...lastItem, basketId: id() }),
    })));
  assert.deepEqual(competingOrders.map(result => result.status).sort(), [201, 409]);
  const orderId = await competingOrders.find(result => result.status === 201).json();
  assert.equal((await request(`/api/products/${created.id}`, 200)).stock, 0);
  const statusPath = `/api/admin/orders/${orderId}/status`;
  for (const status of ["Processing", "Shipped", "Completed"]) {
    const result = await request(statusPath, 200, { ...adminOptions, method: "PATCH", body: { status } });
    assert.equal(result.orderStatus, status);
  }

  const productPath = `/api/admin/products/${created.id}`;
  const { content } = await request("/api/admin/products", 200, adminOptions);
  const current = content.find(item => item.id === created.id);
  await request(productPath, 200, {
    ...adminOptions, method: "PUT", body: { ...newProduct, version: current.version, stock: 0, active: false },
  });
  await request(`/api/products/${created.id}`, 404);
  console.log("Admin product setup, two buyers competing for one unit, order status, and hiding products passed.");
}
