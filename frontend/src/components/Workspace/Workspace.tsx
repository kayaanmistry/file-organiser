import { useState } from "react";

import { listFiles } from "@/api/files";
import { Pane, type PaneState } from "@/components/Pane/Pane";

import styles from "./Workspace.module.css";

const INITIAL_PANES: PaneState[] = [
  { id: "source", path: null, entries: [] },
  { id: "destination-1", path: null, entries: [] },
];

export const Workspace = () => {
  const [panes, setPanes] = useState(INITIAL_PANES);

  const updatePane = (id: string, changes: Partial<PaneState>) => {
    setPanes((current) =>
      current.map((pane) => {
        if (pane.id !== id) return pane;
        return { ...pane, ...changes };
      }),
    );
  };

  const navigate = async (id: string, path: string) => {
    const entries = await listFiles(path);
    updatePane(id, { path, entries });
  };

  return (
    <div className={styles.workspace}>
      {panes.map((pane) => (
        <Pane
          key={pane.id}
          pane={pane}
          onNavigate={(path) => navigate(pane.id, path)}
        />
      ))}
    </div>
  );
};
