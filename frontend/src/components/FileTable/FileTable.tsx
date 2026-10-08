import type { Entry } from "@/api/files";

import { COLUMNS, type ColumnId } from "./columns";
import styles from "./FileTable.module.css";

type ColumnHeadersProps = {
  columns: ColumnId[];
};

const ColumnHeaders = ({ columns }: ColumnHeadersProps) => (
  <div className={styles.columnHeaders}>
    {columns.map((id) => (
      <span key={id} className={styles.cell}>
        {COLUMNS[id].label}
      </span>
    ))}
  </div>
);

type EntryRowProps = {
  entry: Entry;
  columns: ColumnId[];
  isSelected: boolean;
  onClick: () => void;
};

const EntryRow = ({ entry, columns, isSelected, onClick }: EntryRowProps) => (
  <div className={styles.row} data-selected={isSelected} onClick={onClick}>
    {columns.map((id) => (
      <span key={id} className={styles.cell}>
        {COLUMNS[id].render(entry)}
      </span>
    ))}
  </div>
);

type FileTableProps = {
  entries: Entry[];
  columns: ColumnId[];
  selected: Entry[];
  onRowClick?: (entry: Entry) => void;
};

export const FileTable = ({
  entries,
  columns,
  selected,
  onRowClick,
}: FileTableProps) => (
  <div className={styles.table}>
    <ColumnHeaders columns={columns} />
    <div className={styles.body}>
      {entries.map((entry) => (
        <EntryRow
          key={entry.path}
          entry={entry}
          columns={columns}
          isSelected={selected.some((e) => e.path === entry.path)}
          onClick={() => onRowClick?.(entry)}
        />
      ))}
    </div>
  </div>
);
