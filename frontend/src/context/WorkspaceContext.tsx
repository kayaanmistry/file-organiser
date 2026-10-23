import { createContext, useContext } from "react";

import type { UseFileOperationsReturn } from "@/hooks/useFileOperations";
import type { UseGroupsReturn } from "@/hooks/useGroups";
import type { UseHistoryReturn } from "@/hooks/useHistory";
import type { UseSelectionReturn } from "@/hooks/useSelection";

export type WorkspaceContextValue = {
  groups: UseGroupsReturn;
  selection: UseSelectionReturn;
  history: UseHistoryReturn;
  operations: UseFileOperationsReturn;
};

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(
  null,
);

export const useWorkspace = () => useContext(WorkspaceContext)!;
