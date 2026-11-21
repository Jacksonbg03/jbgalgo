# Own code runner (Piston on a VPS)

By default the backend runs student code on Wandbox, a free shared service that rate-limits a class running code at the same time.
With `PISTON_URL` set, the backend uses our own [Piston](https://github.com/engineer-man/piston) server instead and only falls back to Wandbox when it is down.

## VPS

- 2 CPU / 2 GB RAM is enough for one class (Java needs the memory).
- Must be **KVM** (Piston needs Docker with `--privileged`; OpenVZ/LXC VPSes cannot do this).
- Ubuntu 22.04 or 24.04.

## Setup

Copy `setup-piston.sh` to the VPS and run it as root:

```bash
scp vps/setup-piston.sh root@<vps-ip>:/root/
ssh root@<vps-ip> "bash /root/setup-piston.sh"
```

It installs Docker, Piston (Python 3.12, Node 20, Java 15) and Caddy, which serves Piston over HTTPS at `<ip>.sslip.io`
(or a domain passed as the first argument) and only accepts requests carrying a random token.
At the end it prints the two values for the backend.

## Backend (Render → Environment)

| Variable | Value |
|---|---|
| `PISTON_URL` | printed by the script, e.g. `https://103-1-2-3.sslip.io` |
| `PISTON_TOKEN` | printed by the script (also stored in `/root/piston-token` on the VPS) |
| `PISTON_MAX_CONCURRENT` | optional, programs run at once (default 4) |

Remove `PISTON_URL` to go back to Wandbox.

## Useful commands on the VPS

```bash
docker logs --tail 50 piston          # Piston errors
journalctl -u caddy --no-pager | tail # HTTPS / certificate problems
docker restart piston
```
