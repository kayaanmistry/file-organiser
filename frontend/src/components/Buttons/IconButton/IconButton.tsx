import styles from "./IconButton.module.css";

type IconButtonProps = {
  icon: string;
  onClick: () => void;
  disabled?: boolean;
};

export const IconButton = ({ icon, onClick, disabled }: IconButtonProps) => (
  <button className={styles.iconButton} onClick={onClick} disabled={disabled}>
    {icon}
  </button>
);
