import type { Entry } from "@/api/files";
import type { PaneState } from "@/components/Pane/Pane";

import { isInside } from "./path";

// true if the selected files can be moved into the pane's folder
export const canMoveTo = (selected: Entry[], pane: PaneState) => {
  // no folder open in this pane
  if (!pane.path) return false;

  // nothing to move
  if (selected.length === 0) return false;

  const existingPaths = new Set(pane.entries.map((e) => e.path));
  const existingNames = new Set(pane.entries.map((e) => e.name.toLowerCase()));
  const seen = new Set<string>();

  for (const entry of selected) {
    const name = entry.name.toLowerCase();

    // file is already in this folder
    if (existingPaths.has(entry.path)) return false;

    // folder would be moved into itself or one of its subfolders
    if (entry.is_dir && isInside(pane.path, entry.path)) return false;

    // a different file with the same name already exists here
    if (existingNames.has(name)) return false;

    // two selected files share a name and would collide
    if (seen.has(name)) return false;

    seen.add(name);
  }

  return true;
};
