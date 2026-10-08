import type { Entry } from "@/api/files";

import { FileTable } from "@/components/FileTable/FileTable";
import { DEFAULT_COLUMNS } from "@/components/FileTable/columns";

import styles from "./SelectedFiles.module.css";

type SelectedFilesProps = {
  selected: Entry[];
  onRemove: (entry: Entry) => void;
};

export const SelectedFiles = ({ selected, onRemove }: SelectedFilesProps) => (
  <section className={styles.selectedFiles}>
    <p className={styles.title}>Selected Files</p>
    <FileTable
      entries={selected}
      columns={DEFAULT_COLUMNS}
      selected={[]}
      onRowClick={onRemove}
    />
  </section>
);
