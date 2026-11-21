#!/usr/bin/env bash
# Sets up our own code runner (Piston) on a fresh Ubuntu 22.04/24.04 VPS, behind Caddy (HTTPS + token).
# Run as root on the VPS:   bash setup-piston.sh [domain]
# Without a domain it uses <ip>.sslip.io, which points to this VPS and gets a free HTTPS certificate.
# Safe to run again: it keeps the same token and reinstalls the containers/config.
# At the end it prints the PISTON_URL and PISTON_TOKEN to put in the backend env on Render.
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this as root (sudo bash setup-piston.sh)" >&2
  exit 1
fi

IP="$(curl -fsS https://api.ipify.org)"
DOMAIN="${1:-${IP//./-}.sslip.io}"
TOKEN_FILE=/root/piston-token
[ -s "$TOKEN_FILE" ] || openssl rand -hex 24 > "$TOKEN_FILE"
chmod 600 "$TOKEN_FILE"
TOKEN="$(cat "$TOKEN_FILE")"
RUNTIMES="python:3.12.0 node:20.11.1 java:15.0.2"

# A new VPS runs automatic system updates right after boot, which locks apt for a while.
wait_for_apt() {
  for _ in $(seq 1 360); do
    pgrep -f "^/usr/bin/python3 /usr/bin/unattended-upgrade$|apt-get |^/usr/bin/dpkg " >/dev/null || return 0
    echo "  waiting for automatic system updates to finish..."
    sleep 10
  done
  echo "apt is still locked after 60 minutes" >&2
  exit 1
}

echo "== 1/5 Docker"
if ! command -v docker >/dev/null; then
  wait_for_apt
  curl -fsSL https://get.docker.com | sh
fi

echo "== 2/5 Piston"
docker rm -f piston >/dev/null 2>&1 || true
# only reachable from this machine (127.0.0.1); Caddy is the public entry point.
# CPU time: Java compiles and starts a JVM inside the run stage, which does not fit in Piston's default 3s.
docker run -d --name piston --privileged --restart unless-stopped \
  -v piston_packages:/piston/packages \
  -e PISTON_RUN_TIMEOUT=10000 \
  -e PISTON_COMPILE_TIMEOUT=10000 \
  -e PISTON_RUN_CPU_TIME=10000 \
  -e PISTON_COMPILE_CPU_TIME=10000 \
  -e PISTON_MAX_CONCURRENT_JOBS=6 \
  -e PISTON_OUTPUT_MAX_SIZE=200000 \
  -p 127.0.0.1:2000:2000 \
  ghcr.io/engineer-man/piston >/dev/null

for _ in $(seq 1 30); do
  curl -fs http://127.0.0.1:2000/api/v2/runtimes >/dev/null && break
  sleep 2
done

echo "== 3/5 Languages ($RUNTIMES)"
for runtime in $RUNTIMES; do
  language="${runtime%%:*}"
  version="${runtime##*:}"
  if curl -fs http://127.0.0.1:2000/api/v2/packages | grep -q "\"language\":\"$language\",\"language_version\":\"$version\",\"installed\":true"; then
    echo "  $language $version already installed"
  else
    echo "  installing $language $version ..."
    curl -s -X POST http://127.0.0.1:2000/api/v2/packages -H 'Content-Type: application/json' \
      -d "{\"language\":\"$language\",\"version\":\"$version\"}"
    echo
  fi
done

echo "== 4/5 Caddy (HTTPS for $DOMAIN)"
if ! command -v caddy >/dev/null; then
  wait_for_apt
  apt-get update -qq
  apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https curl gnupg >/dev/null
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor --yes -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -qq
  apt-get install -y -qq caddy >/dev/null
fi

# only running code and listing languages is public (with the token); installing/removing packages is not
cat > /etc/caddy/Caddyfile <<EOF
$DOMAIN {
    @allowed {
        header Authorization "Bearer $TOKEN"
        path /api/v2/execute /api/v2/runtimes
    }
    handle @allowed {
        reverse_proxy 127.0.0.1:2000
    }
    handle {
        respond "Forbidden" 403
    }
}
EOF
systemctl enable --now caddy >/dev/null
systemctl reload caddy

if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then
  ufw allow 80/tcp >/dev/null
  ufw allow 443/tcp >/dev/null
fi

echo "== 5/5 Test (waiting for the HTTPS certificate)"
ok=""
for _ in $(seq 1 20); do
  result="$(curl -fsS -X POST "https://$DOMAIN/api/v2/execute" \
    -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
    -d '{"language":"python","version":"*","files":[{"content":"print(input()[::-1])"}],"stdin":"olleh"}' 2>/dev/null || true)"
  if echo "$result" | grep -q '"stdout":"hello'; then ok=1; break; fi
  sleep 3
done

echo
curl -fs http://127.0.0.1:2000/api/v2/runtimes | grep -o '"language":"[a-z]*","version":"[0-9.]*"' || true
echo
if [ -n "$ok" ]; then
  echo "Piston is working."
else
  echo "Piston did not answer the test over HTTPS yet. Last response: $result"
  echo "Check: docker logs piston   and   journalctl -u caddy --no-pager | tail -30"
fi
echo
echo "Set these in the backend environment on Render:"
echo "PISTON_URL=https://$DOMAIN"
echo "PISTON_TOKEN=$TOKEN"
