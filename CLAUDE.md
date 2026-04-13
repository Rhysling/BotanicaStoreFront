# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Dev server on port 5050
npm run build      # Vite build + cache-busting via bust.js
npm run preview    # Preview production build
npm run check      # Type-check with svelte-check + TypeScript
```

There is no test suite. Type-checking (`npm run check`) is the primary correctness tool.

## Architecture Overview

This is a **Svelte 5 SPA** (no SvelteKit) for a plant nursery storefront with admin capabilities. It uses a custom client-side router and communicates with a .NET backend API.

### Tech Stack

- **Svelte 5** with runes — use `$state`, `$derived`, `$effect` (not legacy `let`/`$:` syntax)
- **Vite 8**, **TypeScript 6**, **SCSS**
- **Axios** for API calls (base URL injected into `index.html` as global `baseURL`)
- **SweetAlert2** for modals, **DOMPurify** for HTML sanitization

### Routing

Custom router in [src/stores/route-store.ts](src/stores/route-store.ts). No file-based routing.

- `navTo(routeName, params?)` — programmatic navigation via `pushState`
- `navFromUrl()` — called on mount and `popstate` to sync URL → store
- Routes are defined as a tree; admin-only routes are filtered based on `user.isAdmin`
- Parameterized routes use `URLSearchParams` (e.g., `/plant?id=123`)
- [src/App.svelte](src/App.svelte) reads `$currentRoute` and renders the matching page component

### State Management

All state lives in Svelte stores under [src/stores/](src/stores/). Key stores:

| Store | Purpose |
|---|---|
| `user-store.ts` | Auth state + JWT token, persisted to `localStorage` |
| `httpclient-store.ts` | Axios instance derived from user store; auto-injects Bearer token |
| `route-store.ts` | Current route and path |
| `wishlist-store.ts` | Shopping cart, synced to DB |
| `availableplants-store.ts` | Inventory (plants for sale) |
| `listedplants-store.ts` | Plant catalog |

Stores expose `init()` methods called from components on mount. The HTTP client store is derived from the user store so auth headers update automatically on login/logout. A 401 response triggers automatic logout via an Axios interceptor.

### Types

- [src/types/models.d.ts](src/types/models.d.ts) — generated from the .NET backend; do not edit manually. Interfaces are prefixed with `I` (e.g., `IPlant`). Nullable fields use `INullable<T>`.
- [src/types/main.d.ts](src/types/main.d.ts) — hand-written types: `Route`, `User`, filter types, etc.

### Styling

- Global styles in [src/styles/app.scss](src/styles/app.scss)
- Theme variables (colors, breakpoints) in [src/styles/_custom-variables.scss](src/styles/_custom-variables.scss)
- Primary color: olive-green `#464505`; secondary: blue `#324373`; mobile breakpoint: `560px`
- Component-scoped styles use `<style lang="scss">`

### Global Variables (injected by index.html)

`baseURL`, `appIsProduction`, `appVersionKey` are injected as globals at runtime. Google Sign-In client ID is also set there.

### Admin Area

Admin pages live in [src/pages/admin/](src/pages/admin/) and components in [src/components/admin/](src/components/admin/). Access is gated by `user.isAdmin` in the router.
