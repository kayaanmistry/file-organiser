import stat
import shutil

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
            "is_dir": is_dir,
            "ext": "" if is_dir else p.suffix.lower(),
            "size": info.st_size,
            "modified": info.st_mtime,
        })
    return entries

def move_entries(paths: list[str], destination: str) -> None:
    destination_path = Path(destination)

    # check if directory exists
    if not destination_path.is_dir():
        raise FileNotFoundError(f"Destination not found: {destination}")

    moves = []
    for p in paths:
        source = Path(p)
        target = destination_path / source.name
        moves.append((source , target))

    # check if source exists and target doesnt already exists in destination
    for source, target in moves:
        if not source.exists():
            raise FileNotFoundError(f"Source not found: {source}")
        if target.exists():
            raise FileExistsError(f"Already exists: {target}")
    
    for source, target in moves: 
        shutil.move(source, target)

