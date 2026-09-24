import { useState } from "react";

import { listFiles, selectFolder, type Entry } from "@/api/files";

import styles from "./FolderView.module.css";

const COLUMNS = ["Name", "Ext", "Size", "Modified"];

export const FolderView = () => {
  const [path, setPath] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);

  const handleSelect = async () => {
    const selectedPath = await selectFolder();
    if (!selectedPath) return;
    setPath(selectedPath);
    setEntries(await listFiles(selectedPath));
  };

  return (
    <section className={styles.folderView}>
      <header className={styles.header}>
        <p>{path ?? "No folder selected"}</p>
        <button onClick={handleSelect}>Select</button>
      </header>

      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.name}>
              <td>{entry.name}</td>
              <td>{entry.ext}</td>
              <td>{entry.size}</td>
              <td>{entry.modified}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
