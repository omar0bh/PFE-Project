# TechWatch AI - Frontend Deployment Guide

## Building for Production

### Local Build & Test

```bash
cd frontend
npm run build
npm run preview
```

Visit `http://localhost:4173` to test the production build locally.

## Deployment Options

### 1. Vercel (Recommended for Frontend)

**Pros:** Instant deployment, automatic SSL, CDN, serverless functions

```bash
npm install -g vercel
cd frontend
vercel
```

**Or connect GitHub:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Set environment: `VITE_API_URL=https://your-backend.com`
4. Deploy

### 2. Netlify

**Pros:** Easy deployment, great performance, split testing

1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repo
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_API_URL`
6. Deploy

### 3. Self-Hosted (VPS/Dedicated Server)

**Prerequisites:**
- Ubuntu/Debian server
- Node.js installed
- Nginx or Apache

**Steps:**
```bash
# Clone repository
git clone <repo-url>
cd techwatch-ai/frontend

# Install & build
npm install
npm run build

# Configure Nginx
sudo nano /etc/nginx/sites-available/default

# Add to Nginx config:
# server {
#     listen 80;
#     server_name yourdomain.com;
#     
#     root /path/to/techwatch-ai/frontend/dist;
#     index index.html;
#     
#     location / {
#         try_files $uri $uri/ /index.html;
#     }
#     
#     location /api {
#         proxy_pass http://localhost:5000;
#     }
# }

# Restart Nginx
sudo systemctl restart nginx

# Enable HTTPS with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 4. Docker

**Build image:**
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build & run:**
```bash
docker build -t techwatch-ai-frontend .
docker run -p 80:80 techwatch-ai-frontend
```

### 5. GitHub Pages (Static Only)

Requires public repo and no API calls.

```bash
# In package.json add:
# "homepage": "https://yourusername.github.io/techwatch-ai"

npm run build
npm install -g gh-pages
gh-pages -d dist
```

## Backend Deployment

### 1. Railway (Recommended)

1. Connect GitHub repo to Railway
2. Create MySQL service
3. Create Python service
4. Set environment variables
5. Deploy

### 2. Heroku (Alternative)

```bash
# Create Procfile
echo "web: gunicorn run:app" > Procfile

# Deploy
heroku create techwatch-ai-api
heroku addons:create cleardb:ignite
git push heroku main
```

### 3. PythonAnywhere

1. Upload files via web interface
2. Configure web app settings
3. Set environment variables
4. Enable HTTPS

## Environment Configuration

### Frontend (.env.production)

```
VITE_API_URL=https://api.yourdomain.com
```

### Backend (.env)

```
APP_BASE_URL=https://yourdomain.com
FLASK_ENV=production
SECRET_KEY=strong-secret-key-change-this
DATABASE_URL=mysql://user:pass@host/db
GEMINI_API_KEY=your-api-key
MAIL_SERVER=smtp.gmail.com
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## Performance Optimization

### Frontend
- CSS minification: ✓ (automatic with Vite)
- JavaScript minification: ✓ (automatic)
- Asset compression: Enable gzip on server
- Image optimization: Add Vite plugin

### Backend
- Database indexing: Create indexes on Source.active, Article.created_at
- Connection pooling: Use SQLAlchemy pool
- Caching: Redis for frequently accessed data
- API rate limiting: Use Flask-Limiter

## Monitoring & Maintenance

### Frontend
- Monitor bundle size with `npm run build`
- Setup Sentry for error tracking
- Monitor page performance with web vitals

### Backend
- Monitor API response times
- Setup logging with ELK stack
- Database query monitoring
- Error tracking with Sentry

## Backup & Recovery

### Database Backup
```bash
# Daily backup
0 2 * * * mysqldump -u root -p$DB_PASSWORD $DB_NAME > /backups/db-$(date +%Y%m%d).sql
```

### Application Backup
```bash
# Weekly backup
0 3 * * 0 tar -czf /backups/app-$(date +%Y%m%d).tar.gz /path/to/app/
```

## SSL/HTTPS Setup

### Let's Encrypt with Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
sudo certbot renew --dry-run  # Test renewal
```

Certbot auto-renews 30 days before expiration.

## Scaling for Production

### Database
- Use connection pooling (SQLAlchemy pool_size)
- Add read replicas for read-heavy operations
- Setup automated backups

### Frontend
- Use CDN (Cloudflare, Cloudfront)
- Enable compression (gzip, brotli)
- Cache static assets (1 year)

### Backend
- Use load balancer (Nginx, HAProxy)
- Run multiple gunicorn workers
- Use Redis for caching
- Setup message queue (Celery) for long tasks

## Continuous Deployment (CI/CD)

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Frontend
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Troubleshooting Deployment

### Frontend issues
- Check bundle size: `npm run build`
- Verify API endpoint in .env
- Check CORS headers from backend
- Look for 404 on static files

### Backend issues
- Check database connection
- Verify environment variables
- Check disk space
- Monitor memory usage

### API connection
```bash
# Test API endpoint
curl -H "Accept: application/json" https://api.yourdomain.com/api/dashboard

# Check CORS
curl -H "Origin: https://yourdomain.com" https://api.yourdomain.com/api/dashboard
```

## Health Checks

### Frontend
```bash
curl https://yourdomain.com
# Should return HTML with status 200
```

### Backend
```bash
curl https://api.yourdomain.com/api/dashboard
# Should return JSON with status 200
```

## Support & Documentation

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Railway Docs: https://docs.railway.app
- Heroku Docs: https://devcenter.heroku.com

---

**Questions? Check the main README.md for support options.**
