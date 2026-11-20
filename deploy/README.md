# Deploy Avero to a shared VPS

The release contains a Spring Boot JAR, Vite's static output and its own Compose configuration. Caddy routes browser requests under `/api` to Spring Boot and serves the React SPA. MySQL and Spring Boot have no published ports. The preview listens only on host loopback at `127.0.0.1:15481`.

## Tencent Cloud preview

The `current` symlink points to the active release in `/opt/sportscenter/releases`. Compose runs under the project name `sportscenter` and keeps its data in the `sportscenter_db` volume. Admin credentials are maintained in the VPS environment file with root-only access.

The initial deployment verified the archive checksums, 35 seeded catalog products, the SPA fallback at `/store/1`, and HTTP 401 for anonymous order requests. Existing containers were still running after deployment.

The visual release updated the web container only. The release check verified the new entry file on the HTTPS product route, the WebP hero, the 35-product catalog, and HTTP 401 for anonymous order requests. The API and database container IDs remained the same. The previous release is available for a web-only rollback using its Compose file with the public network override and `up -d --no-deps --wait web`.

## Build and verify

Build and run the repository checks described in the root README. On Windows, run `./deploy/pack.ps1` from the root. It writes `target/sportscenter-release.tar.gz` and prints a SHA-256 digest. Upload the archive to the VPS and verify its digest there before extracting it into a new release directory under `/opt/sportscenter/releases`.

Keep a root-readable environment file at `/opt/sportscenter/.env` with `SPORTSCENTER_DB_PASSWORD` and `APP_JWT_SECRET`. Generate independent random values on the server. The JWT key must be Base64 with at least 32 bytes before encoding. Retain the same database password and JWT key across releases. The launch configuration also accepts optional `APP_ADMIN_USERNAME`, `APP_ADMIN_EMAIL` and `APP_ADMIN_PASSWORD` for account provisioning.

```sh
release=/opt/sportscenter/releases/<release-id>
docker compose --env-file /opt/sportscenter/.env -f "$release/compose.yaml" up -d --wait --wait-timeout 180
curl -fsS 'http://127.0.0.1:15481/api/products?size=1'
curl -fsS 'http://127.0.0.1:15481/store/1' | grep -q '<div id="root">'
```

On a local disposable stack, `node deploy/smoke.mjs http://127.0.0.1:15481` checks registration, duplicate registration, private order history, expected admin restrictions, concurrent checkout retries, and stock restoration. Set `SMOKE_ADMIN_USERNAME` and `SMOKE_ADMIN_PASSWORD` to also check competing orders for the last unit and admin workflows. The script creates test data and expects an otherwise idle stack.

An existing authorized SSH account can preview the site through port forwarding, for example `ssh -N -L 15481:127.0.0.1:15481 <user>@<vps>`. Open the forwarded address on your computer. The preview does not need a public port or a DNS record.

## Back up before updating

Use the active release's Compose file and protect the SQL dump, which can contain account and sample address data:

```sh
umask 077
mkdir -p /opt/sportscenter/backups
backup="/opt/sportscenter/backups/db-$(date -u +%Y%m%dT%H%M%SZ).sql"
docker compose --env-file /opt/sportscenter/.env -f "$release/compose.yaml" exec -T db sh -c \
  'MYSQL_PWD="$MYSQL_PASSWORD" exec mysqldump --single-transaction --no-tablespaces -u "$MYSQL_USER" "$MYSQL_DATABASE"' > "$backup"
test -s "$backup"
```

Keep the previous release and its environment file. If an application-only update fails, run Compose again using the previous release. A migration that makes the database incompatible requires a restore from a verified backup. Test restores using a separate database before replacing live data. Keep an encrypted copy of important backups off the VPS.

## Public Caddy and DNS

The Avero subdomain uses an A record at Domainesia. The public Caddy proxies `avero.rajuportofolio.web.id` to `avero-upstream:8080`. Use `compose.avero.yaml` to join only the web service to the public Caddy network. The API and MySQL stay on the private project network. The internal upstream uses the unique name `avero-api-internal` because other stacks may also have a service named `api`.

For later VPS releases, retain the public network override at `/opt/sportscenter/compose.avero.yaml` and pass it after the release Compose file. When creating the override from the repository template, set `AVERO_PROXY_NETWORK` to the network that the public Caddy uses.

Back up the live Caddyfile before modifying it. To remove only Avero from public Caddy after other configuration changes, remove its virtual host block and validate the current file before reloading Caddy.

```sh
docker compose --env-file /opt/sportscenter/.env \
  -f "$release/compose.yaml" -f /opt/sportscenter/compose.avero.yaml \
  up -d --wait --wait-timeout 180
```
