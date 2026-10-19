import { IconButton } from "@/components/Buttons/IconButton/IconButton";

import type { GroupState } from "@/hooks/useGroups";

import styles from "./GroupTabs.module.css";

type GroupTabsProps = {
  groups: GroupState[];
  canToggle: (group: GroupState) => boolean;
  onToggle: (id: string) => void;
};

export const GroupTabs = ({ groups, canToggle, onToggle }: GroupTabsProps) => (
  <nav className={styles.groupTabs}>
    {groups.map((group, i) => (
      <IconButton
        key={group.id}
        icon={String(i + 1)}
        selected={group.visible}
        disabled={!canToggle(group)}
        onClick={() => onToggle(group.id)}
      />
    ))}
  </nav>
);
