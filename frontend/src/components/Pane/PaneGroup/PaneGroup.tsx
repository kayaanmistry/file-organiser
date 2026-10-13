import type { Entry } from "@/api/files";

import { Pane, type PaneState } from "@/components/Pane/Pane";
import { PaneTabs } from "@/components/Pane/PaneTabs/PaneTabs";

import type { usePanes } from "@/hooks/usePanes";

import styles from "./PaneGroup.module.css";

type PaneGroupProps = {
  group: ReturnType<typeof usePanes>;
  selected: Entry[];
  onToggle: (entry: Entry) => void;
  onMoveHere: (target: PaneState) => void;
};

export const PaneGroup = ({
  group,
  selected,
  onToggle,
  onMoveHere,
}: PaneGroupProps) => {
  const { active } = group;

  return (
    <div className={styles.paneGroup}>
      <PaneTabs
        panes={group.panes}
        activeId={group.activeId}
        onSelect={group.setActiveId}
        onAdd={group.add}
        onRemove={group.remove}
      />
      <Pane
        key={active.id}
        pane={active}
        selected={selected}
        onOpenFolder={(path) => group.open(active.id, path)}
        onToggle={onToggle}
        onMoveHere={() => onMoveHere(active)}
      />
    </div>
  );
};
