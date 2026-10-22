import type { DragEvent } from "react";
import { useId, useSyncExternalStore } from "react";

import type { DropAction, DropRules } from "./dragStore";
import {
  getDraggedItem,
  getHoveredTargetId,
  setHoveredTargetId,
  subscribe,
} from "./dragStore";

type Rule = (data: unknown) => DropAction;

export const useDrop = (rules: DropRules) => {
  const id = useId();
  const isOver = useSyncExternalStore(
    subscribe,
    () => getHoveredTargetId() === id,
  );

  const resolve = () => {
    const item = getDraggedItem();
    if (!item) return false;
    const rule = rules[item.kind] as Rule | undefined;
    return rule?.(item.data) ?? false;
  };

  const onDragOver = (e: DragEvent) => {
    if (e.defaultPrevented || !resolve()) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setHoveredTargetId(id);
  };

  const onDrop = (e: DragEvent) => {
    if (getHoveredTargetId() !== id) return;
    e.preventDefault();
    setHoveredTargetId(null);
    const run = resolve();
    if (run) run();
  };

  return { isOver, props: { onDragOver, onDrop } };
};
