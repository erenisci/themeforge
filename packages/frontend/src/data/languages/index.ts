export { languagePython } from './language-python';
export { languageTypeScript } from './language-typescript';
export type { ExplorerFile, LanguageDefinition, LanguageLine, LanguageToken } from './types';

import { languagePython } from './language-python';
import { languageTypeScript } from './language-typescript';
import type { LanguageDefinition } from './types';

export const LANGUAGES: Record<string, LanguageDefinition> = {
  typescript: languageTypeScript,
  python: languagePython,
};

export const LANGUAGE_LIST = Object.values(LANGUAGES);
