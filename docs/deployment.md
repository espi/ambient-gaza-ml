# Deployment Guide

This guide covers deploying your MapLibre GL Next.js application to various platforms with optimization for production.

## Pre-deployment Checklist

### Environment Configuration
- [ ] Set up production environment variables
- [ ] Configure MapTiler API key for production
- [ ] Remove development-only code and console.logs
- [ ] Verify all dependencies are in `dependencies` (not `devDependencies`)

### Performance Optimization
- [ ] Run `npm run build` to test production build
- [ ] Optimize images and static assets
- [ ] Configure appropriate caching headers
- [ ] Test map performance with production data

### Security
- [ ] Ensure API keys are not exposed in client-side code
- [ ] Configure CORS if needed
- [ ] Set up proper CSP headers
- [ ] Review and limit API key permissions

## Vercel Deployment (Recommended)

Vercel is the easiest deployment option for Next.js applications.

### Automatic Deployment

1. **Connect Repository**
   ```bash
   # Push your code to GitHub/GitLab/Bitbucket
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel auto-detects Next.js configuration

3. **Configure Environment Variables**
   In Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `MAPTILER_KEY` for server-side usage
   - Add `NEXT_PUBLIC_MAPTILER_KEY` for client-side usage

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Vercel Configuration

Create `vercel.json` for advanced configuration:

```json
{
  "build": {
    "env": {
      "NEXT_PUBLIC_MAPTILER_KEY": "@maptiler-key"
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=1, stale-while-revalidate" }
      ]
    }
  ]
}
```

## Netlify Deployment

### Automatic Deployment

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Build Configuration**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"

   [build.environment]
     NODE_VERSION = "18"
     NPM_VERSION = "9"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Environment Variables**
   - Go to Site settings → Environment variables
   - Add your MapTiler API key

### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=out
```

## Self-Hosted Deployment

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Update `next.config.js` for standalone output:

```javascript
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  webpack: config => {
    config.resolve.alias['mapbox-gl'] = 'maplibre-gl'
    return config
  },
}

module.exports = nextConfig
```

Build and run:

```bash
# Build Docker image
docker build -t maplibre-app .

# Run container
docker run -p 3000:3000 -e MAPTILER_KEY=your_key maplibre-app
```

### PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start npm --name "maplibre-app" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'maplibre-app',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      MAPTILER_KEY: 'your_production_key'
    }
  }]
}
```

## Static Export

For static hosting (GitHub Pages, S3, etc.):

### Configure Static Export

Update `next.config.js`:

```javascript
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack: config => {
    config.resolve.alias['mapbox-gl'] = 'maplibre-gl'
    return config
  },
}

module.exports = nextConfig
```

### Build and Export

```bash
# Build static export
npm run build

# The static files will be in the 'out' directory
```

### GitHub Pages Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build
      run: npm run build
      env:
        NEXT_PUBLIC_MAPTILER_KEY: ${{ secrets.MAPTILER_KEY }}

    - name: Deploy
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

## Environment Management

### Production Environment Variables

Create production `.env.production`:

```env
NODE_ENV=production
MAPTILER_KEY=your_production_key
NEXT_PUBLIC_MAPTILER_KEY=your_production_key
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

### Environment-Specific Configuration

```javascript
// lib/config.js
const config = {
  development: {
    mapTilerKey: process.env.NEXT_PUBLIC_MAPTILER_KEY,
    apiUrl: 'http://localhost:3000/api',
  },
  production: {
    mapTilerKey: process.env.NEXT_PUBLIC_MAPTILER_KEY,
    apiUrl: 'https://your-domain.com/api',
  }
}

export default config[process.env.NODE_ENV || 'development']
```

## Performance Optimization

### Next.js Optimization

```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: ['api.maptiler.com'],
  },
  webpack: config => {
    config.resolve.alias['mapbox-gl'] = 'maplibre-gl'
    
    // Optimize bundle size
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        maplibre: {
          test: /[\\/]node_modules[\\/](maplibre-gl|react-map-gl)[\\/]/,
          name: 'maplibre',
          priority: 10,
        },
      },
    }
    
    return config
  },
}
```

### CDN Configuration

For better map tile loading performance:

```javascript
// lib/map-config.js
export const mapStyles = {
  streets: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
  satellite: `https://api.maptiler.com/maps/satellite/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`,
}

// Add CDN for static assets
export const assetPrefix = process.env.NODE_ENV === 'production' 
  ? 'https://your-cdn.com' 
  : ''
```

## Monitoring and Analytics

### Vercel Analytics

```tsx
// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

### Error Monitoring

```bash
# Install Sentry
npm install @sentry/nextjs
```

Configure `sentry.client.config.js`:

```javascript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

## Security Best Practices

### API Key Security

```javascript
// lib/api-client.js
const API_KEY = process.env.MAPTILER_KEY // Server-side only

export async function fetchMapData() {
  // Use server-side API key for sensitive requests
  const response = await fetch(`https://api.maptiler.com/data?key=${API_KEY}`)
  return response.json()
}
```

### Content Security Policy

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.maptiler.com;
      style-src 'self' 'unsafe-inline' https://api.maptiler.com;
      img-src 'self' data: https: https://api.maptiler.com;
      connect-src 'self' https://api.maptiler.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}
```

## Troubleshooting Deployment Issues

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Check for TypeScript errors
npm run build
```

### Map Loading Issues

1. **Check API key configuration**
2. **Verify CORS settings**
3. **Test with different map styles**
4. **Monitor network requests**

### Performance Issues

1. **Analyze bundle size**: `npm run build -- --analyze`
2. **Use Next.js built-in performance monitoring**
3. **Implement lazy loading for map components**
4. **Optimize image assets**

### Environment Variable Issues

```bash
# Debug environment variables
console.log('Environment:', process.env.NODE_ENV)
console.log('API Key available:', !!process.env.NEXT_PUBLIC_MAPTILER_KEY)
```

## Rollback Strategy

### Git-based Rollback

```bash
# Revert to previous commit
git log --oneline
git revert <commit-hash>
git push origin main
```

### Platform-specific Rollback

- **Vercel**: Use deployment history in dashboard
- **Netlify**: Use site deploys section
- **Docker**: Keep previous image versions tagged 