import { useState } from "react";

import type { Entry } from "@/api/files";

export const useSelection = () => {
  const [selected, setSelected] = useState<Entry[]>([]);

  const toggle = (entry: Entry) => {
    setSelected((current) => {
      const isSelected = current.some((e) => e.path === entry.path);
      if (isSelected) return current.filter((e) => e.path !== entry.path);
      return [...current, entry];
    });
  };

  const clear = () => setSelected([]);

  return { entries: selected, toggle, clear };
};
