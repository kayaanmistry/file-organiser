import type { Entry } from "@/api/files";
import { formatType, formatName, formatDate, formatSize } from "@/utils/format";

type Column = {
  label: string;
  render: (entry: Entry) => string;
};

export type ColumnId = keyof typeof COLUMNS;

export const DEFAULT_COLUMNS: ColumnId[] = ["name", "type", "size", "modified"];

export const COLUMNS = {
  name: {
    label: "Name",
    render: (entry) => formatName(entry.name, entry.ext),
  },
  type: {
    label: "Type",
    render: (entry) => (entry.is_dir ? "folder" : formatType(entry.ext)),
  },
  size: {
    label: "Size",
    render: (entry) => (entry.is_dir ? "--" : formatSize(entry.size)),
  },
  modified: {
    label: "Modified",
    render: (entry) => formatDate(entry.modified),
  },
} satisfies Record<string, Column>;
