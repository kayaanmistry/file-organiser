import type { Entry } from "@/api/files";
import type { TabRef } from "@/hooks/useGroups";

export type DropAction = (() => void) | false;

export type DragItem =
  | { kind: "entries"; data: Entry[] }
  | { kind: "tab"; data: TabRef };

export type DropRules = {
  entries?: (entries: Entry[]) => DropAction;
  tab?: (tab: TabRef) => DropAction;
};

let draggedItem: DragItem | null = null;
let hoveredTargetId: string | null = null;

const listeners = new Set<() => void>();

export const getDraggedItem = () => draggedItem;

export const getHoveredTargetId = () => hoveredTargetId;

export const setHoveredTargetId = (id: string | null) => {
  if (hoveredTargetId === id) return;
  hoveredTargetId = id;
  listeners.forEach((l) => l());
};

export const setDraggedItem = (item: DragItem | null) => {
  draggedItem = item;
  if (!item) setHoveredTargetId(null);
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

window.addEventListener("dragover", (e) => {
  if (!e.defaultPrevented) setHoveredTargetId(null);
});
