import { call } from "./bridge";

export const undo = () => call<void>({ name: "undo" });

export const redo = () => call<void>({ name: "redo" });

export const undoLabel = () => call<string | null>({ name: "undo_label" });

export const redoLabel = () => call<string | null>({ name: "redo_label" });
