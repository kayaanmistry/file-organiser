import { selectFolder, type Entry } from "@/api/files";

import { Button } from "@/components/Button/Button";
import { FileTable } from "@/components/FileTable/FileTable";

import { DEFAULT_COLUMNS } from "@/components/FileTable/columns";

import styles from "./Pane.module.css";

export type PaneState = {
  id: string;
  path: string | null;
  entries: Entry[];
};

type PathBarProps = {
  path: string | null;
  onSelect: () => void;
};

const PathBar = ({ path, onSelect }: PathBarProps) => (
  <header className={styles.header}>
    <p className={styles.path}>{path ?? "No folder selected"}</p>
    <Button onClick={onSelect}>select folder</Button>
  </header>
);

type ActionBarProps = {
  canMove: boolean;
  onMove: () => void;
};

const ActionBar = ({ canMove, onMove }: ActionBarProps) => (
  <footer className={styles.actions}>
    <Button onClick={onMove} disabled={!canMove}>
      move here
    </Button>
  </footer>
);

type PaneProps = {
  pane: PaneState;
  selected: Entry[];
  onOpenFolder: (path: string) => void;
  onToggle: (entry: Entry) => void;
  onMoveHere: () => void;
};

export const Pane = ({
  pane,
  selected,
  onOpenFolder,
  onToggle,
  onMoveHere,
}: PaneProps) => {
  const handleSelect = async () => {
    const selectedPath = await selectFolder();
    if (!selectedPath) return;
    onOpenFolder(selectedPath);
  };

  return (
    <section className={styles.pane}>
      <PathBar path={pane.path} onSelect={handleSelect} />
      <FileTable
        entries={pane.entries}
        columns={DEFAULT_COLUMNS}
        selected={selected}
        onRowClick={onToggle}
      />
      <ActionBar
        canMove={selected.length > 0 && !!pane.path}
        onMove={onMoveHere}
      />
    </section>
  );
};
