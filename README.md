# Advanced Next.js 15.1 Starter Kit for MapLibre GL with React TypeScript

Save some minutes by adapting this modern Next.js 15.1 TypeScript project to your needs. It comes with a custom MapLibre GL JS layer or JSX rendering output in your common Next.js stack. ✌️

The JSX rendering output is a bit slower than the layer rendering output. But it is more flexible and you can use the full power of react. The layer rendering output is unbelievably fast but you can only use the limited way of displaying layers in maplibre-gl-js, which can't really be overlapped.

You will need a MapTiler account to use the MapLibre GL JS library. You can get a free account [here](https://www.maptiler.com/). A simple mapbox-to-maplibre-gl resolver is already in place in `next.config.js`.

## Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Replace the `MAPTILER_KEY` with your own key from MapTiler
3. Don't share your key with anyone or commit it to version control

```bash
cp .env.local.example .env.local
# Edit .env.local and add your MAPTILER_KEY
```

👀 please create PR if you have some ideas to improve this starter.

🎰 Under the hood:

- **Framework**: [Next.js 15.1.0](https://github.com/vercel/next.js) / [React 18.2.0](https://github.com/facebook/react)
- **State Management**: [Zustand 5.0.2](https://github.com/pmndrs/zustand)
- **UI**:
  - [Tailwind CSS 3.4.16](https://github.com/tailwindlabs/tailwindcss)
  - [Lucide Icons 0.259.0](https://github.com/lucide-icons/lucide)
  - [react-resize-detector 9.1.0](https://github.com/maslianok/react-resize-detector)
- **Map**:
  - [MapLibre GL JS 3.6.2](https://github.com/maplibre/maplibre-gl-js)
  - [react-map-gl 7.1.7](https://github.com/visgl/react-map-gl)
- **Development**:
  - [TypeScript 5.1.6](https://github.com/microsoft/TypeScript)
  - [ESLint](https://github.com/eslint/eslint)
  - [Prettier](https://github.com/prettier/prettier)
  - [Husky](https://github.com/typicode/husky)
  - [lint-staged](https://github.com/lint-staged/lint-staged)
  - [react-styled-classnames](https://github.com/richard-unterberg/react-styled-classnames)
  - [Lodash](https://github.com/lodash/lodash)

## Getting Started

### Prerequisites

- Node.js 18.18+ or 20.10+ (required for Next.js 15.1)
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment (see Environment Setup above)

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

### 📚 Comprehensive Guides

- **[Setup Guide](./docs/setup.md)** - Complete installation and configuration instructions
- **[Development Guide](./docs/development.md)** - Development workflow, project structure, and best practices  
- **[MapLibre Integration Guide](./docs/maplibre-setup.md)** - Detailed MapLibre GL customization and usage
- **[Deployment Guide](./docs/deployment.md)** - Production deployment to various platforms
- **[Troubleshooting Guide](./docs/troubleshooting.md)** - Common issues and solutions

### Quick Links

- **MapLibre GL JS 3.6.2** - [Documentation](https://maplibre.org/maplibre-gl-js-docs/)
- **react-map-gl 7.1.7** - [Documentation](https://visgl.github.io/react-map-gl/)
- **Next.js 15.1.0** - [Documentation](https://nextjs.org/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

See our [Deployment Guide](./docs/deployment.md) for detailed instructions and alternative platforms.

