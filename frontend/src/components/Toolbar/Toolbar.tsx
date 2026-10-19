import type { ReactNode } from "react";

import styles from "./Toolbar.module.css";

type ToolbarProps = {
  children: ReactNode;
};

export const Toolbar = ({ children }: ToolbarProps) => (
  <div className={styles.toolbar}>{children}</div>
);
