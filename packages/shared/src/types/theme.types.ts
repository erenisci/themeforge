// Core Theme Types for ThemeForge

export type ThemeType = 'dark' | 'light';

export type FontStyle = 'bold' | 'italic' | 'underline' | 'strikethrough';

export interface TokenColor {
  name: string;
  scope: string | string[];
  settings: {
    foreground?: string;
    background?: string;
    fontStyle?: FontStyle | string;
  };
}

export interface EditorSettings {
  fontSize?: number; // 12-20, default 13
  fontFamily?: string; // 'Consolas', 'Fira Code', etc.
  lineHeight?: number; // 1.2-2.0, default 1.6
  terminalFontSize?: number;
}

// The core theme structure used throughout the app
export interface SharedTheme {
  name: string;
  type: ThemeType;
  // VS Code UI color keys (editor.background, etc.)
  colors: Record<string, string>;
  // Syntax highlighting token rules
  tokenColors: TokenColor[];
  // Semantic token colors (TypeScript, etc.)
  semanticTokenColors?: Record<string, string>;
  // Editor display settings (preview only, not part of .vsix color theme)
  editorSettings?: EditorSettings;
}

// Analysis result types (computed by static algorithms)
export interface ContrastResult {
  name: string;
  foreground: string;
  background: string;
  ratio: number;
  wcagLevel: 'AAA' | 'AA' | 'fail';
}

export interface HarmonyResult {
  type: 'complementary' | 'analogous' | 'triadic' | 'split-complementary' | 'mixed';
  score: number; // 0-100
}

export interface ThemeAnalysis {
  contrastResults: ContrastResult[];
  harmonyResult: HarmonyResult;
  readabilityScore: number; // 0-100
  overallWcagLevel: 'AAA' | 'AA' | 'fail';
}

// VS Code Extension Export Types
export interface VSCodeThemeExport {
  name: string;
  type: 'dark' | 'light';
  colors: Record<string, string>;
  tokenColors: TokenColor[];
  semanticTokenColors?: Record<string, string>;
}

export interface VSCodePackageJSON {
  name: string;
  displayName: string;
  description: string;
  version: string;
  publisher: string;
  engines: {
    vscode: string;
  };
  categories: string[];
  contributes: {
    themes: Array<{
      label: string;
      uiTheme: 'vs-dark' | 'vs';
      path: string;
    }>;
  };
}
