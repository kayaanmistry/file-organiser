import stat

from pathlib import Path
from typing import TypedDict

IGNORED = {".DS_Store", "Thumbs.db", "desktop.ini"}

class Entry(TypedDict):
    name: str
    is_dir: bool
    ext: str
    size: int
    modified: float

def list_entries(path: str) -> list[Entry]:
    entries = []
    for p in Path(path).iterdir():
        if p.name in IGNORED:
            continue
        info = p.stat()
        entries.append({
            "name": p.name,
            "is_dir": stat.S_ISDIR(info.st_mode),
            "ext": p.suffix.lower(),
            "size": info.st_size,
            "modified": info.st_mtime,
        })
    return entries

print(list_entries('/Users/admin/Documents/work'))