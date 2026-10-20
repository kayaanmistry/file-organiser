import shutil
from pathlib import Path

from Foundation import NSFileManager, NSURL


def trash(path: Path) -> Path:
    url = NSURL.fileURLWithPath_(str(path))
    ok, binned, error = NSFileManager.defaultManager().trashItemAtURL_resultingItemURL_error_(url, None, None)
    if not ok:
        raise OSError(f"Couldn't move to bin: {path} ({error.localizedDescription()})")
    return Path(binned.path())


def restore(binned: Path, original: Path) -> None:
    shutil.move(binned, original)