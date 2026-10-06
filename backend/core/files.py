import stat

from pathlib import Path
from typing import TypedDict

IGNORED = {".DS_Store", "Thumbs.db", "desktop.ini"}

class Entry(TypedDict):
    path: str
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
        is_dir = stat.S_ISDIR(info.st_mode)
        entries.append({
            "path": str(p),
            "name": p.name,
            "is_dir": stat.S_ISDIR(info.st_mode),
            "ext": "" if is_dir else p.suffix.lower(),
            "size": info.st_size,
            "modified": info.st_mtime,
        })
    return entries
