import type { RefObject } from "react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";

import type { CommandItem } from "@/core/commands";

import type { Menu } from "@/hooks/menu/menuStore";
import { closeMenu, getMenu, subscribe } from "@/hooks/menu/menuStore";

import styles from "./ContextMenu.module.css";

const useCloseTriggers = (menu: Menu | null) => {
  useEffect(() => {
    if (!menu) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };

    window.addEventListener("mousedown", closeMenu);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("blur", closeMenu);
    window.addEventListener("resize", closeMenu);

    // stop listening once the menu closes
    return () => {
      window.removeEventListener("mousedown", closeMenu);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("blur", closeMenu);
      window.removeEventListener("resize", closeMenu);
    };
  }, [menu]);
};

const useKeepInWindow = (
  ref: RefObject<HTMLElement | null>,
  menu: Menu | null,
) => {
  useLayoutEffect(() => {
    const el = ref.current;
    if (!menu || !el) return;

    const { width, height } = el.getBoundingClientRect();
    el.style.left = `${Math.min(menu.x, window.innerWidth - width)}px`;
    el.style.top = `${Math.min(menu.y, window.innerHeight - height)}px`;
  }, [ref, menu]);
};

type MenuItemProps = {
  item: CommandItem;
};

const MenuItem = ({ item }: MenuItemProps) => (
  <button
    className={styles.item}
    disabled={item.disabled}
    onClick={() => {
      closeMenu();
      item.run();
    }}
  >
    {item.label}
  </button>
);

export const ContextMenu = () => {
  const menu = useSyncExternalStore(subscribe, getMenu);
  const ref = useRef<HTMLDivElement>(null);

  useCloseTriggers(menu);
  useKeepInWindow(ref, menu);

  if (!menu) return null;

  return (
    <div
      ref={ref}
      className={styles.menu}
      onMouseDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {menu.items.map((item) => (
        <MenuItem key={item.label} item={item} />
      ))}
    </div>
  );
};
