import webview

from core.files import Entry, MoveAction, NewFolderAction, RenameAction, list_entries
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
    
    def create_folder(self, parent: str, name: str) -> None:
        history.run(NewFolderAction(parent, name))

    def rename_file(self, path: str, name: str) -> None:
        history.run(RenameAction(path, name))


