'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export interface Picked {
  path: string;
  label: string;
}

interface Pick {
  picked: Picked | null;
  missed: boolean;
  showAll: boolean;
  pick: (picked: Picked | null) => void;
  miss: () => void;
  setShowAll: (showAll: boolean) => void;
}

const PickContext = createContext<Pick | null>(null);

// What was clicked on the page preview, shared by the preview and the form beside it.
export function PickProvider({ children }: { children: ReactNode }) {
  const [picked, setPicked] = useState<Picked | null>(null);
  const [missed, setMissed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const value = useMemo<Pick>(
    () => ({
      picked,
      missed,
      showAll,
      pick: (next) => {
        setPicked(next);
        setMissed(false);
      },
      miss: () => {
        setPicked(null);
        setMissed(true);
      },
      setShowAll,
    }),
    [picked, missed, showAll],
  );

  return <PickContext.Provider value={value}>{children}</PickContext.Provider>;
}

export function usePick(): Pick | null {
  return useContext(PickContext);
}
