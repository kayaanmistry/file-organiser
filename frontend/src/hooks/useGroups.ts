import { useState } from "react";

import { listFiles, selectFolder, type Entry } from "@/api/files";

export type PaneState = {
  id: string;
  path: string | null;
  entries: Entry[];
};

export type GroupState = {
  id: string;
  panes: PaneState[];
  activeId: string;
};

export type GroupActions = {
  close: () => void;
  selectPane: (paneId: string) => void;
  addPane: () => void;
  removePane: (paneId: string) => void;
  openFolder: (paneId: string, path: string) => void;
};

const createPane = (
  path: string | null = null,
  entries: Entry[] = [],
): PaneState => ({ id: crypto.randomUUID(), path, entries });

const createGroup = (): GroupState => {
  const pane = createPane();
  return { id: crypto.randomUUID(), panes: [pane], activeId: pane.id };
};

export const useGroups = () => {
  const [groups, setGroups] = useState(() => [createGroup()]);

  const updateGroup = (id: string, fn: (group: GroupState) => GroupState) =>
    setGroups((current) => current.map((g) => (g.id === id ? fn(g) : g)));

  // groups

  const addGroup = () => setGroups((current) => [...current, createGroup()]);

  const removeGroup = (id: string) =>
    setGroups((current) =>
      current.length === 1 ? current : current.filter((g) => g.id !== id),
    );

  // panes

  const openFolder = async (groupId: string, paneId: string, path: string) => {
    const entries = await listFiles(path);
    updateGroup(groupId, (g) => ({
      ...g,
      panes: g.panes.map((p) =>
        p.id === paneId ? { ...p, path, entries } : p,
      ),
    }));
  };

  const addPane = async (groupId: string) => {
    const path = await selectFolder();
    if (!path) return;

    const pane = createPane(path, await listFiles(path));
    updateGroup(groupId, (g) => ({
      ...g,
      panes: [...g.panes, pane],
      activeId: pane.id,
    }));
  };

  const removePane = (groupId: string, paneId: string) =>
    updateGroup(groupId, (g) => {
      if (g.panes.length === 1) return g;

      const index = g.panes.findIndex((p) => p.id === paneId);
      const panes = g.panes.filter((p) => p.id !== paneId);
      const activeId =
        g.activeId === paneId ? panes[Math.max(0, index - 1)].id : g.activeId;

      return { ...g, panes, activeId };
    });

  const selectPane = (groupId: string, paneId: string) =>
    updateGroup(groupId, (g) => ({ ...g, activeId: paneId }));

  const reload = () =>
    Promise.all(
      groups.flatMap((g) =>
        g.panes
          .filter((p) => p.path)
          .map((p) => openFolder(g.id, p.id, p.path!)),
      ),
    );

  // binds every pane action to one group
  const actionsFor = (groupId: string): GroupActions => ({
    close: () => removeGroup(groupId),
    selectPane: (paneId) => selectPane(groupId, paneId),
    addPane: () => addPane(groupId),
    removePane: (paneId) => removePane(groupId, paneId),
    openFolder: (paneId, path) => openFolder(groupId, paneId, path),
  });

  return {
    groups,
    canClose: groups.length > 1,
    addGroup,
    reload,
    actionsFor,
  };
};
