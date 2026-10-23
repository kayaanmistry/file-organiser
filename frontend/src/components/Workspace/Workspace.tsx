import { ActionBar } from "@/components/ActionBar/ActionBar";
import { GroupTabs } from "@/components/PaneGroup/GroupTabs/GroupTabs";
import { PaneGroup } from "@/components/PaneGroup/PaneGroup";
import { SelectedFiles } from "@/components/SelectedFiles/SelectedFiles";

import { WorkspaceContext, useWorkspace } from "@/context/WorkspaceContext";

import { getCommandItems } from "@/core/commands";

import { useFileOperations } from "@/hooks/useFileOperations";
import { useGroups } from "@/hooks/useGroups";
import { useHistory } from "@/hooks/useHistory";
import { useSelection } from "@/hooks/useSelection";

import styles from "./Workspace.module.css";

const TopBar = () => {
  const workspace = useWorkspace();
  const { groups } = workspace;

  const workspaceCommands = getCommandItems(["newWindow", "undo", "redo"], {
    workspace,
    entries: [],
    selected: [],
  });

  return (
    <div className={styles.topBar}>
      <GroupTabs
        groups={groups.list}
        canToggle={groups.canToggle}
        onToggle={groups.toggleGroup}
      />
      <ActionBar items={workspaceCommands} />
    </div>
  );
};

export const Workspace = () => {
  const groups = useGroups();
  const selection = useSelection();

  const history = useHistory(async () => {
    selection.clear();
    await groups.reload();
  });

  const operations = useFileOperations(groups, selection, history);

  return (
    <WorkspaceContext.Provider
      value={{ groups, selection, history, operations }}
    >
      <div className={styles.workspace}>
        <TopBar />
        <div className={styles.paneGroups}>
          {groups.list.map(
            (group, i) =>
              group.visible && (
                <PaneGroup key={group.id} number={i + 1} group={group} />
              ),
          )}
        </div>
        <SelectedFiles />
      </div>
    </WorkspaceContext.Provider>
  );
};
