import type { Entry } from "@/api/files";
import { selectFolder } from "@/api/files";

import { DEFAULT_COLUMNS } from "@/components/FileTable/columns";
import { ActionBar } from "@/components/ActionBar/ActionBar";
import { FileTable } from "@/components/FileTable/FileTable";
import { TextButton } from "@/components/Buttons/TextButton/TextButton";

import type { PaneState } from "@/hooks/useGroups";
import { useNaming } from "@/hooks/useNaming";
import { useDrop } from "@/hooks/drag/useDrop";
import { useContextMenu } from "@/hooks/menu/useContextMenu";

import { useWorkspace } from "@/context/WorkspaceContext";

import { canMoveTo } from "@/core/move";
import { getCommandItems } from "@/core/commands";

import styles from "./Pane.module.css";

type PathBarProps = {
  path: string | null;
  onSelect: () => void;
};

const PathBar = ({ path, onSelect }: PathBarProps) => (
  <header className={styles.header}>
    <p className={styles.path}>{path ?? "No folder selected"}</p>
    <TextButton onClick={onSelect}>select folder</TextButton>
  </header>
);

type PaneProps = {
  pane: PaneState;
  onOpenFolder: (path: string) => void;
};

export const Pane = ({ pane, onOpenFolder }: PaneProps) => {
  const workspace = useWorkspace();
  const { selection, operations } = workspace;

  const naming = useNaming(
    pane,
    (name) => operations.newFolder(pane, name),
    operations.rename,
  );

  const drop = useDrop({
    entries: (entries) =>
      canMoveTo(entries, pane) && (() => operations.move(entries, pane.path!)),
  });

  const context = { workspace, pane, naming, openFolder: onOpenFolder };

  const paneCommands = getCommandItems(
    ["newFolder", "selectAll", "clear", "moveHere", "delete"],
    {
      ...context,
      entries: pane.entries,
      selected: selection.selectedIn(pane.entries),
    },
  );

  const entryCommands = (entry: Entry) =>
    getCommandItems(["open", "rename", "toggleSelect", "delete"], {
      ...context,
      entries: [entry],
      selected: selection.targetsFor(entry, pane.entries),
    });

  const menu = useContextMenu(() => paneCommands);

  const handleSelect = async () => {
    const selectedPath = await selectFolder();
    if (!selectedPath) return;
    onOpenFolder(selectedPath);
  };

  return (
    <section
      className={styles.pane}
      data-drop={drop.isOver}
      {...drop.props}
      {...menu}
    >
      <PathBar path={pane.path} onSelect={handleSelect} />
      <FileTable
        entries={naming.entries}
        columns={DEFAULT_COLUMNS}
        isSelected={selection.isSelected}
        getDragged={(entry) => selection.targetsFor(entry, pane.entries)}
        naming={naming}
        onRowClick={selection.toggle}
        getRowCommands={entryCommands}
      />
      <ActionBar items={paneCommands} />
    </section>
  );
};
