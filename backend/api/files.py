import webview

from core.files import  Entry, list_entries, move_entries

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
        move_entries(paths, destination)


