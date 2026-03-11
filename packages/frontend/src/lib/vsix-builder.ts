import type { SharedTheme, VSCodePackageJSON, VSCodeThemeExport } from '@themeforge/shared';
import JSZip from 'jszip';

export async function buildVSIX(theme: SharedTheme): Promise<Blob> {
  const zip = new JSZip();
  const slug = theme.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const packageJson: VSCodePackageJSON = {
    name: slug || 'my-theme',
    displayName: theme.name,
    description: `${theme.name} - created with ThemeForge`,
    version: '1.0.0',
    publisher: 'themeforge-user',
    engines: { vscode: '^1.60.0' },
    categories: ['Themes'],
    contributes: {
      themes: [
        {
          label: theme.name,
          uiTheme: theme.type === 'dark' ? 'vs-dark' : 'vs',
          path: './themes/theme.json',
        },
      ],
    },
  };

  const themeJson: VSCodeThemeExport = {
    name: theme.name,
    type: theme.type,
    colors: theme.colors,
    tokenColors: theme.tokenColors,
  };

  zip.file('extension/package.json', JSON.stringify(packageJson, null, 2));
  zip.file('extension/themes/theme.json', JSON.stringify(themeJson, null, 2));
  zip.file(
    'extension/README.md',
    `# ${theme.name}\n\nCreated with [ThemeForge](https://github.com/themeforge/themeforge).\n`,
  );

  return zip.generateAsync({ type: 'blob' });
}
