import { useState } from "react";

import type { Entry } from "@/api/files";

export const useSelection = () => {
  const [selected, setSelected] = useState<Entry[]>([]);

  const paths = new Set(selected.map((e) => e.path));
  const isSelected = (entry: Entry) => paths.has(entry.path);
  const selectedIn = (entries: Entry[]) => entries.filter(isSelected);

  const targetsFor = (entry: Entry, entries: Entry[]) =>
    isSelected(entry) ? selectedIn(entries) : [entry];

  const toggle = (entry: Entry) => {
    setSelected((current) => {
      const isSelected = current.some((e) => e.path === entry.path);
      if (isSelected) return current.filter((e) => e.path !== entry.path);
      return [...current, entry];
    });
  };

  const add = (entries: Entry[]) => {
    setSelected((current) => {
      const paths = new Set(current.map((e) => e.path));
      return [...current, ...entries.filter((e) => !paths.has(e.path))];
    });
  };

  const remove = (entries: Entry[]) => {
    setSelected((current) => {
      const paths = new Set(entries.map((e) => e.path));
      return current.filter((e) => !paths.has(e.path));
    });
  };

  const clear = () => setSelected([]);

  return {
    entries: selected,
    isSelected,
    selectedIn,
    targetsFor,
    toggle,
    add,
    remove,
    clear,
  };
};

export type UseSelectionReturn = ReturnType<typeof useSelection>;
