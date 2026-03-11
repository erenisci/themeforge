'use client';

import { useUIStore, type ActivePanel } from '@/store/ui.store';

const ITEMS: { panel: ActivePanel; label: string; icon: string }[] = [
  {
    panel: 'editor',
    label: 'Editor',
    icon: 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
  },
  {
    panel: 'syntax',
    label: 'Syntax',
    icon: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5',
  },
  {
    panel: 'semantic',
    label: 'Semantic',
    icon: 'M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L9.568 3z M6 6h.008v.008H6V6z',
  },
  {
    panel: 'ui',
    label: 'UI',
    icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
  },
  {
    panel: 'terminal',
    label: 'Terminal',
    icon: 'M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z',
  },
  {
    panel: 'analysis',
    label: 'Analysis',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
  },
  {
    panel: 'history',
    label: 'History',
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

export function Sidebar() {
  const { activePanel, setActivePanel, sidebarCollapsed, toggleSidebar, openEditorsModal } = useUIStore();

  return (
    <div
      className="flex flex-col py-3 gap-1 border-r border-border bg-surface-1 flex-shrink-0 transition-all duration-200"
      style={{ width: sidebarCollapsed ? 48 : 160 }}
    >
      {/* Nav items */}
      <div className="flex flex-col gap-1 flex-1">
        {ITEMS.map(({ panel, label, icon }) => {
          const isActive = activePanel === panel;
          return (
            <button
              key={panel}
              onClick={() => setActivePanel(panel)}
              title={sidebarCollapsed ? label : undefined}
              className={`relative flex items-center gap-3 rounded-md mx-1 transition-colors group ${
                sidebarCollapsed ? 'w-10 h-10 justify-center' : 'h-9 px-3'
              } ${
                isActive
                  ? 'bg-surface-3 text-text-primary'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface-2'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-accent" />
              )}
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
              </svg>
              {!sidebarCollapsed && (
                <span className="text-xs font-medium truncate">{label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom section: Editors + collapse */}
      <div className="border-t border-border pt-1 mt-1 flex flex-col gap-1">
        <button
          onClick={openEditorsModal}
          title={sidebarCollapsed ? 'Editors' : undefined}
          className={`relative flex items-center gap-3 rounded-md mx-1 transition-colors text-text-muted hover:text-text-secondary hover:bg-surface-2 ${
            sidebarCollapsed ? 'w-10 h-10 justify-center' : 'h-9 px-3'
          }`}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 15V5.25m19.5 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 7.409a2.25 2.25 0 01-1.07-1.916V5.25" />
          </svg>
          {!sidebarCollapsed && (
            <span className="text-xs font-medium truncate">Editors</span>
          )}
        </button>

        <button
          onClick={toggleSidebar}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="mx-1 flex items-center justify-center w-10 h-8 rounded-md text-text-muted hover:text-text-secondary hover:bg-surface-2 transition-colors self-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d={sidebarCollapsed
                ? 'M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
                : 'M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18'
              }
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
