import type { SharedTheme, TokenColor } from '@themeforge/shared';
import JSZip from 'jszip';

function parseVSCodeThemeJson(json: Record<string, any>): SharedTheme {
  const tokenColors: TokenColor[] = (json.tokenColors ?? []).map((t: any) => ({
    name: t.name ?? '',
    scope: t.scope ?? '',
    settings: {
      foreground: t.settings?.foreground,
      background: t.settings?.background,
      fontStyle: t.settings?.fontStyle,
    },
  }));

  return {
    name: json.name ?? 'Imported Theme',
    type: json.type === 'light' ? 'light' : 'dark',
    colors: json.colors ?? {},
    tokenColors,
    semanticTokenColors: json.semanticTokenColors,
  };
}

export async function importTheme(file: File): Promise<SharedTheme> {
  const name = file.name.toLowerCase();

  if (name.endsWith('.json')) {
    const text = await file.text();
    const json = JSON.parse(text);
    return parseVSCodeThemeJson(json);
  }

  if (name.endsWith('.vsix')) {
    const buf = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);

    // Find theme JSON inside extension/themes/
    const themeFile = Object.values(zip.files).find(
      f => f.name.match(/^extension\/themes\/.+\.json$/i) && !f.dir,
    );

    if (!themeFile) {
      throw new Error('No theme JSON found inside .vsix file');
    }

    const text = await themeFile.async('text');
    const json = JSON.parse(text);
    return parseVSCodeThemeJson(json);
  }

  throw new Error('Unsupported file type. Please use .json or .vsix');
}
