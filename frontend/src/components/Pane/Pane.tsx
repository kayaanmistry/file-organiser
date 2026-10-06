import { selectFolder, type Entry } from "@/api/files";
import { Button } from "@/components/Button/Button";
import { formatType, formatName, formatDate, formatSize } from "@/utils/format";

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

const ColumnHeaders = () => (
  <div className={styles.columnHeaders}>
    <span>Name</span>
    <span>Type</span>
    <span>Size</span>
    <span>Modified</span>
  </div>
);

type EntryRowProps = {
  entry: Entry;
};

const EntryRow = ({ entry }: EntryRowProps) => (
  <div className={styles.row}>
    <span className={styles.name}>{formatName(entry.name, entry.ext)}</span>
    <span>{entry.is_dir ? "folder" : formatType(entry.ext)}</span>
    <span>{entry.is_dir ? "--" : formatSize(entry.size)}</span>
    <span>{formatDate(entry.modified)}</span>
  </div>
);

type PaneProps = {
  pane: PaneState;
  onNavigate: (path: string) => void;
};

export const Pane = ({ pane, onNavigate }: PaneProps) => {
  const { path, entries } = pane;

  const handleSelect = async () => {
    const selectedPath = await selectFolder();
    if (!selectedPath) return;
    onNavigate(selectedPath);
  };

  return (
    <section className={styles.pane}>
      <PathBar path={path} onSelect={handleSelect} />
      <div className={styles.grid}>
        <ColumnHeaders />
        <div className={styles.body}>
          {entries.map((entry) => (
            <EntryRow key={entry.path} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  );
};
