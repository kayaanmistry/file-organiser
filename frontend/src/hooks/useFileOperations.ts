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
  const apply = async (operation: Promise<void>, touched: Entry[]) => {
    try {
      await operation;
    } finally {
      selection.remove(touched);
      await groups.reload();
      await history.refresh();
    }
  };

  const move = (entries: Entry[], destination: string) =>
    apply(
      moveFiles(
        entries.map((e) => e.path),
        destination,
      ),
      entries,
    );

  const remove = (entries: Entry[]) =>
    apply(deleteFiles(entries.map((e) => e.path)), entries);

  const newFolder = (target: PaneState, name: string) => {
    if (!target.path) return;
    apply(createFolder(target.path, name), []);
  };

  const rename = (entry: Entry, name: string) =>
    apply(renameFile(entry.path, name), [entry]);

  return { move, remove, newFolder, rename };
};

export type UseFileOperationsReturn = ReturnType<typeof useFileOperations>;
