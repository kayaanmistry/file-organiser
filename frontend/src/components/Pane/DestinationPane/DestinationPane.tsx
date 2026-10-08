import { Button } from "@/components/Button/Button";
import { Pane, type PaneState } from "@/components/Pane/Pane";

import styles from "./DestinationPane.module.css";

type DestinationPaneProps = {
  pane: PaneState;
  canMove: boolean;
  onOpenFolder: (path: string) => void;
  onMoveHere: () => void;
};

export const DestinationPane = ({
  pane,
  canMove,
  onOpenFolder,
  onMoveHere,
}: DestinationPaneProps) => (
  <Pane
    title="destination"
    pane={pane}
    selected={[]}
    onOpenFolder={onOpenFolder}
  >
    <div className={styles.actions}>
      <Button onClick={onMoveHere} disabled={!canMove || !pane.path}>
        move here
      </Button>
    </div>
  </Pane>
);
