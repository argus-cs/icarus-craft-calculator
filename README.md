# Icarus Craft Calculator

Mobile-first PWA for looking up [Icarus](https://store.steampowered.com/app/1149460/ICARUS/) crafting recipes with recursive material drill-down and quantity calculation.

## Features

- **1030+ items** scraped from the [Icarus Wiki](https://icarus.fandom.com/) via MediaWiki API
- **Recursive material drill-down** — tap any craftable material to see its sub-materials
- **Quantity calculator** — adjust how many you want to craft and see total materials needed
- **Category filtering** — Tools, Constructions, Deployables, Resources
- **Real-time search** — filter items as you type
- **Bottom sheet drawer** — swipe-to-dismiss material details with internal navigation stack
- **Item icons** — loaded directly from the Icarus Wiki
- **PWA** — installable on mobile, works offline after first load

## Tech Stack

- **Nuxt 4** (SSG) + **Vue 3** + **TypeScript**
- **Tailwind CSS v4** — dark theme with amber accent
- **@vite-pwa/nuxt** — service worker + installability
- **Cheerio + ofetch** — wiki scraper
- **Zod** — data validation
- **Vitest** — unit tests
- **Docker** — development environment

## Getting Started

### With Docker

```bash
docker compose up --build
```

App available at `http://localhost:3000/icarus-craft-calculator/`

### Without Docker

```bash
npm install
npm run dev
```

## Running Tests

```bash
npm run test
```

Or with Vitest watch mode:

```bash
npx vitest
```

## Updating Wiki Data

The scraper fetches crafting data from the Icarus Fandom Wiki using the MediaWiki API:

```bash
npx tsx scripts/scrape.ts
```

This generates `public/data/items.json` with all items, materials, crafting stations and icon URLs.

## Deployment

The project is configured for GitHub Pages deployment via GitHub Actions. Push to `main` to trigger a deploy:

```bash
npx nuxt generate
```

Static output is generated in `.output/public/`.

## Project Structure

```
app/
  components/     # Vue components (SearchBar, ItemCard, MaterialDrawer, etc.)
  composables/    # Reactive state (useItems, useCraftCalculator, useStations)
  pages/          # Nuxt pages (index, items/[id])
  types/          # TypeScript interfaces
scripts/
  scrapers/       # Wiki scraper (MediaWiki API + wikitext parser)
  utils/          # Parser and writer utilities
tests/            # Vitest unit tests
public/data/      # Generated items.json (committed)
```

## License

MIT
