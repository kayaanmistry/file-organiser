import type { Entry } from "@/api/files";

import { Pane } from "@/components/Pane/Pane";
import { PaneTabs } from "@/components/Pane/PaneTabs/PaneTabs";
import { IconButton } from "@/components/Buttons/IconButton/IconButton";

import type { GroupActions, GroupState, PaneState } from "@/hooks/useGroups";
import type { UseSelectionReturn } from "@/hooks/useSelection";
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
  actions: GroupActions;
  canClose: boolean;
  canMinimise: boolean;
  selection: UseSelectionReturn;
  onMove: (entries: Entry[], destination: string) => void;
  onNewFolder: (target: PaneState, name: string) => void;
  onRename: (entry: Entry, name: string) => void;
  onDelete: (entries: Entry[]) => void;
};

export const PaneGroup = ({
  number,
  group,
  actions,
  canClose,
  canMinimise,
  selection,
  onMove,
  onNewFolder,
  onRename,
  onDelete,
}: PaneGroupProps) => {
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
        canClose={canClose}
        canMinimise={canMinimise}
      />
      <Pane
        key={active.id}
        pane={active}
        selected={selection.entries}
        isSelected={selection.isSelected}
        onOpenFolder={(path) => actions.openFolder(active.id, path)}
        onToggle={selection.toggle}
        onSelectAll={selection.add}
        onDeselectAll={selection.remove}
        onMove={onMove}
        onNewFolder={(name) => onNewFolder(active, name)}
        onRename={onRename}
        onDelete={onDelete}
      />
    </div>
  );
};
