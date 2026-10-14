import type { ReactNode } from "react";

import styles from "./TextButton.module.css";

type TextButtonProps = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
};

export const TextButton = ({
  children,
  onClick,
  disabled,
  active,
}: TextButtonProps) => (
  <button
    className={styles.textButton}
    onClick={onClick}
    disabled={disabled}
    data-active={active}
  >
    {children}
  </button>
);
