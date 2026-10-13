import { moveFiles } from "@/api/files";

import { type PaneState } from "@/components/Pane/Pane";
import { PaneGroup } from "@/components/Pane/PaneGroup/PaneGroup";
import { SelectedFiles } from "@/components/SelectedFiles/SelectedFiles";

import { usePanes } from "@/hooks/usePanes";
import { useSelection } from "@/hooks/useSelection";

import styles from "./Workspace.module.css";

export const Workspace = () => {
  const groups = [usePanes(), usePanes()];
  const selection = useSelection();

  const moveHere = async (target: PaneState) => {
    if (!target.path) return;

    await moveFiles(
      selection.entries.map((e) => e.path),
      target.path,
    );

    selection.clear();
    await Promise.all(groups.map((group) => group.reload()));
  };

  return (
    <div className={styles.workspace}>
      <div className={styles.paneGroups}>
        {groups.map((group, i) => (
          <PaneGroup
            key={i}
            group={group}
            selected={selection.entries}
            onToggle={selection.toggle}
            onMoveHere={moveHere}
          />
        ))}
      </div>
      <SelectedFiles selected={selection.entries} onRemove={selection.toggle} />
    </div>
  );
};
