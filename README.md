# ThemeForge

> Open source code editor theme builder — design, preview, and export themes directly in your browser.

![preview](packages/frontend/public/preview.png)

**[Open App](https://themeforge-theme-builder.vercel.app)** · **[Gallery](https://themeforge-theme-builder.vercel.app/gallery)** · **[Contributing](CONTRIBUTING.md)** · **[License](LICENSE)**

---

ThemeForge is a fully client-side theme editor for VS Code, Cursor, and other code editors. Pick colors with an HSV picker, see live syntax highlighting in real time, check WCAG contrast compliance, and export a ready-to-install `.vsix` file — all without signing up or sending your data anywhere.

---

## Features

### Editor

- **Visual color picker** — HSV 2D palette, hue slider, hex input, and 36 presets
- **Live preview** — VS Code chrome mockup with syntax highlighting, file explorer, breadcrumbs, activity bar, status bar, and terminal
- **Multi-language tabs** — TypeScript and Python previews; drag to reorder, open/close freely
- **Undo / Redo** — Ctrl+Z / Ctrl+Y with a full history panel (up to 50 snapshots, jumpable)
- **Dark / Light switch** — confirmation modal if unsaved history exists
- **Import** — load any existing `.vsix` or `theme.json` file

### Color Analysis

- **WCAG 2.1 contrast checker** — AA / AAA compliance badges on every color pair
- **Color harmony scoring** — complementary, analogous, triadic hue analysis
- **Readability score** — checks 7 key token/background pairs

### Export & Sharing

- **Export to .vsix** — one-click install for VS Code and Cursor (client-side JSZip, no server round-trip)
- **Share themes** — generate a permanent link (e.g. `/theme/V1StGXR8_Z`)
- **View-only mode** — shared links open read-only; click "Edit a copy" to fork
- **Public gallery** — browse and discover community themes

---

## Getting Started

### Prerequisites

- Node.js >= 20
- npm >= 10

### Install

```bash
git clone https://github.com/erenisci/themeforge
cd themeforge
npm install
cd packages/shared && npm run build && cd ../..
```

### Run

```bash
# Copy env files first
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.local.example packages/frontend/.env.local

# Start everything (Turborepo)
npm run dev
```

Or individually:

```bash
npm run dev:backend    # Express on :3001
npm run dev:frontend   # Next.js on :3000
```

Open [http://localhost:3000/editor](http://localhost:3000/editor).

---

## Environment Variables

**Backend** (`packages/backend/.env`):

```bash
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
TURSO_DATABASE_URL=file:./data/themes.db   # local SQLite; use Turso URL in production
TURSO_AUTH_TOKEN=                          # leave empty for local dev
```

**Frontend** (`packages/frontend/.env.local`):

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Project Structure

```
themeforge/
├── packages/
│   ├── shared/          # TypeScript types + WCAG / harmony / readability algorithms
│   ├── backend/         # Express + Turso (libSQL) — theme sharing API
│   └── frontend/        # Next.js 14 App Router — editor UI
├── vercel.json
├── turbo.json
└── package.json
```

### Backend API

| Method | Path                  | Description                      | Rate limit    |
| ------ | --------------------- | -------------------------------- | ------------- |
| `POST` | `/api/themes/share`   | Save a theme, get a shareable ID | 5 / hr / IP   |
| `GET`  | `/api/themes/:id`     | Fetch a shared theme by ID       | —             |
| `GET`  | `/api/themes/gallery` | List public themes (paginated)   | 30 / min / IP |
| `GET`  | `/health`             | Health check                     | —             |

### Frontend Routes

| Route            | Description                                     |
| ---------------- | ----------------------------------------------- |
| `/editor`        | Main editor — loads default dark theme on start |
| `/theme/:id`     | View-only shared theme — "Edit a copy" to fork  |
| `/gallery`       | Community theme browser                         |
| `/legal/terms`   | Terms of Service                                |
| `/legal/privacy` | Privacy Policy                                  |

---

## How Sharing Works

1. Click **Share** in the toolbar
2. Optionally enter a theme name and your name, and check **Add to public gallery**
3. Click **Generate Link** — a permanent URL is created (nanoid 10-char ID)
4. Anyone opening that link sees the theme in **view-only** mode
5. Click **Edit a copy** to fork it into the editor — a new ID is generated on save

---

## How Export Works

Click **Export** in the toolbar → choose your editor (VS Code / Cursor, more coming). The `.vsix` file is built entirely in the browser using JSZip — no server involved. It includes both `tokenColors` and `semanticTokenColors`.

To install in VS Code or Cursor:

- Drag the `.vsix` into the Extensions panel, **or**
- Run `Extensions: Install from VSIX` from the command palette

---

## Color Analysis

All analysis runs in the browser — no AI, no external API.

**WCAG 2.1** (`packages/shared/src/algorithms/wcag.ts`):

```
relativeLuminance = 0.2126R + 0.7152G + 0.0722B  (after gamma correction)
contrastRatio     = (L1 + 0.05) / (L2 + 0.05)
AAA ≥ 7:1 · AA ≥ 4.5:1 · fail < 4.5:1
```

**Harmony** (`packages/shared/src/algorithms/harmony.ts`): scores complementary (~180°), analogous (≤30°), and triadic (~120°) hue relationships across all token foreground colors.

**Readability** (`packages/shared/src/algorithms/readability.ts`): checks 7 key token/background contrast pairs and returns a 0–100 score.

---

## Tech Stack

| Layer    | Technology                                                            |
| -------- | --------------------------------------------------------------------- |
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Zustand, @dnd-kit, lucide-react |
| Backend  | Express, TypeScript, @libsql/client (Turso)                           |
| Shared   | tsup, zod, nanoid                                                     |
| Export   | JSZip (client-side)                                                   |
| Monorepo | Turborepo, npm workspaces                                             |

---

## Contributing

Pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to add new language previews and editor export targets.

For bugs or feature requests, [open an issue](https://github.com/erenisci/themeforge/issues).

---

## License

[MIT](LICENSE) © [erenisci](https://github.com/erenisci)
