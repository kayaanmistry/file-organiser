import stat
import shutil

from pathlib import Path
from typing import TypedDict

from core.history import Action

IGNORED = {".DS_Store", "Thumbs.db", "desktop.ini"}

class Entry(TypedDict):
    path: str
    name: str
    parent: str
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
            "parent": str(p.parent),
            "is_dir": is_dir,
            "ext": "" if is_dir else p.suffix.lower(),
            "size": info.st_size,
            "modified": info.st_mtime,
        })
    return entries

class MoveAction(Action):
    def __init__(self, paths: list[str], destination: str):
        self.paths = paths
        self.destination = destination
        self.moves: list[tuple[Path, Path]] = []  # (original, new)

    @property
    def label(self) -> str:
        return f"move {len(self.paths)} item(s)"

    def execute(self) -> None:
        destination_path = Path(self.destination)

        # check if directory exists
        if not destination_path.is_dir():
            raise FileNotFoundError(f"Destination not found: {self.destination}")

        moves = []
        for p in self.paths:
            source = Path(p)
            target = destination_path / source.name
            moves.append((source , target))

        # check if source exists and target doesnt already exists in destination
        for source, target in moves:
            if not source.exists():
                raise FileNotFoundError(f"Source not found: {source}")
            if source.is_dir() and destination_path.is_relative_to(source.resolve()):
                raise ValueError(f"Cannot move a folder into itself: {source}")
            if target.exists():
                raise FileExistsError(f"Already exists: {target}")

        for source, target in moves:
            shutil.move(source, target)

        self.moves = moves

    def undo(self) -> None:
        
        # check if source and target exists 
        for source, target in self.moves:
            if not target.exists():
                raise FileNotFoundError(f"Not found: {target}")
            if source.exists():
                raise FileExistsError(f"Already exists: {source}")

        for source, target in self.moves:
            shutil.move(target, source)

