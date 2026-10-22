import { IconButton } from "@/components/Buttons/IconButton/IconButton";

import type { PaneState, TabRef } from "@/hooks/useGroups";
import { useDrag } from "@/hooks/drag/useDrag";
import { useDrop } from "@/hooks/drag/useDrop";

import { formatFolderName } from "@/utils/format";
import { scrollSideways } from "@/utils/input";

import styles from "./PaneTabs.module.css";

type CloseButtonProps = {
  onClose: () => void;
};

const CloseButton = ({ onClose }: CloseButtonProps) => (
  <button
    className={styles.close}
    onClick={(e) => {
      e.stopPropagation();
      onClose();
    }}
  >
    ×
  </button>
);

type TabProps = {
  groupId: string;
  pane: PaneState;
  isActive: boolean;
  canClose: boolean;
  onSelect: () => void;
  onClose: () => void;
  onMoveTab: (tab: TabRef, beforeId: string) => void;
};

const Tab = ({
  groupId,
  pane,
  isActive,
  canClose,
  onSelect,
  onClose,
  onMoveTab,
}: TabProps) => {
  const drag = useDrag({ kind: "tab", data: { groupId, paneId: pane.id } });
  const drop = useDrop({
    tab: (tab) => tab.paneId !== pane.id && (() => onMoveTab(tab, pane.id)),
  });

  return (
    <div
      className={styles.tab}
      data-clickable
      data-selected={isActive}
      data-drop={drop.isOver}
      title={pane.path ?? undefined}
      onClick={onSelect}
      {...drag}
      {...drop.props}
    >
      <span className={styles.label}>{formatFolderName(pane.path)}</span>
      {canClose && <CloseButton onClose={onClose} />}
    </div>
  );
};

type PaneTabsProps = {
  groupId: string;
  panes: PaneState[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onMoveTab: (tab: TabRef, beforeId: string) => void;
};

export const PaneTabs = ({
  groupId,
  panes,
  activeId,
  onSelect,
  onAdd,
  onRemove,
  onMoveTab,
}: PaneTabsProps) => {
  return (
    <nav className={styles.tabs} onWheel={scrollSideways}>
      {panes.map((pane) => (
        <Tab
          key={pane.id}
          groupId={groupId}
          pane={pane}
          isActive={pane.id === activeId}
          canClose={panes.length > 1}
          onSelect={() => onSelect(pane.id)}
          onClose={() => onRemove(pane.id)}
          onMoveTab={onMoveTab}
        />
      ))}
      <IconButton icon="+" onClick={onAdd} />
    </nav>
  );
};
