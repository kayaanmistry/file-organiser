from core.history import history

class HistoryApi:
    def undo(self) -> None:
        history.undo()
    
    def redo(self) -> None:
        history.redo()

    def undo_label(self) -> str | None:
        return history.undo_label()

    def redo_label(self) -> str | None:
        return history.redo_label()