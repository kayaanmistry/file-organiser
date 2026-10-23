import type { Entry } from "@/api/files";

import { useWorkspace } from "@/context/WorkspaceContext";

import { ActionBar } from "@/components/ActionBar/ActionBar";
import { FileTable } from "@/components/FileTable/FileTable";
import { SELECTED_COLUMNS } from "@/components/FileTable/columns";

import { useContextMenu } from "@/hooks/menu/useContextMenu";

import { getCommandItems } from "@/core/commands";

import styles from "./SelectedFiles.module.css";

export const SelectedFiles = () => {
  const workspace = useWorkspace();
  const { selection } = workspace;
  const selected = selection.entries;

  const selectedCommands = getCommandItems(["clear", "delete"], {
    workspace,
    entries: selected,
    selected,
  });

  const entryCommands = (entry: Entry) =>
    getCommandItems(["toggleSelect", "delete"], {
      workspace,
      entries: [entry],
      selected: [entry],
    });

  const menu = useContextMenu(() => selectedCommands);

  return (
    <section className={styles.selectedFiles} {...menu}>
      <p className={styles.title}>Selected Files</p>
      <FileTable
        entries={selected}
        columns={SELECTED_COLUMNS}
        isSelected={() => false}
        getDragged={() => selected}
        onRowClick={selection.toggle}
        getRowCommands={entryCommands}
      />
      <ActionBar items={selectedCommands} />
    </section>
  );
};
