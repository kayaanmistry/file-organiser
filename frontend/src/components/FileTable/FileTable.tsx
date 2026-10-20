import type { Entry } from "@/api/files";

import type { Naming } from "@/components/Name/Name";
import { Name } from "@/components/Name/Name";

import type { ColumnId } from "./columns";
import { COLUMNS } from "./columns";

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

type CellProps = {
  id: ColumnId;
  entry: Entry;
  naming?: Naming;
};

const Cell = ({ id, entry, naming }: CellProps) => {
  if (id === "name") {
    return <Name entry={entry} naming={naming} />;
  }

  return COLUMNS[id].render(entry);
};

type EntryRowProps = {
  entry: Entry;
  columns: ColumnId[];
  isSelected: boolean;
  isClickable: boolean;
  naming?: Naming;
  onClick: () => void;
};

const EntryRow = ({
  entry,
  columns,
  isSelected,
  isClickable,
  naming,
  onClick,
}: EntryRowProps) => {
  const isEditing = naming?.editingPath === entry.path;

  return (
    <div
      className={styles.row}
      data-clickable={(isClickable && !isEditing) || undefined}
      data-selected={isSelected}
      onClick={isEditing ? undefined : onClick}
    >
      {columns.map((id) => (
        <span key={id} className={styles.cell}>
          <Cell id={id} entry={entry} naming={naming} />
        </span>
      ))}
    </div>
  );
};

type FileTableProps = {
  entries: Entry[];
  columns: ColumnId[];
  selected: Entry[];
  naming?: Naming;
  onRowClick?: (entry: Entry) => void;
};

export const FileTable = ({
  entries,
  columns,
  selected,
  naming,
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
          isClickable={!!onRowClick}
          naming={naming}
          onClick={() => onRowClick?.(entry)}
        />
      ))}
    </div>
  </div>
);
