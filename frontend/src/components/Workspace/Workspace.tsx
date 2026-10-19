import { moveFiles } from "@/api/files";

import { PaneGroup } from "@/components/Pane/PaneGroup/PaneGroup";
import { SelectedFiles } from "@/components/SelectedFiles/SelectedFiles";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import { TextButton } from "@/components/Buttons/TextButton/TextButton";

import type { PaneState } from "@/hooks/useGroups";
import { useGroups } from "@/hooks/useGroups";
import { useHistory } from "@/hooks/useHistory";
import { useSelection } from "@/hooks/useSelection";

import styles from "./Workspace.module.css";

type ActionBarProps = {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onNewWindow: () => void;
};

const ActionBar = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onNewWindow,
}: ActionBarProps) => (
  <Toolbar>
    <TextButton onClick={onNewWindow}>new window</TextButton>
    <TextButton onClick={onUndo} disabled={!canUndo}>
      undo
    </TextButton>
    <TextButton onClick={onRedo} disabled={!canRedo}>
      redo
    </TextButton>
  </Toolbar>
);

export const Workspace = () => {
  const workspace = useGroups();
  const selection = useSelection();

  const history = useHistory(async () => {
    selection.clear();
    await workspace.reload();
  });

  const moveHere = async (target: PaneState) => {
    if (!target.path) return;

    await moveFiles(
      selection.entries.map((e) => e.path),
      target.path,
    );

    selection.clear();
    await workspace.reload();
    await history.refresh();
  };

  return (
    <div className={styles.workspace}>
      <ActionBar
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={history.undo}
        onRedo={history.redo}
        onNewWindow={workspace.addGroup}
      />
      <div className={styles.paneGroups}>
        {workspace.groups.map((group) => (
          <PaneGroup
            key={group.id}
            group={group}
            actions={workspace.actionsFor(group.id)}
            canClose={workspace.canClose}
            selection={selection}
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
