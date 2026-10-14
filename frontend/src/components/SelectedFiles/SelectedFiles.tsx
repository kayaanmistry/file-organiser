import type { Entry } from "@/api/files";

import { TextButton } from "@/components/Buttons/TextButton/TextButton";
import { FileTable } from "@/components/FileTable/FileTable";
import { SELECTED_COLUMNS } from "@/components/FileTable/columns";

import styles from "./SelectedFiles.module.css";

type ActionBarProps = {
  canDeselect: boolean;
  onDeselectAll: () => void;
};

const ActionBar = ({ canDeselect, onDeselectAll }: ActionBarProps) => (
  <footer className={styles.actions}>
    <TextButton onClick={onDeselectAll} disabled={!canDeselect}>
      clear
    </TextButton>
  </footer>
);

type SelectedFilesProps = {
  selected: Entry[];
  onRemove: (entry: Entry) => void;
  onClear: () => void;
};

export const SelectedFiles = ({
  selected,
  onRemove,
  onClear,
}: SelectedFilesProps) => (
  <section className={styles.selectedFiles}>
    <p className={styles.title}>Selected Files</p>
    <FileTable
      entries={selected}
      columns={SELECTED_COLUMNS}
      selected={[]}
      onRowClick={onRemove}
    />
    <ActionBar canDeselect={selected.length > 0} onDeselectAll={onClear} />
  </section>
);
