# Architecture

## Overview

ThemeForge is a mostly client-side theme editor made of three packages:

| Package    | Responsibility           | Tech                                     |
| ---------- | ------------------------ | ---------------------------------------- |
| `shared`   | Types + color algorithms | TypeScript, tsup, zod                    |
| `backend`  | Theme sharing API        | Express, Turso (libSQL)                  |
| `frontend` | Editor UI                | Next.js 14 App Router, Zustand, Tailwind |

## Frontend data flow

```
Property panels (SyntaxPanel/SemanticPanel/...) ──┐
                                                   ├─► theme.store (Zustand)
Clicking a token in the preview (TokenizedCode) ───┘     │
                                                         ├─ theme (colors, tokenColors, semanticTokenColors)
                                                         ├─ analysis (wcag/harmony/readability) — recomputed on every change
                                                         └─ history / future (undo/redo, max 50)

ui.store (Zustand): activePanel, activeLanguage, openTabs,
                    focusedColorKey, hoveredColorKey, modals, isReadOnly
```

### Key stores

- **`store/theme.store.ts`**: `setColor`, `setTokenColor`, `setSemanticColor`,
  `setTokenFontStyle`, `setEditorSetting`, `loadTheme`, `undo`/`redo`/`jumpToHistory`.
  Every mutation calls `computeAnalysis()` and pushes a snapshot to `history`.
- **`store/ui.store.ts`**: panel/language/tab state + `focusedColorKey` (preview highlight).

### Preview

- **`data/languages/*.ts`**: Hand-tokenized sample files per language
  (`LanguageDefinition` → `explorer[].lines[].tokens[]`). Each token is `{ text, scope? }`.
  A missing scope falls back to `editor.foreground`.
- **`components/preview/TokenizedCode.tsx`**: colors tokens via `resolveTokenColor` (prefix
  matching). Clicking a token opens the relevant panel and focuses its color.
- **`components/preview/VSCodeChrome.tsx`**: full VS Code chrome (title/activity/sidebar/
  breadcrumb/terminal/status). Terminal tokens are also click-to-edit.

### Color algorithms (`shared`)

- `wcag.ts`: `relativeLuminance`, `contrastRatio`, `wcagLevel` (AAA≥7, AA≥4.5).
- `harmony.ts`: hue relationships (complementary/analogous/triadic) → score 0–100.
- `readability.ts`: 7 token/background pairs → score 0–100.

## Backend API

| Method | Path                  | Description             | Rate limit |
| ------ | --------------------- | ----------------------- | ---------- |
| POST   | `/api/themes/share`   | Save a theme, return ID | 5/hr/IP    |
| GET    | `/api/themes/:id`     | Fetch a shared theme    | —          |
| GET    | `/api/themes/gallery` | Public themes (paged)   | 30/min/IP  |
| GET    | `/health`             | Health check            | —          |

- DB: Turso `shared_themes` table (`id`, `name`, `theme_json`, `author_name`, `is_public`, `created_at`).
- Zod validation, helmet/cors/compression, centralized error handler.

## Frontend routes

| Route                            | Description                                   |
| -------------------------------- | --------------------------------------------- |
| `/editor`                        | Main editor (default dark theme)              |
| `/theme/:id`                     | Read-only shared theme; "Edit a copy" to fork |
| `/gallery`                       | Community theme list                          |
| `/legal/terms`, `/legal/privacy` | Legal pages                                   |
