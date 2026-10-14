import { type PaneState } from "@/components/Pane/Pane";
import { IconButton } from "@/components/Buttons/IconButton/IconButton";

import { formatFolderName } from "@/utils/format";

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
  pane: PaneState;
  isActive: boolean;
  canClose: boolean;
  onSelect: () => void;
  onClose: () => void;
};

const Tab = ({ pane, isActive, canClose, onSelect, onClose }: TabProps) => (
  <div
    className={styles.tab}
    data-clickable
    data-selected={isActive}
    title={pane.path ?? undefined}
    onClick={onSelect}
  >
    <span className={styles.label}>{formatFolderName(pane.path)}</span>
    {canClose && <CloseButton onClose={onClose} />}
  </div>
);

type PaneTabsProps = {
  panes: PaneState[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
};

export const PaneTabs = ({
  panes,
  activeId,
  onSelect,
  onAdd,
  onRemove,
}: PaneTabsProps) => (
  <nav className={styles.tabs}>
    {panes.map((pane) => (
      <Tab
        key={pane.id}
        pane={pane}
        isActive={pane.id === activeId}
        canClose={panes.length > 1}
        onSelect={() => onSelect(pane.id)}
        onClose={() => onRemove(pane.id)}
      />
    ))}
    <IconButton icon="+" onClick={onAdd} />
  </nav>
);
