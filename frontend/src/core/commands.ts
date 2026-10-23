import type { Entry } from "@/api/files";

import type { WorkspaceContextValue } from "@/context/WorkspaceContext";

import type { PaneState } from "@/hooks/useGroups";
import type { UseNamingReturn } from "@/hooks/useNaming";

import { canMoveTo } from "@/core/move";

export type CommandItem = {
  label: string;
  run: () => void;
  disabled?: boolean;
};

export type CommandContext = {
  workspace: WorkspaceContextValue;
  entries: Entry[];
  selected: Entry[];
  pane?: PaneState;
  naming?: UseNamingReturn;
  openFolder?: (path: string) => void;
};

type Command = {
  label: string | ((c: CommandContext) => string);
  run: (c: CommandContext) => void;
  disabled?: (c: CommandContext) => boolean;
};

export const commands = {
  // workspace
  newWindow: {
    label: "new window",
    run: (c) => c.workspace.groups.addGroup(),
  },
  undo: {
    label: "undo",
    run: (c) => c.workspace.history.undo(),
    disabled: (c) => !c.workspace.history.canUndo,
  },
  redo: {
    label: "redo",
    run: (c) => c.workspace.history.redo(),
    disabled: (c) => !c.workspace.history.canRedo,
  },

  // pane
  newFolder: {
    label: "new folder",
    run: (c) => c.naming!.startNewFolder(),
    disabled: (c) => !c.pane?.path || !!c.naming?.isEditing,
  },
  moveHere: {
    label: "move here",
    run: (c) =>
      c.workspace.operations.move(c.workspace.selection.entries, c.pane!.path!),
    disabled: (c) =>
      !c.pane || !canMoveTo(c.workspace.selection.entries, c.pane),
  },

  // selection
  selectAll: {
    label: "select all",
    run: (c) => c.workspace.selection.add(c.entries),
    disabled: (c) => c.entries.every(c.workspace.selection.isSelected),
  },
  clear: {
    label: "clear",
    run: (c) => c.workspace.selection.remove(c.entries),
    disabled: (c) => !c.entries.some(c.workspace.selection.isSelected),
  },
  toggleSelect: {
    label: (c) =>
      c.workspace.selection.isSelected(c.entries[0]) ? "deselect" : "select",
    run: (c) => c.workspace.selection.toggle(c.entries[0]),
  },

  // entries
  open: {
    label: "open",
    run: (c) => c.openFolder!(c.entries[0].path),
    disabled: (c) => !c.openFolder || !c.entries[0]?.is_dir,
  },
  rename: {
    label: "rename",
    run: (c) => c.naming!.onEdit(c.entries[0]),
    disabled: (c) => !c.naming || c.entries.length !== 1,
  },
  delete: {
    label: "delete",
    run: (c) => c.workspace.operations.remove(c.selected),
    disabled: (c) => c.selected.length === 0,
  },
} satisfies Record<string, Command>;

export type CommandId = keyof typeof commands;

export const getCommandItems = (
  ids: CommandId[],
  c: CommandContext,
): CommandItem[] =>
  ids.map((id) => {
    const command: Command = commands[id];
    return {
      label:
        typeof command.label === "function" ? command.label(c) : command.label,
      run: () => command.run(c),
      disabled: command.disabled?.(c),
    };
  });
