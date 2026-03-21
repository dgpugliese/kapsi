'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Shared context so TabButtons and TabPanels can live in separate     */
/* DOM slots while sharing the active-tab state.                       */
/* ------------------------------------------------------------------ */

interface TabCtx {
  active: string;
  setActive: (id: string) => void;
}

const TabContext = createContext<TabCtx>({ active: '', setActive: () => {} });

interface Tab {
  id: string;
  label: string;
}

/* ------------------------------------------------------------------ */
/* Provider — wrap the entire page (or PortalShell render) with this  */
/* ------------------------------------------------------------------ */

export function TabProvider({
  defaultTab,
  children,
}: {
  defaultTab: string;
  children: ReactNode;
}) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabContext.Provider value={{ active, setActive }}>
      {children}
    </TabContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* TabButtons — rendered inside the PortalShell "tabs" prop           */
/* ------------------------------------------------------------------ */

export function TabButtons({ tabs }: { tabs: Tab[] }) {
  const { active, setActive } = useContext(TabContext);
  return (
    <>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`portal-tab${active === tab.id ? ' active' : ''}`}
          onClick={() => setActive(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* TabPanels — rendered inside the PortalShell "children"             */
/* ------------------------------------------------------------------ */

export function TabPanels({ children }: { children: Record<string, ReactNode> }) {
  const { active } = useContext(TabContext);
  return (
    <>
      {Object.entries(children).map(([id, content]) => (
        <div
          key={id}
          className={`portal-tab-content${active === id ? ' active' : ''}`}
          id={`tab-${id}`}
          style={{ display: active === id ? 'block' : 'none', padding: '32px' }}
        >
          {content}
        </div>
      ))}
    </>
  );
}
