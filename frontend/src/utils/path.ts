// true if path is the folder itself or anywhere inside it
export const isInside = (path: string, folder: string) => {
  if (path === folder) return true;
  if (path.startsWith(folder + "\\")) return true;
  if (path.startsWith(folder + "/")) return true;

  return false;
};

const INVALID_CHARS = '/\\:*?"<>|';
const RESERVED_NAMES = [".", ".."];

// true if name is usable as a file or folder name
export const isValidName = (name: string) => {
  if (name === "") return false;
  if (RESERVED_NAMES.includes(name)) return false;

  for (const char of name) {
    if (INVALID_CHARS.includes(char)) return false;
  }

  return true;
};
