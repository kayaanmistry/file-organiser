import { useState } from "react";

import { listFiles, selectFolder, type Entry } from "@/api/files";

export const MAX_VISIBLE = 2;

// types
export type PaneState = {
  id: string;
  path: string | null;
  entries: Entry[];
};

export type GroupState = {
  id: string;
  panes: PaneState[];
  activeId: string;
  visible?: boolean;
};

export type GroupActions = {
  close: () => void;
  minimise: () => void;
  selectPane: (paneId: string) => void;
  addPane: () => void;
  removePane: (paneId: string) => void;
  openFolder: (paneId: string, path: string) => void;
};

// create
const createPane = (
  path: string | null = null,
  entries: Entry[] = [],
): PaneState => ({ id: crypto.randomUUID(), path, entries });

const createGroup = (visible = true): GroupState => {
  const pane = createPane();
  return {
    id: crypto.randomUUID(),
    panes: [pane],
    activeId: pane.id,
    visible,
  };
};

export const useGroups = () => {
  const [groups, setGroups] = useState(() => [createGroup()]);

  const updateGroup = (id: string, fn: (group: GroupState) => GroupState) =>
    setGroups((current) => current.map((g) => (g.id === id ? fn(g) : g)));

  // groups
  const visibleCount = groups.filter((g) => g.visible).length;

  const canToggle = (group: GroupState) =>
    group.visible ? visibleCount > 1 : visibleCount < MAX_VISIBLE;

  const toggleGroup = (id: string) => {
    const group = groups.find((g) => g.id === id)!;
    if (!canToggle(group)) return;

    updateGroup(id, (g) => ({ ...g, visible: !g.visible }));
  };

  const addGroup = () =>
    setGroups((current) => {
      const room = current.filter((g) => g.visible).length < MAX_VISIBLE;
      return [...current, createGroup(room)];
    });

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

  // Group actions
  const actionsFor = (groupId: string): GroupActions => ({
    close: () => removeGroup(groupId),
    minimise: () => toggleGroup(groupId),
    selectPane: (paneId) => selectPane(groupId, paneId),
    addPane: () => addPane(groupId),
    removePane: (paneId) => removePane(groupId, paneId),
    openFolder: (paneId, path) => openFolder(groupId, paneId, path),
  });

  return {
    list: groups,
    canClose: groups.length > 1,
    canToggle,
    addGroup,
    toggleGroup,
    reload,
    actionsFor,
  };
};

export type UseGroupsReturn = ReturnType<typeof useGroups>;
