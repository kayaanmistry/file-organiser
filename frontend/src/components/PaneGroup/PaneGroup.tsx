import { Pane } from "@/components/Pane/Pane";
import { PaneTabs } from "@/components/Pane/PaneTabs/PaneTabs";
import { IconButton } from "@/components/Buttons/IconButton/IconButton";

import type { GroupActions, GroupState } from "@/hooks/useGroups";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useDrop } from "@/hooks/drag/useDrop";

import styles from "./PaneGroup.module.css";

type TopBarProps = {
  number: number;
  group: GroupState;
  actions: GroupActions;
  canClose: boolean;
  canMinimise: boolean;
};

const TopBar = ({
  number,
  group,
  actions,
  canClose,
  canMinimise,
}: TopBarProps) => {
  const drop = useDrop({
    tab: (tab) =>
      (tab.groupId !== group.id || group.panes.length > 1) &&
      (() => actions.moveTabHere(tab, null)),
  });

  return (
    <div className={styles.topBar}>
      <div className={styles.tabsArea} data-drop={drop.isOver} {...drop.props}>
        <span className={styles.number} data-selected>
          {number}
        </span>
        <PaneTabs
          groupId={group.id}
          panes={group.panes}
          activeId={group.activeId}
          onSelect={actions.selectPane}
          onAdd={actions.addPane}
          onRemove={actions.removePane}
          onMoveTab={actions.moveTabHere}
        />
      </div>
      <div className={styles.controls}>
        <IconButton
          icon="-"
          onClick={actions.minimise}
          disabled={!canMinimise}
        />
        <IconButton icon="x" onClick={actions.close} disabled={!canClose} />
      </div>
    </div>
  );
};

type PaneGroupProps = {
  number: number;
  group: GroupState;
};

export const PaneGroup = ({ number, group }: PaneGroupProps) => {
  const { groups } = useWorkspace();

  const actions = groups.actionsFor(group.id);
  const active = group.panes.find((pane) => pane.id === group.activeId)!;

  const drop = useDrop({
    tab: (tab) =>
      tab.groupId !== group.id && (() => actions.moveTabHere(tab, null)),
  });

  return (
    <div className={styles.paneGroup} data-drop={drop.isOver} {...drop.props}>
      <TopBar
        number={number}
        group={group}
        actions={actions}
        canClose={groups.canClose}
        canMinimise={groups.canToggle(group)}
      />
      <Pane
        key={active.id}
        pane={active}
        onOpenFolder={(path) => actions.openFolder(active.id, path)}
      />
    </div>
  );
};
