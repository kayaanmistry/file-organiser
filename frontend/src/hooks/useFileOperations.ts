import type { Entry } from "@/api/files";
import { createFolder, moveFiles, deleteFiles, renameFile } from "@/api/files";

import type { PaneState, UseGroupsReturn } from "@/hooks/useGroups";
import type { UseSelectionReturn } from "@/hooks/useSelection";
import type { UseHistoryReturn } from "./useHistory";

export const useFileOperations = (
  groups: UseGroupsReturn,
  selection: UseSelectionReturn,
  history: UseHistoryReturn,
) => {
  const apply = async (operation: Promise<void>) => {
    try {
      await operation;
    } finally {
      selection.clear();
      await groups.reload();
      await history.refresh();
    }
  };

  const moveHere = (target: PaneState) => {
    if (!target.path) return;
    apply(
      moveFiles(
        selection.entries.map((e) => e.path),
        target.path,
      ),
    );
  };

  const remove = (entries: Entry[]) =>
    apply(deleteFiles(entries.map((e) => e.path)));

  const newFolder = (target: PaneState, name: string) => {
    if (!target.path) return;
    apply(createFolder(target.path, name));
  };

  const rename = (entry: Entry, name: string) =>
    apply(renameFile(entry.path, name));

  return { moveHere, remove, newFolder, rename };
};

export type UseFileOperationsReturn = ReturnType<typeof useFileOperations>;
