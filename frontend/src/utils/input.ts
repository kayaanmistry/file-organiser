import type { WheelEvent } from "react";

// mouse wheel scroll vertical
export const scrollSideways = (e: WheelEvent<HTMLElement>) => {
  e.currentTarget.scrollLeft += e.deltaY;
};
