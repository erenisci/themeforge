// Core Theme Types for VS Code Theme Studio

export type ThemeType = 'dark' | 'light' | 'highContrast';

export type FontStyle = 'bold' | 'italic' | 'underline' | 'strikethrough';

export interface FontSettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing?: number;
}

export interface TokenColor {
  name: string;
  scope: string | string[];
  settings: {
    foreground?: string;
    background?: string;
    fontStyle?: FontStyle | string;
  };
}

export interface UIColors {
  background: string;
  foreground: string;
  accent: string;
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  shadow: string;
}

export interface Theme {
  id: string;
  userId: string;
  name: string;
  displayName: string;
  description?: string;
  themeType: ThemeType;
  isPublic: boolean;
  isPublished: boolean;

  // VS Code color keys
  colors: Record<string, string>;

  // Syntax highlighting
  tokenColors: TokenColor[];

  // UI-specific colors
  uiColors: UIColors;

  // Font configuration
  fontSettings?: FontSettings;

  // Metadata
  tags: string[];
  downloadsCount: number;
  likesCount: number;
  version: string;
  parentThemeId?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ThemeVersion {
  id: string;
  themeId: string;
  version: string;
  colors: Record<string, string>;
  tokenColors: TokenColor[];
  uiColors: UIColors;
  fontSettings?: FontSettings;
  changeDescription?: string;
  createdAt: string;
}

// DTOs
export interface CreateThemeDTO {
  name: string;
  displayName: string;
  description?: string;
  themeType: ThemeType;
  colors: Record<string, string>;
  tokenColors: TokenColor[];
  uiColors: UIColors;
  fontSettings?: FontSettings;
  tags?: string[];
}

export interface UpdateThemeDTO {
  displayName?: string;
  description?: string;
  themeType?: ThemeType;
  colors?: Record<string, string>;
  tokenColors?: TokenColor[];
  uiColors?: UIColors;
  fontSettings?: FontSettings;
  tags?: string[];
  isPublic?: boolean;
  isPublished?: boolean;
}

// AI Feedback Types
export interface AIFeedback {
  overall: {
    score: number; // 0-1
    summary: string;
  };
  contrast: {
    issues: ContrastIssue[];
    score: number;
  };
  harmony: {
    assessment: string;
    suggestions: string[];
    score: number;
  };
  readability: {
    issues: ReadabilityIssue[];
    score: number;
  };
  suggestions: ThemeSuggestion[];
}

export interface ContrastIssue {
  colorPair: [string, string];
  contrastRatio: number;
  wcagLevel: 'AA' | 'AAA' | 'fail';
  location: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ReadabilityIssue {
  scope: string;
  issue: string;
  severity: 'low' | 'medium' | 'high';
  suggestion?: string;
}

export interface ThemeSuggestion {
  type: 'color' | 'font' | 'contrast' | 'harmony';
  target: string;
  current: string;
  suggested: string;
  reason: string;
}

// VS Code Extension Types
export interface VSCodeThemeExport {
  name: string;
  type: 'dark' | 'light' | 'hc';
  colors: Record<string, string>;
  tokenColors: TokenColor[];
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
      uiTheme: 'vs-dark' | 'vs' | 'hc-black';
      path: string;
    }>;
  };
}
