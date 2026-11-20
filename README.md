# Avero

Avero is a full-stack e-commerce demo for a portfolio. Browse sports gear, create a customer account, place a sample order and track it. Checkout uses a flat shipping estimate of Rp35.000. It collects no card details and does not charge or deliver anything.

[Open the live demo](https://avero.rajuportofolio.web.id)

- **Storefront:** React, TypeScript, Vite, Material UI and Redux Toolkit.
- **API:** Java 25, Spring Boot, Spring Security and MySQL 8.4. Flyway creates the schema and seeds the catalog.
- **Customer:** Search, filter and sort the catalog, maintain a browser cart, check out and view or cancel pending orders.
- **Admin:** Add, edit or hide products, set stock and update order status. Product images are selected from bundled assets.
- **Checkout:** The server validates the cart, uses database prices and checks stock in the order transaction. Saving an order again with the same cart ID returns the original order.

## Run locally on Windows

Use Java 25, Node 24 and Docker with Compose. From the repository root in PowerShell:

```powershell
$env:SPORTSCENTER_DB_PASSWORD = Read-Host 'Choose a password for the new local database'
docker compose -f docker/docker-compose.yml up -d --wait
.\mvnw.cmd spring-boot:run
```

Use the same password on subsequent runs with the existing database volume. Local MySQL listens on `127.0.0.1:13376`. Set `SPORTSCENTER_DB_PORT` and `SPORTSCENTER_DB_URL` if you need another port. A new database is seeded automatically. For a legacy database without Flyway history, use a fresh database or plan a separate data migration.

In another terminal:

```powershell
cd client
npm ci
npm run dev
```

Open [the local storefront](http://localhost:3000). The Vite proxy serves the API from the same origin. To provision an admin, set `APP_ADMIN_USERNAME`, `APP_ADMIN_EMAIL` and `APP_ADMIN_PASSWORD` before the backend first starts for that account. The bootstrap password must be at least 12 characters. Change password values outside the repository and keep them private. Existing accounts are never modified by bootstrap.

## Verify and deploy

With the local database running, run `.\mvnw.cmd verify` from the root, and `npm run lint` and `npm run build` from `client`. The deployment smoke script exercises the HTTP flow and writes sample accounts and orders. Use it only against a disposable environment.

See [the deployment runbook](deploy/README.md) for packaging, Caddy, backups and rollback. See [the initial audit](docs/PROJECT_AUDIT.md) for the starting point and historical findings.
