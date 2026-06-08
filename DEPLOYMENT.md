# VPS Deployment Guide

This guide outlines how to deploy your developer portfolio and built-in CMS onto a self-hosted VPS (such as DigitalOcean, Linode, AWS EC2, or Hetzner).

## Prerequisites

1. A VPS running Ubuntu (20.04 or 22.04 recommended).
2. Docker and Docker Compose installed on the VPS.
3. A domain name pointed to your VPS IP address (e.g. `yourportfolio.com`).

---

## Option 1: Docker Compose Deployment (Recommended)

Docker Compose sets up both the MongoDB database and your Next.js application in containers automatically.

### 1. Copy Files to VPS

Clone your repository or copy the project files to your VPS. Make sure the following files are present:
- `Dockerfile`
- `docker-compose.yml`
- `package.json`
- `package-lock.json`
- `next.config.ts`
- All code directories (`src/`, `public/`, `scripts/`, etc.)

### 2. Configure Environment Variables

Edit the `environment` section in `docker-compose.yml` on the VPS to set your production settings:

```yaml
    environment:
      - MONGODB_URI=mongodb://admin:secret@mongodb:27017/portfolio?authSource=admin
      - SESSION_SECRET=YOUR_SECURE_RANDOM_SESSION_SECRET # Generate with: openssl rand -base64 32
      - NEXT_PUBLIC_SITE_URL=https://yourportfolio.com
      - RESEND_API_KEY=your_resend_api_key
      - RESEND_FROM_EMAIL=contact@yourportfolio.com
      - CONTACT_TO_EMAIL=your_email@gmail.com
```

### 3. Build and Start the Containers

Run the following command from the project root directory:

```bash
docker compose up -d --build
```

This will:
- Build the Next.js production Docker image.
- Download the MongoDB 6.0 image.
- Spin up both containers in the background (`-d`).
- Create a persistent volume (`mongodb_data`) to prevent database loss during container updates.

### 4. Seed the Production Database

To seed your admin credentials (`admin@portfolio.dev` / `Admin@1234`) inside the container:

```bash
docker compose exec app npm run seed
```

---

## Option 2: PM2 & Native Node.js Deployment

If you prefer to run the application directly on Node.js without Docker:

### 1. Install Node.js & MongoDB on the VPS

Install Node.js 20+ and MongoDB Community Server on your Ubuntu server. Make sure MongoDB authentication is configured if required.

### 2. Install PM2 Globally

```bash
npm install -g pm2
```

### 3. Clone and Build App

```bash
git clone <your-repo-url> portfolio
cd portfolio
npm ci
npm run build
```

### 4. Configure `.env.local`

Create `/var/www/portfolio/.env.local` and add:

```env
MONGODB_URI=mongodb://admin:secret@localhost:27017/portfolio?authSource=admin
SESSION_SECRET=YOUR_SECURE_RANDOM_SESSION_SECRET
NEXT_PUBLIC_SITE_URL=https://yourportfolio.com
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=contact@yourportfolio.com
CONTACT_TO_EMAIL=your_email@gmail.com
```

### 5. Start with PM2

```bash
pm2 start npm --name "portfolio" -- start
pm2 save
pm2 startup
```

---

## Reverse Proxy with Nginx (SSL)

To expose the application to the internet securely on ports 80 (HTTP) and 443 (HTTPS), configure Nginx:

1. Install Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. Create a server block config (`/etc/nginx/sites-available/portfolio`):
   ```nginx
   server {
       listen 80;
       server_name yourportfolio.com www.yourportfolio.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Enable config and test Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. Set up Let's Encrypt SSL:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourportfolio.com -d www.yourportfolio.com
   ```
