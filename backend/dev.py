import socket
import subprocess
import time
from pathlib import Path

from main import run

PORT = 5173
FRONTEND = Path(__file__).parent.parent / "frontend"

def wait_for_server():
    while True:
        try:
            socket.create_connection(("localhost", PORT), timeout=1).close()
            return
        except OSError:
            time.sleep(0.2)

if __name__ == "__main__":
    vite = subprocess.Popen(
        ["node", "node_modules/vite/bin/vite.js", "--port", str(PORT), "--strictPort"],
        cwd=FRONTEND,
    )
    try:
        wait_for_server()
        run(f"http://localhost:{PORT}")
    finally:
        vite.terminate()