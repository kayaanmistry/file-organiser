import { useState } from "react";

import { listFiles } from "@/api/files";

import type { PaneState } from "@/components/Pane/Pane";

const INITIAL_SOURCE: PaneState = { id: "source", path: null, entries: [] };

export const useSource = () => {
  const [pane, setPane] = useState(INITIAL_SOURCE);

  const open = async (path: string) => {
    const entries = await listFiles(path);
    setPane((current) => ({ ...current, path, entries }));
  };

  return { ...pane, open };
};
