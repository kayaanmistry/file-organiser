import type { CommandItem } from "@/core/commands";

export type Menu = {
  x: number;
  y: number;
  items: CommandItem[];
};

let menu: Menu | null = null;

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const getMenu = () => menu;

export const openMenu = (next: Menu) => {
  menu = next;
  emit();
};

export const closeMenu = () => {
  if (!menu) return;
  menu = null;
  emit();
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
