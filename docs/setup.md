# Setup Guide

This guide will help you set up the MapLibre GL Next.js starter project on your local machine.

## Prerequisites

### System Requirements
- **Node.js**: 18.18+ or 20.10+ (required for Next.js 15.1)
- **Package Manager**: npm (comes with Node.js), yarn, or pnpm
- **Git**: For cloning the repository

### External Services
- **MapTiler Account**: Free account required for map tiles
  - Sign up at [https://www.maptiler.com/](https://www.maptiler.com/)
  - Get your API key from the dashboard

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ambient-gaza-ml
```

### 2. Install Dependencies

Choose your preferred package manager:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your MapTiler API key:

```env
MAPTILER_KEY=your_actual_maptiler_api_key_here
NEXT_PUBLIC_MAPTILER_KEY=your_actual_maptiler_api_key_here
```

**Important**: Never commit your `.env.local` file to version control!

### 4. Verify Installation

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the map interface.

## Common Issues

### Node.js Version Issues
If you encounter build errors, ensure you're using Node.js 18.18+ or 20.10+:

```bash
node --version
```

### MapTiler API Key Issues
- Ensure your API key is correctly added to `.env.local`
- Check that the key has the necessary permissions in your MapTiler dashboard
- Verify the key is not exceeded its usage limits

### Port Conflicts
If port 3000 is in use, Next.js will suggest an alternative port. You can also specify a different port:

```bash
npm run dev -- -p 3001
```

## Next Steps

- See [Development Guide](./development.md) for development workflows
- See [MapLibre Integration Guide](./maplibre-setup.md) for map customization
- See [Deployment Guide](./deployment.md) for production deployment 