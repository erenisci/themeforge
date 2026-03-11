'use client';

import { EditorColorsPanel } from '@/components/panels/EditorColorsPanel';
import { ScorePanel } from '@/components/panels/ScorePanel';
import { SemanticPanel } from '@/components/panels/SemanticPanel';
import { SyntaxPanel } from '@/components/panels/SyntaxPanel';
import { TerminalPanel } from '@/components/panels/TerminalPanel';
import { UIColorsPanel } from '@/components/panels/UIColorsPanel';
import { useUIStore } from '@/store/ui.store';

export function PropertiesPanel() {
  const activePanel = useUIStore(s => s.activePanel);

  return (
    <div className='w-72 border-l border-border bg-surface-1 overflow-y-auto flex-shrink-0'>
      {activePanel === 'editor' && <EditorColorsPanel />}
      {activePanel === 'syntax' && <SyntaxPanel />}
      {activePanel === 'semantic' && <SemanticPanel />}
      {activePanel === 'ui' && <UIColorsPanel />}
      {activePanel === 'terminal' && <TerminalPanel />}
      {activePanel === 'analysis' && <ScorePanel />}
    </div>
  );
}
