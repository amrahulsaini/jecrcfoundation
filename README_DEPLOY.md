# Deployment instructions

This file contains commands to run on your server to deploy the Next.js site after you push the repository to GitHub and pull it on the server.

1) Clone repository on the server (choose SSH or HTTPS):

   # SSH (preferred if you set up keys)
   git clone git@github.com:amrahulsaini/jecrcfoundation.git /home/jecrc.foundation/public_html

   # or HTTPS
   git clone https://github.com/amrahulsaini/jecrcfoundation.git /home/jecrc.foundation/public_html

2) Run the deploy script (example):

   sudo bash deploy/remote_deploy.sh /home/jecrc.foundation/public_html jecrc9762 3000

3) Verify the app is running on port 3000:

   curl -I http://127.0.0.1:3000/

4) Ensure OpenLiteSpeed vhost is configured to proxy to 127.0.0.1:3000 (the vhost file you already prepared).

Notes:
- If your server OS does not have Node.js installed, install Node 18+ first (use NodeSource or your distro's packages).
- If you prefer PM2 instead of systemd, install pm2 and run: `pm2 start npm --name "jecrc-nextjs" -- start -- -p 3000`.
- Adjust `RUN_USER` and `APP_DIR` to match your server user and paths.
