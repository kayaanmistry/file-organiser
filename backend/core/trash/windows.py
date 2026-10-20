import shutil
from pathlib import Path

from send2trash import send2trash


def _bin_items(drive: str) -> set[Path]:
    return set(Path(f"{drive}\\$Recycle.Bin").glob("*/$R*"))


def trash(path: Path) -> Path:
    original = path.resolve()
    before = _bin_items(original.drive)
    send2trash(original)
    new = _bin_items(original.drive) - before

    if len(new) != 1:
        raise FileNotFoundError(f"Couldn't find {original.name} in bin")
    return new.pop()


def restore(binned: Path, original: Path) -> None:
    shutil.move(binned, original)
    binned.with_name("$I" + binned.name[2:]).unlink()