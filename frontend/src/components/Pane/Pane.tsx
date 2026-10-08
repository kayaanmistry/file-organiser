import type { ReactNode } from "react";

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

type PaneProps = {
  title: string;
  pane: PaneState;
  selected: Entry[];
  onOpenFolder: (path: string) => void;
  onRowClick?: (entry: Entry) => void;
  children?: ReactNode;
};

export const Pane = ({
  title,
  pane,
  selected,
  onOpenFolder,
  onRowClick,
  children,
}: PaneProps) => {
  const handleSelect = async () => {
    const selectedPath = await selectFolder();
    if (!selectedPath) return;
    onOpenFolder(selectedPath);
  };

  return (
    <section className={styles.pane}>
      <p className={styles.title}>{title}</p>
      <PathBar path={pane.path} onSelect={handleSelect} />
      <FileTable
        entries={pane.entries}
        columns={DEFAULT_COLUMNS}
        selected={selected}
        onRowClick={onRowClick}
      />
      {children}
    </section>
  );
};
