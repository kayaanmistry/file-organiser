import type { ReactNode } from "react";

import styles from "./Button.module.css";

type ButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

export const Button = ({ children, onClick, disabled }: ButtonProps) => (
  <button className={styles.button} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);
