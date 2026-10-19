import { Pane } from "@/components/Pane/Pane";
import { PaneTabs } from "@/components/Pane/PaneTabs/PaneTabs";
import { IconButton } from "@/components/Buttons/IconButton/IconButton";

import type { GroupActions, GroupState } from "@/hooks/useGroups";
import type { PaneState } from "@/hooks/useGroups";
import type { Selection } from "@/hooks/useSelection";

import styles from "./PaneGroup.module.css";

type PaneGroupProps = {
  group: GroupState;
  actions: GroupActions;
  canClose: boolean;
  selection: Selection;
  onMoveHere: (target: PaneState) => void;
};

export const PaneGroup = ({
  group,
  actions,
  canClose,
  selection,
  onMoveHere,
}: PaneGroupProps) => {
  const active = group.panes.find((pane) => pane.id === group.activeId)!;

  return (
    <div className={styles.paneGroup}>
      <div className={styles.top}>
        <PaneTabs
          panes={group.panes}
          activeId={group.activeId}
          onSelect={actions.selectPane}
          onAdd={actions.addPane}
          onRemove={actions.removePane}
        />
        <IconButton icon="x" onClick={actions.close} disabled={!canClose} />
      </div>
      <Pane
        key={active.id}
        pane={active}
        selected={selection.entries}
        onOpenFolder={(path) => actions.openFolder(active.id, path)}
        onToggle={selection.toggle}
        onSelectAll={selection.add}
        onDeselectAll={selection.remove}
        onMoveHere={() => onMoveHere(active)}
      />
    </div>
  );
};
