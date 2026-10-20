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

INVALID_CHARS = '/\\:*?"<>|'
RESERVED_NAMES = [".", ".."]

def check_name(name: str) -> None:
    if name == "":
        raise ValueError("Name can't be empty")
    if name in RESERVED_NAMES:
        raise ValueError(f"Name can't be {name}")
    if any(char in INVALID_CHARS for char in name):
        raise ValueError(f"Name can't contain any of {INVALID_CHARS}")

def check_can_move(source: Path, target: Path) -> None:
    if not source.exists():
        raise FileNotFoundError(f"Not found: {source}")
    if target.exists() and not target.samefile(source):
        raise FileExistsError(f"Already exists: {target}")

class MoveAction(Action):
    def __init__(self, paths: list[str], destination: str):
        self.paths = paths
        self.destination = destination
        self.moves: list[tuple[Path, Path]] = [] 

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
            check_can_move(source, target)
            if source.is_dir() and destination_path.is_relative_to(source.resolve()):
                raise ValueError(f"Cannot move a folder into itself: {source}")

        for source, target in moves:
            shutil.move(source, target)

        self.moves = moves

    def undo(self) -> None:
        # check if source and target exists 
        for source, target in self.moves:
            for source, target in self.moves:
                check_can_move(target, source)

        for source, target in self.moves:
            shutil.move(target, source)

class NewFolderAction(Action):
    def __init__(self, parent: str, name: str):
        check_name(name)
        self.path = Path(parent) / name

    @property
    def label(self) -> str:
        return f"new folder {self.path.name}"

    def execute(self) -> None:
        self.path.mkdir()  

    def undo(self) -> None:
        self.path.rmdir() 

class RenameAction(Action):
    def __init__(self, path: str, name: str):
        check_name(name)
        self.source = Path(path)
        self.target = self.source.with_name(name)

    @property
    def label(self) -> str:
        return f"rename {self.source.name} to {self.target.name}"

    def execute(self) -> None:
        check_can_move(self.source, self.target)
        self.source.rename(self.target)

    def undo(self) -> None:
        check_can_move(self.target, self.source)
        self.target.rename(self.source)

