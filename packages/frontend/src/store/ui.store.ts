'use client';

import { create } from 'zustand';

export type ActivePanel = 'editor' | 'syntax' | 'ui' | 'terminal' | 'analysis' | 'semantic';
export type ActiveLanguage = 'typescript' | 'python';

interface UIState {
  activePanel: ActivePanel;
  activeLanguage: ActiveLanguage | null;
  openTabs: string[];
  shareModalOpen: boolean;
  exportModalOpen: boolean;
  editorsModalOpen: boolean;
  sidebarCollapsed: boolean;
  focusedColorKey: string | null;
  hoveredColorKey: string | null;

  setActivePanel: (panel: ActivePanel) => void;
  setActiveLanguage: (lang: ActiveLanguage | null) => void;
  addTab: (langId: string) => void;
  removeTab: (langId: string) => void;
  reorderTabs: (tabs: string[]) => void;
  openShareModal: () => void;
  closeShareModal: () => void;
  openExportModal: () => void;
  closeExportModal: () => void;
  openEditorsModal: () => void;
  closeEditorsModal: () => void;
  toggleSidebar: () => void;
  setFocusedColorKey: (key: string | null) => void;
  setHoveredColorKey: (key: string | null) => void;
}

export const useUIStore = create<UIState>(set => ({
  activePanel: 'editor',
  activeLanguage: 'typescript',
  openTabs: ['typescript'],
  shareModalOpen: false,
  exportModalOpen: false,
  editorsModalOpen: false,
  sidebarCollapsed: false,
  focusedColorKey: null,
  hoveredColorKey: null,

  setActivePanel: panel => set({ activePanel: panel }),
  setActiveLanguage: lang => set({ activeLanguage: lang }),
  addTab: langId =>
    set(s => {
      if (s.openTabs.includes(langId)) return { activeLanguage: langId as ActiveLanguage };
      return { openTabs: [...s.openTabs, langId], activeLanguage: langId as ActiveLanguage };
    }),
  removeTab: langId =>
    set(s => {
      const newTabs = s.openTabs.filter(t => t !== langId);
      const newActive =
        newTabs.length === 0
          ? null
          : s.activeLanguage === langId
            ? (newTabs[Math.max(0, s.openTabs.indexOf(langId) - 1)] as ActiveLanguage)
            : s.activeLanguage;
      return { openTabs: newTabs, activeLanguage: newActive };
    }),
  openShareModal: () => set({ shareModalOpen: true }),
  closeShareModal: () => set({ shareModalOpen: false }),
  openExportModal: () => set({ exportModalOpen: true }),
  closeExportModal: () => set({ exportModalOpen: false }),
  openEditorsModal: () => set({ editorsModalOpen: true }),
  closeEditorsModal: () => set({ editorsModalOpen: false }),
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  reorderTabs: tabs => set({ openTabs: tabs }),
  setFocusedColorKey: key => set({ focusedColorKey: key }),
  setHoveredColorKey: key => set({ hoveredColorKey: key }),
}));
