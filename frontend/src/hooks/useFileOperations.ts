import { createFolder, moveFiles, renameFile, type Entry } from "@/api/files";

import type { PaneState, UseGroupsReturn } from "@/hooks/useGroups";
import type { UseHistoryReturn } from "@/hooks/useHistory";
import type { UseSelectionReturn } from "@/hooks/useSelection";

export const useFileOperations = (
  groups: UseGroupsReturn,
  selection: UseSelectionReturn,
  history: UseHistoryReturn,
) => {
  const apply = async (operation: Promise<void>) => {
    await operation;
    selection.clear();
    await groups.reload();
    await history.refresh();
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

  const newFolder = (target: PaneState, name: string) => {
    if (!target.path) return;
    apply(createFolder(target.path, name));
  };

  const rename = (entry: Entry, name: string) =>
    apply(renameFile(entry.path, name));

  return { moveHere, newFolder, rename };
};

export type UseFileOperationsReturn = ReturnType<typeof useFileOperations>;
