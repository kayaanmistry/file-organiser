import styles from "./IconButton.module.css";

type IconButtonProps = {
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
};

export const IconButton = ({
  icon,
  onClick,
  disabled,
  selected,
}: IconButtonProps) => (
  <button
    className={styles.iconButton}
    onClick={onClick}
    disabled={disabled}
    data-selected={selected}
  >
    {icon}
  </button>
);
