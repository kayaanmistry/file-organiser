import { useState } from "react";

import { listFiles } from "@/api/files";

import type { PaneState } from "@/components/Pane/Pane";

const createPane = (): PaneState => ({
  id: crypto.randomUUID(),
  path: null,
  entries: [],
});

export const usePanes = () => {
  const [initial] = useState(createPane);
  const [panes, setPanes] = useState([initial]);
  const [activeId, setActiveId] = useState(initial.id);

  // returns activce pane
  const active = panes.find((pane) => pane.id === activeId)!;

  const open = async (id: string, path: string) => {
    const entries = await listFiles(path);
    setPanes((current) =>
      current.map((pane) =>
        pane.id === id ? { ...pane, path, entries } : pane,
      ),
    );
  };

  const reload = () =>
    Promise.all(
      panes
        .filter((pane) => pane.path)
        .map((pane) => open(pane.id, pane.path!)),
    );

  const add = () => {
    const newPane = createPane();
    setPanes((current) => [...current, newPane]);
    setActiveId(newPane.id);
  };

  const remove = (id: string) => {
    if (panes.length === 1) return;

    const index = panes.findIndex((pane) => pane.id === id);
    const remaining = panes.filter((pane) => pane.id !== id);

    setPanes(remaining);
    if (id === activeId) setActiveId(remaining[Math.max(0, index - 1)].id);
  };

  return { panes, activeId, active, setActiveId, open, reload, add, remove };
};
