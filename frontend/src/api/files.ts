import { call } from "./bridge";

export type Entry = {
  path: string;
  name: string;
  is_dir: boolean;
  ext: string;
  size: number;
  modified: number;
};

export const selectFolder = () =>
  call<string | null>({ name: "select_folder" });

export const listFiles = (path: string) =>
  call<Entry[]>({ name: "list_files", args: [path] });

export const moveFiles = (paths: string[], destination: string) =>
  call<void>({ name: "move_files", args: [paths, destination] });
