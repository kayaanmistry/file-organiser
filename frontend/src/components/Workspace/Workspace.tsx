import { moveFiles } from "@/api/files";

import { type PaneState } from "@/components/Pane/Pane";
import { PaneGroup } from "@/components/Pane/PaneGroup/PaneGroup";
import { SelectedFiles } from "@/components/SelectedFiles/SelectedFiles";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import { TextButton } from "@/components/Buttons/TextButton/TextButton";

import { useHistory } from "@/hooks/useHistory";
import { usePanes } from "@/hooks/usePanes";
import { useSelection } from "@/hooks/useSelection";

import styles from "./Workspace.module.css";

type ActionBarProps = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
};

const ActionBar = ({ canUndo, canRedo, onUndo, onRedo }: ActionBarProps) => (
  <Toolbar>
    <TextButton onClick={onUndo} disabled={!canUndo}>
      undo
    </TextButton>
    <TextButton onClick={onRedo} disabled={!canRedo}>
      redo
    </TextButton>
  </Toolbar>
);

export const Workspace = () => {
  const groups = [usePanes(), usePanes()];
  const selection = useSelection();

  const reloadAll = async () => {
    await Promise.all(groups.map((group) => group.reload()));
  };

  const history = useHistory(async () => {
    selection.clear();
    await reloadAll();
  });

  const moveHere = async (target: PaneState) => {
    if (!target.path) return;

    await moveFiles(
      selection.entries.map((e) => e.path),
      target.path,
    );

    selection.clear();
    await reloadAll();
    await history.refresh();
  };

  return (
    <div className={styles.workspace}>
      <ActionBar
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={history.undo}
        onRedo={history.redo}
      />
      <div className={styles.paneGroups}>
        {groups.map((group, i) => (
          <PaneGroup
            key={i}
            group={group}
            selected={selection.entries}
            onToggle={selection.toggle}
            onSelectAll={selection.add}
            onDeselectAll={selection.remove}
            onMoveHere={moveHere}
          />
        ))}
      </div>
      <SelectedFiles
        selected={selection.entries}
        onRemove={selection.toggle}
        onClear={selection.clear}
      />
    </div>
  );
};
