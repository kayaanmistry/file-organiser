import sys

IS_WINDOWS = sys.platform == "win32"
IS_MAC = sys.platform == "darwin"

if not (IS_WINDOWS or IS_MAC):
    raise RuntimeError(f"Unsupported OS: {sys.platform}")