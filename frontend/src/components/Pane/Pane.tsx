import { selectFolder, type Entry } from "@/api/files";

import { TextButton } from "@/components/Buttons/TextButton/TextButton";
import { FileTable } from "@/components/FileTable/FileTable";
import { DEFAULT_COLUMNS } from "@/components/FileTable/columns";
import { Toolbar } from "@/components/Toolbar/Toolbar";

import type { PaneState } from "@/hooks/useGroups";

import { canMoveTo } from "@/utils/move";

import styles from "./Pane.module.css";

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
  canDeselect: boolean;
  canMove: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onMove: () => void;
};

const ActionBar = ({
  canSelect,
  canDeselect,
  canMove,
  onSelectAll,
  onDeselectAll,
  onMove,
}: ActionBarProps) => (
  <Toolbar>
    <TextButton onClick={onSelectAll} disabled={!canSelect}>
      select all
    </TextButton>
    <TextButton onClick={onDeselectAll} disabled={!canDeselect}>
      clear
    </TextButton>
    <TextButton onClick={onMove} disabled={!canMove}>
      move here
    </TextButton>
  </Toolbar>
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
  const handleSelect = async () => {
    const selectedPath = await selectFolder();
    if (!selectedPath) return;
    onOpenFolder(selectedPath);
  };

  const selectedHere = selected.filter((e) => e.parent === pane.path).length;

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
        canSelect={selectedHere < pane.entries.length}
        canDeselect={selectedHere > 0}
        canMove={canMoveTo(selected, pane)}
        onSelectAll={() => onSelectAll(pane.entries)}
        onDeselectAll={() => onDeselectAll(pane.entries)}
        onMove={onMoveHere}
      />
    </section>
  );
};
