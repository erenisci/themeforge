// Common VS Code Color Keys

export const VSCODE_UI_COLOR_KEYS = [
  // Editor
  'editor.background',
  'editor.foreground',
  'editor.lineHighlightBackground',
  'editor.selectionBackground',
  'editor.selectionHighlightBackground',
  'editor.wordHighlightBackground',
  'editor.findMatchBackground',
  'editor.findMatchHighlightBackground',
  'editor.hoverHighlightBackground',

  // Editor Widget
  'editorWidget.background',
  'editorWidget.border',
  'editorWidget.foreground',

  // Sidebar
  'sideBar.background',
  'sideBar.foreground',
  'sideBar.border',
  'sideBarTitle.foreground',
  'sideBarSectionHeader.background',
  'sideBarSectionHeader.foreground',

  // Activity Bar
  'activityBar.background',
  'activityBar.foreground',
  'activityBar.inactiveForeground',
  'activityBar.border',
  'activityBarBadge.background',
  'activityBarBadge.foreground',

  // Status Bar
  'statusBar.background',
  'statusBar.foreground',
  'statusBar.border',
  'statusBar.noFolderBackground',
  'statusBar.debuggingBackground',

  // Title Bar
  'titleBar.activeBackground',
  'titleBar.activeForeground',
  'titleBar.inactiveBackground',
  'titleBar.inactiveForeground',
  'titleBar.border',

  // Terminal
  'terminal.background',
  'terminal.foreground',
  'terminal.ansiBlack',
  'terminal.ansiRed',
  'terminal.ansiGreen',
  'terminal.ansiYellow',
  'terminal.ansiBlue',
  'terminal.ansiMagenta',
  'terminal.ansiCyan',
  'terminal.ansiWhite',

  // Panel
  'panel.background',
  'panel.border',
  'panelTitle.activeBorder',
  'panelTitle.activeForeground',
  'panelTitle.inactiveForeground',

  // Buttons
  'button.background',
  'button.foreground',
  'button.hoverBackground',

  // Input
  'input.background',
  'input.border',
  'input.foreground',
  'input.placeholderForeground',

  // Dropdown
  'dropdown.background',
  'dropdown.border',
  'dropdown.foreground',

  // Lists
  'list.activeSelectionBackground',
  'list.activeSelectionForeground',
  'list.hoverBackground',
  'list.inactiveSelectionBackground',

  // Notifications
  'notificationCenter.border',
  'notificationToast.border',
  'notifications.background',
  'notifications.border',
  'notifications.foreground',
] as const;

export type VSCodeUIColorKey = (typeof VSCODE_UI_COLOR_KEYS)[number];

// Default color suggestions
export const DEFAULT_DARK_COLORS: Record<string, string> = {
  'editor.background': '#1e1e1e',
  'editor.foreground': '#d4d4d4',
  'sideBar.background': '#252526',
  'activityBar.background': '#333333',
  'statusBar.background': '#007acc',
};

export const DEFAULT_LIGHT_COLORS: Record<string, string> = {
  'editor.background': '#ffffff',
  'editor.foreground': '#000000',
  'sideBar.background': '#f3f3f3',
  'activityBar.background': '#2c2c2c',
  'statusBar.background': '#007acc',
};
