import type { MouseEvent } from "react";

import type { CommandItem } from "@/core/commands";

import { closeMenu, openMenu } from "./menuStore";

export const useContextMenu = (getItems: () => CommandItem[]) => ({
  onContextMenu: (e: MouseEvent) => {
    if (e.defaultPrevented) return;
    e.preventDefault();

    const items = getItems();
    if (items.length === 0) return closeMenu();

    openMenu({ x: e.clientX, y: e.clientY, items });
  },
});
