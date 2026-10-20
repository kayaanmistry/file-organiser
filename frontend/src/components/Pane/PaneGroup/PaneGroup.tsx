import type { Entry } from "@/api/files";

import { Pane } from "@/components/Pane/Pane";
import { PaneTabs } from "@/components/Pane/PaneTabs/PaneTabs";
import { IconButton } from "@/components/Buttons/IconButton/IconButton";

import type { GroupActions, GroupState, PaneState } from "@/hooks/useGroups";
import type { UseSelectionReturn } from "@/hooks/useSelection";

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
}: TopBarProps) => (
  <div className={styles.topBar}>
    <div className={styles.tabsArea}>
      <span className={styles.number} data-selected>
        {number}
      </span>
      <PaneTabs
        panes={group.panes}
        activeId={group.activeId}
        onSelect={actions.selectPane}
        onAdd={actions.addPane}
        onRemove={actions.removePane}
      />
    </div>
    <div className={styles.controls}>
      <IconButton icon="-" onClick={actions.minimise} disabled={!canMinimise} />
      <IconButton icon="x" onClick={actions.close} disabled={!canClose} />
    </div>
  </div>
);

type PaneGroupProps = {
  number: number;
  group: GroupState;
  actions: GroupActions;
  canClose: boolean;
  canMinimise: boolean;
  selection: UseSelectionReturn;
  onMoveHere: (target: PaneState) => void;
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
  onMoveHere,
  onNewFolder,
  onRename,
  onDelete,
}: PaneGroupProps) => {
  const active = group.panes.find((pane) => pane.id === group.activeId)!;

  return (
    <div className={styles.paneGroup}>
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
        onOpenFolder={(path) => actions.openFolder(active.id, path)}
        onToggle={selection.toggle}
        onSelectAll={selection.add}
        onDeselectAll={selection.remove}
        onMoveHere={() => onMoveHere(active)}
        onNewFolder={(name) => onNewFolder(active, name)}
        onRename={onRename}
        onDelete={onDelete}
      />
    </div>
  );
};
