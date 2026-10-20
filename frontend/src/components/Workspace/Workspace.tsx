import { moveFiles } from "@/api/files";

import { TextButton } from "@/components/Buttons/TextButton/TextButton";
import { GroupTabs } from "@/components/Pane/PaneGroup/GroupTabs/GroupTabs";
import { PaneGroup } from "@/components/Pane/PaneGroup/PaneGroup";
import { SelectedFiles } from "@/components/SelectedFiles/SelectedFiles";
import { Toolbar } from "@/components/Toolbar/Toolbar";

import type { UseGroupsReturn, PaneState } from "@/hooks/useGroups";
import type { UseHistoryReturn } from "@/hooks/useHistory";
import { useGroups } from "@/hooks/useGroups";
import { useHistory } from "@/hooks/useHistory";
import { useSelection } from "@/hooks/useSelection";

import styles from "./Workspace.module.css";

type TopBarProps = {
  groups: UseGroupsReturn;
  history: UseHistoryReturn;
};

const TopBar = ({ groups, history }: TopBarProps) => (
  <div className={styles.topBar}>
    <GroupTabs
      groups={groups.list}
      canToggle={groups.canToggle}
      onToggle={groups.toggleGroup}
    />
    <Toolbar>
      <TextButton onClick={groups.addGroup}>new window</TextButton>
      <TextButton onClick={history.undo} disabled={!history.canUndo}>
        undo
      </TextButton>
      <TextButton onClick={history.redo} disabled={!history.canRedo}>
        redo
      </TextButton>
    </Toolbar>
  </div>
);

export const Workspace = () => {
  const groups = useGroups();
  const selection = useSelection();

  const history = useHistory(async () => {
    selection.clear();
    await groups.reload();
  });

  const moveHere = async (target: PaneState) => {
    if (!target.path) return;

    await moveFiles(
      selection.entries.map((e) => e.path),
      target.path,
    );

    selection.clear();
    await groups.reload();
    await history.refresh();
  };

  return (
    <div className={styles.workspace}>
      <TopBar groups={groups} history={history} />
      <div className={styles.paneGroups}>
        {groups.list.map(
          (group, i) =>
            group.visible && (
              <PaneGroup
                key={group.id}
                number={i + 1}
                group={group}
                actions={groups.actionsFor(group.id)}
                canClose={groups.canClose}
                canMinimise={groups.canToggle(group)}
                selection={selection}
                onMoveHere={moveHere}
              />
            ),
        )}
      </div>
      <SelectedFiles
        selected={selection.entries}
        onRemove={selection.toggle}
        onClear={selection.clear}
      />
    </div>
  );
};
