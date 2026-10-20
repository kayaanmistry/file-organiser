import { selectFolder, type Entry } from "@/api/files";

import { DEFAULT_COLUMNS } from "@/components/FileTable/columns";
import { Toolbar } from "@/components/Toolbar/Toolbar";
import { FileTable } from "@/components/FileTable/FileTable";
import { TextButton } from "@/components/Buttons/TextButton/TextButton";

import type { PaneState } from "@/hooks/useGroups";
import { useNaming } from "@/hooks/useNaming";

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
  canCreate: boolean;
  canSelect: boolean;
  canDeselect: boolean;
  canMove: boolean;
  onNewFolder: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onMove: () => void;
};

const ActionBar = ({
  canCreate,
  canSelect,
  canDeselect,
  canMove,
  onNewFolder,
  onSelectAll,
  onDeselectAll,
  onMove,
}: ActionBarProps) => (
  <Toolbar>
    <TextButton onClick={onNewFolder} disabled={!canCreate}>
      new folder
    </TextButton>
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
  onNewFolder: (name: string) => void;
  onRename: (entry: Entry, name: string) => void;
};

export const Pane = ({
  pane,
  selected,
  onOpenFolder,
  onToggle,
  onSelectAll,
  onDeselectAll,
  onMoveHere,
  onNewFolder,
  onRename,
}: PaneProps) => {
  const naming = useNaming(pane, onNewFolder, onRename);

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
        entries={naming.entries}
        columns={DEFAULT_COLUMNS}
        selected={selected}
        naming={naming}
        onRowClick={onToggle}
      />
      <ActionBar
        canCreate={!!pane.path && !naming.isEditing}
        canSelect={selectedHere < pane.entries.length}
        canDeselect={selectedHere > 0}
        canMove={canMoveTo(selected, pane)}
        onNewFolder={naming.startNewFolder}
        onSelectAll={() => onSelectAll(pane.entries)}
        onDeselectAll={() => onDeselectAll(pane.entries)}
        onMove={onMoveHere}
      />
    </section>
  );
};
