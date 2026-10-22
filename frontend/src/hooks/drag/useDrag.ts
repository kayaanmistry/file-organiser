import type { DragEvent } from "react";

import type { DragItem } from "./dragStore";
import { setDraggedItem } from "./dragStore";

export const useDrag = (item: DragItem, enabled = true) => ({
  draggable: enabled,
  onDragStart: (e: DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
    setDraggedItem(item);
  },
  onDragEnd: () => setDraggedItem(null),
});
