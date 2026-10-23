import type { CommandItem } from "@/core/commands";

import { TextButton } from "@/components/Buttons/TextButton/TextButton";

import styles from "./ActionBar.module.css";

type ActionBarProps = {
  items: CommandItem[];
};

export const ActionBar = ({ items }: ActionBarProps) => (
  <div className={styles.actionBar}>
    {items.map((item) => (
      <TextButton key={item.label} onClick={item.run} disabled={item.disabled}>
        {item.label}
      </TextButton>
    ))}
  </div>
);
