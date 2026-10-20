import { useState } from "react";

import type { Entry } from "@/api/files";

import type { Naming } from "@/components/Name/Name";

import type { PaneState } from "@/hooks/useGroups";

import { uniqueName } from "@/utils/path";

const DRAFT_PATH = "draft";

const createDraft = (parent: string, name: string): Entry => ({
  path: DRAFT_PATH,
  name,
  parent,
  is_dir: true,
  ext: "",
  size: 0,
  modified: Date.now() / 1000,
});

export const useNaming = (
  pane: PaneState,
  onNewFolder: (name: string) => void,
  onRename: (entry: Entry, name: string) => void,
) => {
  const [editing, setEditing] = useState<Entry | null>(null);

  const isDraft = editing?.path === DRAFT_PATH;
  const entries = isDraft ? [editing, ...pane.entries] : pane.entries;

  const taken = pane.entries
    .filter((e) => e.path !== editing?.path)
    .map((e) => e.name);

  const startNewFolder = () =>
    setEditing(createDraft(pane.path!, uniqueName("New folder", taken)));

  const naming: Naming = {
    editingPath: editing?.path ?? null,
    taken,
    onEdit: setEditing,
    onSubmit: (entry, name) => {
      setEditing(null);
      if (entry.path === DRAFT_PATH) onNewFolder(name);
      else if (name !== entry.name) onRename(entry, name);
    },
    onCancel: () => setEditing(null),
  };

  return { ...naming, entries, isEditing: !!editing, startNewFolder };
};

export type UseNamingReturn = ReturnType<typeof useNaming>;
