import type { Entry } from "@/api/files";

import type { Naming } from "@/components/Name/Name";
import { Name } from "@/components/Name/Name";

import { useContextMenu } from "@/hooks/menu/useContextMenu";
import { useDrag } from "@/hooks/drag/useDrag";

import type { CommandItem } from "@/core/commands";

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
  dragged: Entry[];
  naming?: Naming;
  onClick: () => void;
  getCommands: () => CommandItem[];
};

const EntryRow = ({
  entry,
  columns,
  isSelected,
  isClickable,
  dragged,
  naming,
  onClick,
  getCommands,
}: EntryRowProps) => {
  const isEditing = naming?.editingPath === entry.path;

  const drag = useDrag({ kind: "entries", data: dragged }, !isEditing);
  const menu = useContextMenu(isEditing ? () => [] : getCommands);

  return (
    <div
      className={styles.row}
      data-clickable={(isClickable && !isEditing) || undefined}
      data-selected={isSelected}
      onClick={isEditing ? undefined : onClick}
      {...drag}
      {...menu}
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
  naming?: Naming;
  isSelected: (entry: Entry) => boolean;
  getDragged: (entry: Entry) => Entry[];
  onRowClick?: (entry: Entry) => void;
  getRowCommands: (entry: Entry) => CommandItem[];
};

export const FileTable = ({
  entries,
  columns,
  naming,
  isSelected,
  getDragged,
  onRowClick,
  getRowCommands,
}: FileTableProps) => (
  <div className={styles.table}>
    <ColumnHeaders columns={columns} />
    <div className={styles.body}>
      {entries.map((entry) => (
        <EntryRow
          key={entry.path}
          entry={entry}
          columns={columns}
          isSelected={isSelected(entry)}
          isClickable={!!onRowClick}
          dragged={getDragged(entry)}
          naming={naming}
          onClick={() => onRowClick?.(entry)}
          getCommands={() => getRowCommands(entry)}
        />
      ))}
    </div>
  </div>
);
