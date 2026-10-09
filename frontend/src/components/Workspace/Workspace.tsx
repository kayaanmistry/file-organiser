import { moveFiles } from "@/api/files";

import { type PaneState } from "@/components/Pane/Pane";

import { SourcePane } from "@/components/Pane/SourcePane/SourcePane";
import { DestinationPane } from "@/components/Pane/DestinationPane/DestinationPane";
import { PaneTabs } from "@/components/PaneTabs/PaneTabs";
import { SelectedFiles } from "@/components/SelectedFiles/SelectedFiles";

import { useSource } from "@/hooks/useSource";
import { useDestinations } from "@/hooks/useDestination";
import { useSelection } from "@/hooks/useSelection";

import styles from "./Workspace.module.css";

type DestinationsProps = {
  destinations: ReturnType<typeof useDestinations>;
  canMove: boolean;
  onMoveHere: (target: PaneState) => void;
};

const Destinations = ({
  destinations,
  canMove,
  onMoveHere,
}: DestinationsProps) => {
  const { active } = destinations;

  return (
    <div className={styles.destinations}>
      <PaneTabs
        panes={destinations.panes}
        activeId={destinations.activeId}
        onSelect={destinations.setActiveId}
        onAdd={destinations.add}
        onRemove={destinations.remove}
      />
      <DestinationPane
        key={active.id}
        pane={active}
        canMove={canMove}
        onOpenFolder={(path) => destinations.open(active.id, path)}
        onMoveHere={() => onMoveHere(active)}
      />
    </div>
  );
};

export const Workspace = () => {
  const source = useSource();
  const destinations = useDestinations();
  const selection = useSelection();

  const openSource = async (path: string) => {
    await source.open(path);
    selection.clear();
  };

  const moveHere = async (target: PaneState) => {
    if (!source.path || !target.path) return;

    await moveFiles(
      selection.entries.map((e) => e.path),
      target.path,
    );

    await Promise.all([
      openSource(source.path),
      destinations.open(target.id, target.path),
    ]);
  };

  return (
    <div className={styles.workspace}>
      <div className={styles.panes}>
        <SourcePane
          pane={source}
          selected={selection.entries}
          onOpenFolder={openSource}
          onToggle={selection.toggle}
        />
        <Destinations
          destinations={destinations}
          canMove={selection.entries.length > 0}
          onMoveHere={moveHere}
        />
      </div>
      <SelectedFiles selected={selection.entries} onRemove={selection.toggle} />
    </div>
  );
};
