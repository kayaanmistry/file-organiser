import type { Entry } from "@/api/files";

import { Pane, type PaneState } from "@/components/Pane/Pane";

type SourcePaneProps = {
  pane: PaneState;
  selected: Entry[];
  onOpenFolder: (path: string) => void;
  onToggle: (entry: Entry) => void;
};

export const SourcePane = ({
  pane,
  selected,
  onOpenFolder,
  onToggle,
}: SourcePaneProps) => (
  <Pane
    title="source"
    pane={pane}
    selected={selected}
    onOpenFolder={onOpenFolder}
    onRowClick={onToggle}
  />
);
