import { call } from "./bridge";

export type Entry = {
  path: string;
  name: string;
  is_dir: boolean;
  ext: string;
  size: number;
  modified: number;
};

export const selectFolder = () => call<string | null>("select_folder");
export const listFiles = (path: string) => call<Entry[]>("list_files", path);
