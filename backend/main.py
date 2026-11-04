import sys
from pathlib import Path

import webview

from api import Api

FRONTEND = Path(getattr(sys, "_MEIPASS", Path(__file__).parent.parent / "frontend"))


def run(url: str):
    webview.create_window("File Organiser", url, js_api=Api(), width=800, height=600)
    webview.start()


if __name__ == "__main__":
    run(str(FRONTEND / "dist" / "index.html"))