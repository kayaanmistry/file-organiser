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

// true if name matches any taken name
export const isNameTaken = (name: string, taken: string[]) => {
  for (const t of taken) {
    if (t.toLowerCase() === name.toLowerCase()) return true;
  }

  return false;
};

// creates unique default names
export const uniqueName = (base: string, taken: string[]) => {
  let name = base;
  let count = 2;

  while (isNameTaken(name, taken)) {
    name = `${base} ${count}`;
    count++;
  }

  return name;
};
