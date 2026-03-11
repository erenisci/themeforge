# Contributing to ThemeForge

ThemeForge is open source and built to be extended. The two most impactful contributions are **adding a new language preview** and **adding a new editor export target**.

---

## Table of Contents

- [Adding a New Language Preview](#adding-a-new-language-preview)
- [Adding a New Editor Export](#adding-a-new-editor-export)
- [Project Structure](#project-structure)
- [Submitting a PR](#submitting-a-pr)

---

## Adding a New Language Preview

Language previews live in `packages/frontend/src/data/languages/`. Each language is a static definition — no runtime parsing, no external libraries.

### Step 1 — Create the language file

```
packages/frontend/src/data/languages/language-<id>.ts
```

Example: `language-rust.ts`

### Step 2 — Implement `LanguageDefinition`

```ts
import type { LanguageDefinition } from './types';

export const languageRust: LanguageDefinition = {
  id: 'rust',
  label: 'Rust',
  filename: 'main.rs',
  statusBarLabel: 'Rust',
  breadcrumb: ['src', 'main.rs', 'main'],

  // Left sidebar file tree
  explorer: [
    { name: 'src', isFolder: true, indent: 0 },
    { name: 'main.rs', indent: 1, active: true }, // active = highlighted by default
    { name: 'lib.rs', indent: 1 },
    { name: 'Cargo.toml', indent: 0 },
  ],

  // Syntax-highlighted code lines
  lines: [
    {
      tokens: [
        { text: 'use', scope: 'keyword.control.import' },
        { text: ' ' },
        { text: 'std', scope: 'entity.name.module' },
        { text: '::' },
        { text: 'collections', scope: 'entity.name.module' },
        { text: '::' },
        { text: 'HashMap', scope: 'entity.name.type' },
        { text: ';' },
      ],
    },
    { tokens: [{ text: '' }] }, // blank line
    {
      highlight: 'line', // editor.lineHighlightBackground
      tokens: [{ text: '// Builds a frequency map', scope: 'comment' }],
    },
    {
      tokens: [
        { text: 'fn', scope: 'keyword' },
        { text: ' ' },
        { text: 'frequency', scope: 'entity.name.function' },
        { text: '(' },
        { text: 'items', scope: 'variable.parameter' },
        { text: ': &[' },
        { text: 'str', scope: 'support.type' },
        { text: ']) -> ' },
        { text: 'HashMap', scope: 'entity.name.type' },
        { text: '<&' },
        { text: 'str', scope: 'support.type' },
        { text: ', ' },
        { text: 'usize', scope: 'support.type' },
        { text: '> {' },
      ],
    },
    {
      highlight: 'selection', // editor.selectionBackground
      tokens: [
        { text: '    ' },
        { text: 'let', scope: 'keyword' },
        { text: ' ' },
        { text: 'mut', scope: 'keyword' },
        { text: ' ' },
        { text: 'map', scope: 'variable' },
        { text: ' = ' },
        { text: 'HashMap', scope: 'entity.name.type' },
        { text: '::' },
        { text: 'new', scope: 'entity.name.function' },
        { text: '();' },
      ],
    },
    { tokens: [{ text: '}' }] },
  ],
};
```

### Step 3 — Register the language

Open `packages/frontend/src/data/languages/index.ts`:

```ts
import { languageRust } from './language-rust';

export const LANGUAGES: Record<string, LanguageDefinition> = {
  typescript: languageTypeScript,
  python: languagePython,
  rust: languageRust, // ← add here
};
```

### Step 4 — Update the `ActiveLanguage` type

Open `packages/frontend/src/store/ui.store.ts`:

```ts
export type ActiveLanguage = 'typescript' | 'python' | 'rust';
```

That's it. The tab bar `+` button will automatically show your language as an option.

---

### Token Rules

**Always add a space token between words:**

```ts
// ✓ correct
{ text: 'const', scope: 'keyword' },
{ text: ' ' },
{ text: 'x', scope: 'variable' },

// ✗ wrong — words will appear joined
{ text: 'const', scope: 'keyword' },
{ text: 'x', scope: 'variable' },
```

**Tokens without a `scope` use `editor.foreground`:**

```ts
{ text: '(' }   // punctuation
{ text: ' ' }   // space
{ text: ': ' }  // colon + space
```

### TextMate Scopes

| Scope                    | Use                                           |
| ------------------------ | --------------------------------------------- |
| `keyword`                | General keywords (`fn`, `class`, `struct`)    |
| `keyword.control`        | Control flow (`if`, `for`, `while`, `return`) |
| `keyword.control.import` | Import / use statements                       |
| `keyword.operator`       | Operators (`=`, `+`, `*`, `->`)               |
| `string`                 | String literals                               |
| `constant.numeric`       | Numbers                                       |
| `comment`                | Comments                                      |
| `entity.name.function`   | Function / method names                       |
| `entity.name.class`      | Class / struct names                          |
| `entity.name.type`       | Type names                                    |
| `entity.name.module`     | Module / namespace names                      |
| `entity.name.tag`        | HTML / JSX tags                               |
| `variable`               | Variables                                     |
| `variable.parameter`     | Function parameters                           |
| `variable.language`      | `self`, `this`                                |
| `support.type`           | Built-in types (`int`, `str`, `usize`)        |
| `support.function`       | Built-in functions (`len`, `print`)           |

### Line Highlights

```ts
{ highlight: 'line', tokens: [...] }       // editor.lineHighlightBackground
{ highlight: 'selection', tokens: [...] }  // editor.selectionBackground
```

Use one `'line'` and one `'selection'` per language preview.

### Good Preview Checklist

- 18–22 lines total
- Includes: imports, a type / struct, at least one function, a comment
- Has `highlight: 'line'` on a comment or declaration line
- Has `highlight: 'selection'` on an interesting expression
- Covers most common scopes so all color panels show meaningful values

---

## Adding a New Editor Export

> VS Code / Cursor is the only fully active export today. Vim, JetBrains, Sublime Text, and Zed are listed as "coming soon" in the Editors modal.

To add a new editor (e.g. Vim), you need two things:

1. A **preview component** — React component that mimics the editor's UI
2. An **export function** — converts `SharedTheme` into the editor's native format

### Step 1 — Create the editor directory

```
packages/frontend/src/editors/<editor-id>/
  chrome.tsx    ← React preview component
  export.ts     ← export function
```

### Step 2 — Build the preview component (`chrome.tsx`)

```tsx
'use client';

import { useThemeStore } from '@/store/theme.store';

export function VimChrome() {
  const colors = useThemeStore(s => s.theme.colors);

  const bg = colors['editor.background'] ?? '#1c1c1c';
  const fg = colors['editor.foreground'] ?? '#d4d4d4';

  return (
    <div style={{ background: bg, color: fg, fontFamily: 'monospace', padding: 16 }}>
      {/* Realistic Vim-like UI */}
    </div>
  );
}
```

### Step 3 — Build the export function (`export.ts`)

```ts
import type { SharedTheme } from '@themeforge/shared';

export async function buildVimExport(theme: SharedTheme): Promise<Blob> {
  const lines: string[] = [];

  lines.push(`" ${theme.name} — generated by ThemeForge`);
  lines.push(`set background=${theme.type}`);
  lines.push('highlight clear');
  lines.push('');

  const bg = theme.colors['editor.background'] ?? '#1c1c1c';
  const fg = theme.colors['editor.foreground'] ?? '#d4d4d4';
  lines.push(`highlight Normal guifg=${fg} guibg=${bg}`);

  for (const token of theme.tokenColors) {
    const color = token.settings.foreground;
    if (!color) continue;
    // map TextMate scopes to Vim highlight groups...
  }

  return new Blob([lines.join('\n')], { type: 'text/plain' });
}
```

### Step 4 — Enable in `EditorsModal`

Open `packages/frontend/src/components/modals/EditorsModal.tsx` and update the `EDITORS` array:

```ts
{
  id: 'vim',
  label: 'Vim / Neovim',
  description: 'Export as .vim colorscheme file.',
  available: true,       // ← change from false
  exportFormat: '.vim',
},
```

### Step 5 — Wire the export in `ExportModal`

Open `packages/frontend/src/components/modals/ExportModal.tsx` and add a config entry to `EDITOR_EXPORT_CONFIG`:

```ts
const EDITOR_EXPORT_CONFIG = {
  vscode: { ... },
  vim: {
    buttons: [{ label: 'Vim / Neovim' }],
    format: '.vim',
    note: 'Exports as a Vim colorscheme file.',
  },
};
```

Then wire the button's `onClick` to call your `buildVimExport` and trigger a browser file download.

---

## Project Structure

```
packages/
  shared/src/
    types/theme.types.ts         ← SharedTheme, TokenColor, VSCodeThemeExport
    algorithms/wcag.ts           ← WCAG 2.1 contrast math
    algorithms/harmony.ts        ← color harmony scoring
    algorithms/readability.ts    ← readability score (7 pairs)

  backend/src/
    modules/themes/              ← POST /share, GET /:id, GET /gallery
    config/database.ts           ← Turso / libSQL client + schema init
    config/environment.ts        ← zod-validated env vars
    middleware/rate-limit.ts     ← share (5/hr) + gallery (30/min) limiters

  frontend/src/
    app/
      editor/                    ← main editor page
      theme/[id]/                ← view-only shared theme
      gallery/                   ← public theme browser
      legal/                     ← terms + privacy

    data/languages/              ← ADD LANGUAGES HERE
      types.ts                   ← LanguageDefinition, LanguageLine, LanguageToken
      index.ts                   ← LANGUAGES registry
      language-typescript.ts
      language-python.ts

    editors/                     ← ADD EDITOR EXPORTS HERE

    store/
      theme.store.ts             ← SharedTheme state, undo/redo history, analysis
      ui.store.ts                ← panels, modals, active editor / language / tabs

    lib/
      vsix-builder.ts            ← .vsix export (VS Code / Cursor)
      theme-importer.ts          ← import .vsix or theme.json
      default-themes.ts          ← defaultDark and defaultLight palettes

    components/
      preview/VSCodeChrome.tsx   ← VS Code UI mockup
      preview/TokenizedCode.tsx  ← syntax renderer
      modals/EditorsModal.tsx    ← editor chooser
      modals/ExportModal.tsx     ← export dialog
      modals/ShareModal.tsx      ← share + gallery toggle
      panels/                    ← right-side property panels (UI, Syntax, Semantic, Terminal, Score, History)
      editor/Toolbar.tsx         ← top toolbar (name, type, undo/redo, import, export, share)
      editor/EditorLayout.tsx    ← 3-panel layout + keyboard shortcuts
```

---

## Submitting a PR

1. Fork the repo
2. Create a branch: `feat/language-rust` or `feat/editor-vim`
3. Follow the steps above
4. Open a PR — include a screenshot of the preview and a sample exported file

For large changes, open an issue first to discuss the approach.
