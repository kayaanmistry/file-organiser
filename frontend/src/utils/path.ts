// true if path is the folder itself or anywhere inside it
export const isInside = (path: string, folder: string) =>
  path === folder ||
  path.startsWith(folder + "\\") ||
  path.startsWith(folder + "/");
