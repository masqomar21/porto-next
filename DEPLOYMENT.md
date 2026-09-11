# Deployment Setup Guide

## GitHub Actions Secrets Required

To enable automated deployment to production server, configure these secrets in GitHub repository settings.

### Navigate to:
```
GitHub → Repository → Settings → Secrets and variables → Actions
```

---

## Required Secrets

### 1. `SSH_PRIVATE_KEY`
**Value:** Your SSH private key for server access

**Steps to get:**
```bash
# On local machine, if you have SSH key:
cat ~/.ssh/id_rsa
# OR generate new one:
ssh-keygen -t rsa -b 4096 -f github_deploy_key -N ""
cat github_deploy_key
```

**Paste:** The entire private key content (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)

---

### 2. `SSH_KNOWN_HOSTS`
**Value:** Server fingerprint to prevent man-in-the-middle attacks

**Steps to get:**
```bash
# Get fingerprint from production server
ssh-keyscan -H srv619252.hstgr.cloud 2>/dev/null
```

**Example output:**
```
srv619252.hstgr.cloud ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQD...
```

**Paste:** The entire line (starts with hostname/IP, includes `ssh-rsa` and the key)

---

### 3. `SSH_USER`
**Value:** `ai` (or the user that has deploy access)

---

### 4. `SSH_HOST`
**Value:** `srv619252.hstgr.cloud` (or your production server hostname/IP)

---

## Setup Steps

1. **Add SSH public key to server authorized_keys:**
   ```bash
   # On server (srv619252):
   cat github_deploy_key.pub >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

2. **Go to GitHub → Settings → Secrets and variables → Actions**

3. **Click "New repository secret" and add:**
   - Name: `SSH_PRIVATE_KEY` → Value: [paste entire private key]
   - Name: `SSH_KNOWN_HOSTS` → Value: [paste ssh-keyscan output]
   - Name: `SSH_USER` → Value: `ai`
   - Name: `SSH_HOST` → Value: `srv619252.hstgr.cloud`

4. **Merge a PR to `main` branch** to trigger deployment

---

## Deployment Flow

```
Developer push to main
    ↓
GitHub Actions triggers
    ↓
CI checks (lint, build, tests)
    ↓
Deploy job runs
    ↓
SSH into server
    ↓
Git pull latest code
    ↓
npm ci (install deps)
    ↓
npm run build
    ↓
PM2 restart porto
    ↓
Verify deployment (curl health check)
    ↓
✅ Deployment complete
```

---

## Testing Deployment

1. Make a change on a feature branch
2. Create a PR to `main`
3. Merge PR
4. Watch GitHub Actions tab for deployment progress
5. Check production: https://masqomar.com

---

## Troubleshooting

**SSH connection failed:**
- Verify `SSH_HOST` and `SSH_USER` are correct
- Check SSH key permissions: `chmod 600 ~/.ssh/id_rsa`
- Verify public key in server's `~/.ssh/authorized_keys`

**Build fails:**
- Check build succeeds locally: `npm run build`
- Check Node.js version matches (20.x)
- Review GitHub Actions logs for details

**PM2 restart fails:**
- Verify PM2 is running: `pm2 list`
- Check PM2 config: `/home/apps/porto/pm2.config.js`
- Verify httpsvr user has proper permissions

---

## Files Modified

- `.github/workflows/ci.yml` - CI pipeline (lint, build, security)
- `.github/workflows/deploy.yml` - Deployment pipeline (to production)

---

## Current Status

- ✓ CI pipeline: Running on every push/PR to main/update/develop
- ⏳ Deploy pipeline: Waiting for GitHub secrets setup
- Once secrets configured: Automatic deployment on every merge to main
