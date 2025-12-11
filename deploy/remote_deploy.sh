#!/usr/bin/env bash
set -euo pipefail

# remote_deploy.sh
# Usage: sudo bash remote_deploy.sh /home/USER/public_html jecrc9762 3000
# Arguments:
#   1: APP_DIR (default /home/jecrcfoundation/public_html)
#   2: RUN_USER (default jecrc9762)
#   3: PORT (default 3000)

APP_DIR=${1:-/home/jecrcfoundation/public_html}
RUN_USER=${2:-jecrc9762}
PORT=${3:-3000}
SERVICE_NAME=${4:-jecrc-nextjs}

echo "Deploying app in: $APP_DIR as user: $RUN_USER on port: $PORT"

if [ ! -d "$APP_DIR" ]; then
  echo "Error: app directory does not exist: $APP_DIR"
  exit 2
fi

cd "$APP_DIR"

echo "Installing Node dependencies..."
if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

echo "Building Next.js application..."
npm run build

echo "Creating systemd service for $SERVICE_NAME..."
SERVICE_FILE=/etc/systemd/system/${SERVICE_NAME}.service
cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=Next.js app $SERVICE_NAME
After=network.target

[Service]
Type=simple
User=$RUN_USER
WorkingDirectory=$APP_DIR
Environment=NODE_ENV=production
Environment=PORT=$PORT
ExecStart=/usr/bin/npm run start -- -p $PORT
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

echo "Reloading systemd and starting service..."
systemctl daemon-reload
systemctl enable --now "$SERVICE_NAME"

echo "Waiting briefly for service to start..."
sleep 2

echo "Checking app on localhost:$PORT"
if command -v curl >/dev/null 2>&1; then
  curl -I --max-time 5 "http://127.0.0.1:$PORT/" || true
else
  ss -lnpt | grep $PORT || true
fi

echo "Deployment script finished. If the service failed to start, check 'journalctl -u $SERVICE_NAME -b' and the npm logs."
