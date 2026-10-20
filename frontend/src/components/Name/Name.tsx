import { useRef, useState } from "react";

import type { Entry } from "@/api/files";

import { formatName } from "@/utils/format";
import { confirmOrCancel } from "@/utils/input";
import { isNameTaken, isValidName } from "@/utils/path";

import styles from "./Name.module.css";

export type Naming = {
  editingPath: string | null;
  taken: string[];
  onEdit: (entry: Entry) => void;
  onSubmit: (entry: Entry, name: string) => void;
  onCancel: () => void;
};

type EditorProps = {
  entry: Entry;
  taken: string[];
  onSubmit: (name: string) => void;
  onCancel: () => void;
};

const Editor = ({ entry, taken, onSubmit, onCancel }: EditorProps) => {
  const [name, setName] = useState(entry.name);

  const done = useRef(false);

  const trimmed = name.trim();
  const canSubmit = isValidName(trimmed) && !isNameTaken(trimmed, taken);

  const finish = (submit: boolean) => {
    if (done.current) return;
    done.current = true;

    if (submit) onSubmit(trimmed);
    else onCancel();
  };

  return (
    <input
      className={styles.input}
      value={name}
      data-invalid={!canSubmit}
      autoFocus
      onFocus={(e) =>
        e.currentTarget.setSelectionRange(0, name.length - entry.ext.length)
      }
      onChange={(e) => setName(e.target.value)}
      onKeyDown={confirmOrCancel(
        () => finish(true),
        () => finish(false),
      )}
      onBlur={() => finish(canSubmit)}
    />
  );
};

type NameProps = {
  entry: Entry;
  naming?: Naming;
};

export const Name = ({ entry, naming }: NameProps) => {
  if (naming?.editingPath === entry.path) {
    return (
      <Editor
        entry={entry}
        taken={naming.taken}
        onSubmit={(name) => naming.onSubmit(entry, name)}
        onCancel={naming.onCancel}
      />
    );
  }

  return (
    <span onDoubleClick={() => naming?.onEdit(entry)}>
      {formatName(entry.name, entry.ext)}
    </span>
  );
};
