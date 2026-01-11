// Extension System Types

import { TokenColor } from './theme.types';

export type ExtensionType = 'language' | 'filetype' | 'theme-preset' | 'analyzer';

export interface LanguageExtension {
  id: string;
  authorId: string;
  name: string;
  displayName: string;
  description?: string;
  version: string;
  extensionType: ExtensionType;

  // Language-specific
  fileExtensions: string[]; // e.g., ['.ts', '.tsx']
  languageId: string; // e.g., 'typescript'
  grammarUrl?: string; // TextMate grammar URL

  // Default token colors for this language
  defaultTokenColors: TokenColor[];

  // Example code for preview
  exampleCode: string;

  // Metadata
  isApproved: boolean;
  isActive: boolean;
  downloadsCount: number;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface CreateExtensionDTO {
  name: string;
  displayName: string;
  description?: string;
  version: string;
  extensionType: ExtensionType;
  fileExtensions: string[];
  languageId: string;
  grammarUrl?: string;
  defaultTokenColors: TokenColor[];
  exampleCode: string;
}

export interface UpdateExtensionDTO {
  displayName?: string;
  description?: string;
  version?: string;
  defaultTokenColors?: TokenColor[];
  exampleCode?: string;
  isActive?: boolean;
}

// Extension Registry Entry
export interface ExtensionRegistryEntry {
  id: string;
  name: string;
  displayName: string;
  fileExtensions: string[];
  languageId: string;
  grammarUrl?: string;
  defaultTokenColors: TokenColor[];
  exampleCode: string;
}
