import type { Entry } from "@/api/files";

import { TextButton } from "@/components/Buttons/TextButton/TextButton";
import { FileTable } from "@/components/FileTable/FileTable";
import { SELECTED_COLUMNS } from "@/components/FileTable/columns";
import { Toolbar } from "@/components/Toolbar/Toolbar";

import styles from "./SelectedFiles.module.css";

type ActionBarProps = {
  hasSelection: boolean;
  onDeselectAll: () => void;
  onDelete: () => void;
};

const ActionBar = ({
  hasSelection,
  onDeselectAll,
  onDelete,
}: ActionBarProps) => (
  <Toolbar>
    <TextButton onClick={onDeselectAll} disabled={!hasSelection}>
      clear
    </TextButton>
    <TextButton onClick={onDelete} disabled={!hasSelection}>
      delete
    </TextButton>
  </Toolbar>
);

type SelectedFilesProps = {
  selected: Entry[];
  onRemove: (entry: Entry) => void;
  onClear: () => void;
  onDelete: () => void;
};

export const SelectedFiles = ({
  selected,
  onRemove,
  onClear,
  onDelete,
}: SelectedFilesProps) => (
  <section className={styles.selectedFiles}>
    <p className={styles.title}>Selected Files</p>
    <FileTable
      entries={selected}
      columns={SELECTED_COLUMNS}
      selected={[]}
      onRowClick={onRemove}
    />
    <ActionBar
      hasSelection={selected.length > 0}
      onDeselectAll={onClear}
      onDelete={onDelete}
    />
  </section>
);
