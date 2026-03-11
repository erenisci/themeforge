import type { LanguageDefinition } from './types';

export const languageTypeScript: LanguageDefinition = {
  id: 'typescript',
  label: 'TypeScript',
  filename: 'component.tsx',
  statusBarLabel: 'TypeScript JSX',
  breadcrumb: ['src', 'component.tsx', 'Counter'],
  explorer: [
    { name: 'src', isFolder: true, indent: 0 },
    {
      name: 'component.tsx',
      indent: 1,
      active: true,
      breadcrumb: ['src', 'component.tsx', 'Counter'],
      lines: [
        {
          tokens: [
            { text: 'import', scope: 'keyword.control.import' },
            { text: ' { ' },
            { text: 'useState', scope: 'variable' },
            { text: ', ' },
            { text: 'useEffect', scope: 'variable' },
            { text: ' } ' },
            { text: 'from', scope: 'keyword.control.import' },
            { text: " 'react'", scope: 'string' },
          ],
        },
        { tokens: [{ text: '' }] },
        {
          highlight: 'line',
          tokens: [{ text: '// A comment explaining the component', scope: 'comment' }],
        },
        {
          tokens: [
            { text: 'interface', scope: 'keyword' },
            { text: ' ' },
            { text: 'Props', scope: 'entity.name.type' },
            { text: ' {' },
          ],
        },
        {
          tokens: [
            { text: '  ' },
            { text: 'title', scope: 'variable.parameter' },
            { text: ': ' },
            { text: 'string', scope: 'support.type' },
          ],
        },
        {
          tokens: [
            { text: '  ' },
            { text: 'count', scope: 'variable.parameter' },
            { text: ': ' },
            { text: 'number', scope: 'support.type' },
          ],
        },
        { tokens: [{ text: '}' }] },
        { tokens: [{ text: '' }] },
        {
          tokens: [
            { text: 'function', scope: 'keyword' },
            { text: ' ' },
            { text: 'Counter', scope: 'entity.name.function' },
            { text: '({ ' },
            { text: 'title', scope: 'variable.parameter' },
            { text: ', ' },
            { text: 'count', scope: 'variable.parameter' },
            { text: ' }: ' },
            { text: 'Props', scope: 'entity.name.type' },
            { text: ') {' },
          ],
        },
        {
          tokens: [
            { text: '  ' },
            { text: 'const', scope: 'keyword' },
            { text: ' ' },
            { text: 'doubled', scope: 'variable' },
            { text: ' ' },
            { text: '=', scope: 'keyword.operator' },
            { text: ' ' },
            { text: 'count', scope: 'variable' },
            { text: ' ' },
            { text: '*', scope: 'keyword.operator' },
            { text: ' ' },
            { text: '2', scope: 'constant.numeric' },
          ],
        },
        {
          highlight: 'selection',
          tokens: [
            { text: '  ' },
            { text: 'const', scope: 'keyword' },
            { text: ' ' },
            { text: 'label', scope: 'variable' },
            { text: ' ' },
            { text: '=', scope: 'keyword.operator' },
            { text: ' ' },
            { text: '`${title}: ${doubled}`', scope: 'string' },
          ],
        },
        { tokens: [{ text: '' }] },
        {
          tokens: [{ text: '  ' }, { text: 'return', scope: 'keyword.control' }, { text: ' (' }],
        },
        {
          tokens: [
            { text: '    <' },
            { text: 'div', scope: 'entity.name.tag' },
            { text: ' ' },
            { text: 'className', scope: 'variable.parameter' },
            { text: '=', scope: 'keyword.operator' },
            { text: '"container"', scope: 'string' },
            { text: '>' },
          ],
        },
        {
          tokens: [
            { text: '      <' },
            { text: 'h1', scope: 'entity.name.tag' },
            { text: '>{label}</h1>' },
          ],
        },
        { tokens: [{ text: '    </div>' }] },
        { tokens: [{ text: '  )' }] },
        { tokens: [{ text: '}' }] },
      ],
    },
    {
      name: 'index.ts',
      indent: 1,
      breadcrumb: ['src', 'index.ts'],
      lines: [
        {
          tokens: [
            { text: 'export', scope: 'keyword.control.import' },
            { text: ' { ' },
            { text: 'default', scope: 'keyword' },
            { text: ' } ' },
            { text: 'from', scope: 'keyword.control.import' },
            { text: " './component'", scope: 'string' },
          ],
        },
        { tokens: [{ text: '' }] },
        {
          highlight: 'line',
          tokens: [{ text: '// Re-export all types', scope: 'comment' }],
        },
        {
          tokens: [
            { text: 'export', scope: 'keyword.control.import' },
            { text: ' ' },
            { text: 'type', scope: 'keyword' },
            { text: ' { ' },
            { text: 'Props', scope: 'entity.name.type' },
            { text: ' } ' },
            { text: 'from', scope: 'keyword.control.import' },
            { text: " './component'", scope: 'string' },
          ],
        },
        { tokens: [{ text: '' }] },
        {
          highlight: 'selection',
          tokens: [
            { text: 'export', scope: 'keyword.control.import' },
            { text: ' * ' },
            { text: 'from', scope: 'keyword.control.import' },
            { text: " './utils'", scope: 'string' },
          ],
        },
      ],
    },
    {
      name: 'package.json',
      indent: 0,
      breadcrumb: ['package.json'],
      lines: [
        { tokens: [{ text: '{' }] },
        {
          highlight: 'line',
          tokens: [
            { text: '  ' },
            { text: '"name"', scope: 'string' },
            { text: ': ' },
            { text: '"my-app"', scope: 'string' },
            { text: ',' },
          ],
        },
        {
          tokens: [
            { text: '  ' },
            { text: '"version"', scope: 'string' },
            { text: ': ' },
            { text: '"1.0.0"', scope: 'string' },
            { text: ',' },
          ],
        },
        {
          tokens: [{ text: '  ' }, { text: '"dependencies"', scope: 'string' }, { text: ': {' }],
        },
        {
          highlight: 'selection',
          tokens: [
            { text: '    ' },
            { text: '"react"', scope: 'string' },
            { text: ': ' },
            { text: '"^18.0.0"', scope: 'string' },
            { text: ',' },
          ],
        },
        {
          tokens: [
            { text: '    ' },
            { text: '"typescript"', scope: 'string' },
            { text: ': ' },
            { text: '"^5.0.0"', scope: 'string' },
          ],
        },
        { tokens: [{ text: '  }' }] },
        { tokens: [{ text: '}' }] },
      ],
    },
    {
      name: 'tsconfig.json',
      indent: 0,
      breadcrumb: ['tsconfig.json'],
      lines: [
        { tokens: [{ text: '{' }] },
        {
          tokens: [{ text: '  ' }, { text: '"compilerOptions"', scope: 'string' }, { text: ': {' }],
        },
        {
          highlight: 'line',
          tokens: [
            { text: '    ' },
            { text: '"target"', scope: 'string' },
            { text: ': ' },
            { text: '"ES2022"', scope: 'string' },
            { text: ',' },
          ],
        },
        {
          tokens: [
            { text: '    ' },
            { text: '"strict"', scope: 'string' },
            { text: ': ' },
            { text: 'true', scope: 'constant.numeric' },
            { text: ',' },
          ],
        },
        {
          highlight: 'selection',
          tokens: [
            { text: '    ' },
            { text: '"jsx"', scope: 'string' },
            { text: ': ' },
            { text: '"react-jsx"', scope: 'string' },
          ],
        },
        { tokens: [{ text: '  }' }] },
        { tokens: [{ text: '}' }] },
      ],
    },
  ],
  lines: [], // computed from active explorer file
};

// Default lines = component.tsx lines
languageTypeScript.lines = languageTypeScript.explorer.find(f => f.active)?.lines ?? [];
