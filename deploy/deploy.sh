#!/usr/bin/env bash
# Run on the VPS: pulls latest main and publishes. First time: git clone <repo> /var/www/chatcartpro
set -euo pipefail
cd /var/www/chatcartpro
git pull --ff-only origin main
sudo nginx -t && sudo systemctl reload nginx
echo "Deployed $(git rev-parse --short HEAD)"
