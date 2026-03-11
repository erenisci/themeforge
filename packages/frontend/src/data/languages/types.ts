export interface LanguageToken {
  text: string;
  scope?: string; // TextMate scope — undefined = editor.foreground
}

export interface LanguageLine {
  tokens: LanguageToken[];
  highlight?: 'line' | 'selection'; // line = lineHighlight bg, selection = selectionBackground bg
}

export interface ExplorerFile {
  name: string;
  indent?: number; // 0 = root, 1 = inside folder
  isFolder?: boolean;
  active?: boolean; // selected by default on language load
  breadcrumb?: string[]; // overrides language breadcrumb when this file is active
  lines?: LanguageLine[]; // overrides language lines when this file is active
}

export interface LanguageDefinition {
  id: string;
  label: string;
  filename: string; // active tab filename
  statusBarLabel: string; // shown in status bar
  breadcrumb: string[]; // e.g. ['src', 'component.tsx', 'Counter']
  explorer: ExplorerFile[];
  lines: LanguageLine[];
}
