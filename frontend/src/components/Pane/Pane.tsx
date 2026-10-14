import { selectFolder, type Entry } from "@/api/files";

import { TextButton } from "@/components/Buttons/TextButton/TextButton";
import { FileTable } from "@/components/FileTable/FileTable";
import { DEFAULT_COLUMNS } from "@/components/FileTable/columns";

import { canMoveTo } from "@/utils/move";

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
    <TextButton onClick={onSelect}>select folder</TextButton>
  </header>
);

type ActionBarProps = {
  canSelect: boolean;
  allSelected: boolean;
  canMove: boolean;
  onToggleAll: () => void;
  onMove: () => void;
};

const ActionBar = ({
  canSelect,
  allSelected,
  canMove,
  onToggleAll,
  onMove,
}: ActionBarProps) => (
  <footer className={styles.actions}>
    <TextButton
      onClick={onToggleAll}
      disabled={!canSelect}
      active={allSelected}
    >
      select all
    </TextButton>
    <TextButton onClick={onMove} disabled={!canMove}>
      move here
    </TextButton>
  </footer>
);

type PaneProps = {
  pane: PaneState;
  selected: Entry[];
  onOpenFolder: (path: string) => void;
  onToggle: (entry: Entry) => void;
  onSelectAll: (entries: Entry[]) => void;
  onDeselectAll: (entries: Entry[]) => void;
  onMoveHere: () => void;
};

export const Pane = ({
  pane,
  selected,
  onOpenFolder,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onMoveHere,
}: PaneProps) => {
  const selectedHere = selected.filter((e) => e.parent === pane.path).length;
  const allSelected =
    pane.entries.length > 0 && selectedHere === pane.entries.length;

  const handleSelect = async () => {
    const selectedPath = await selectFolder();
    if (!selectedPath) return;
    onOpenFolder(selectedPath);
  };

  const toggleAll = () =>
    allSelected ? onDeselectAll(pane.entries) : onSelectAll(pane.entries);

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
        canSelect={pane.entries.length > 0}
        allSelected={allSelected}
        canMove={canMoveTo(selected, pane)}
        onToggleAll={toggleAll}
        onMove={onMoveHere}
      />
    </section>
  );
};
