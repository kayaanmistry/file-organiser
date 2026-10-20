import type { KeyboardEvent, WheelEvent } from "react";

// mouse wheel scroll vertical
export const scrollSideways = (e: WheelEvent<HTMLElement>) => {
  e.currentTarget.scrollLeft += e.deltaY;
};

// enter confirms, escape cancels
export const confirmOrCancel =
  (onConfirm: () => void, onCancel: () => void) =>
  (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") onConfirm();
    if (e.key === "Escape") onCancel();
  };
