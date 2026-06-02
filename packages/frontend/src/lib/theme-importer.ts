import type { SharedTheme, TokenColor } from '@themeforge/shared';
import JSZip from 'jszip';

function parseJSON(text: string): Record<string, any> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('File is not valid JSON.');
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Theme file must contain a JSON object.');
  }
  return parsed as Record<string, any>;
}

function parseVSCodeThemeJson(json: Record<string, any>): SharedTheme {
  if (
    json.colors !== undefined &&
    (typeof json.colors !== 'object' || json.colors === null || Array.isArray(json.colors))
  ) {
    throw new Error('"colors" must be an object mapping keys to hex values.');
  }
  if (json.tokenColors !== undefined && !Array.isArray(json.tokenColors)) {
    throw new Error('"tokenColors" must be an array.');
  }

  // A theme with neither colors nor tokenColors is almost certainly the wrong file.
  const hasColors = json.colors && Object.keys(json.colors).length > 0;
  const hasTokens = Array.isArray(json.tokenColors) && json.tokenColors.length > 0;
  if (!hasColors && !hasTokens) {
    throw new Error('No "colors" or "tokenColors" found — is this a VS Code theme file?');
  }

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
    return parseVSCodeThemeJson(parseJSON(text));
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
    return parseVSCodeThemeJson(parseJSON(text));
  }

  throw new Error('Unsupported file type. Please use .json or .vsix');
}
