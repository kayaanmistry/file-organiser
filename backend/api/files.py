import webview

from core.files import  Entry, MoveAction, list_entries
from core.history import history

class FilesApi:
    def __init__(self):
        pass

    def select_folder(self) -> str | None:
        paths = webview.windows[0].create_file_dialog(webview.FileDialog.FOLDER)
        if paths:
            return paths[0]
        else: 
            return None

    def list_files(self, path: str) -> list[Entry]:
        return list_entries(path)

    def move_files(self, paths: list[str], destination: str) -> None:
        history.run(MoveAction(paths, destination))


