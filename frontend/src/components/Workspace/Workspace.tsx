import { useState } from "react";

import { listFiles, moveFiles, type Entry } from "@/api/files";

import { type PaneState } from "@/components/Pane/Pane";
import { SourcePane } from "@/components/Pane/SourcePane/SourcePane";
import { DestinationPane } from "@/components/Pane/DestinationPane/DestinationPane";
import { SelectedFiles } from "@/components/SelectedFiles/SelectedFiles";

import styles from "./Workspace.module.css";

const INITIAL_SOURCE: PaneState = { id: "source", path: null, entries: [] };

const INITIAL_DESTINATIONS: PaneState[] = [
  { id: "destination-1", path: null, entries: [] },
  { id: "destination-2", path: null, entries: [] },
  { id: "destination-3", path: null, entries: [] },
];

export const Workspace = () => {
  const [source, setSource] = useState(INITIAL_SOURCE);
  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);
  const [selected, setSelected] = useState<Entry[]>([]);

  const openSource = async (path: string) => {
    const entries = await listFiles(path);
    setSource({ ...source, path, entries });
    setSelected([]);
  };

  const openDestination = async (id: string, path: string) => {
    const entries = await listFiles(path);
    setDestinations((current) =>
      current.map((pane) =>
        pane.id === id ? { ...pane, path, entries } : pane,
      ),
    );
  };

  const toggleSelected = (entry: Entry) => {
    setSelected((current) => {
      const isSelected = current.some((e) => e.path === entry.path);
      if (isSelected) return current.filter((e) => e.path !== entry.path);
      return [...current, entry];
    });
  };

  const moveHere = async (destination: PaneState) => {
    if (!source.path || !destination.path) return;

    await moveFiles(
      selected.map((e) => e.path),
      destination.path,
    );

    await Promise.all([
      openSource(source.path),
      openDestination(destination.id, destination.path),
    ]);
  };

  return (
    <div className={styles.workspace}>
      <div className={styles.panes}>
        <SourcePane
          pane={source}
          selected={selected}
          onOpenFolder={openSource}
          onToggle={toggleSelected}
        />
        <div className={styles.destinations}>
          {destinations.map((pane) => (
            <DestinationPane
              key={pane.id}
              pane={pane}
              canMove={selected.length > 0}
              onOpenFolder={(path) => openDestination(pane.id, path)}
              onMoveHere={() => moveHere(pane)}
            />
          ))}
        </div>
      </div>
      <SelectedFiles selected={selected} onRemove={toggleSelected} />
    </div>
  );
};
