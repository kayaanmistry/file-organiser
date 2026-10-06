const SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"];

export const formatType = (ext: string) => ext.slice(1);

export const formatName = (name: string, ext: string) => {
  if (!ext) return name;

  const nameLength = name.length - ext.length;
  return name.slice(0, nameLength);
};

export const formatDate = (seconds: number) => {
  const date = new Date(seconds * 1000);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  return `${day}-${month}-${year}`;
};

export const formatSize = (bytes: number) => {
  let size = bytes;
  let unit = 0;

  while (size >= 1024 && unit < SIZE_UNITS.length - 1) {
    size /= 1024;
    unit++;
  }

  const decimals = unit === 0 ? 0 : 1;
  return `${size.toFixed(decimals)} ${SIZE_UNITS[unit]}`;
};
