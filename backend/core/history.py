from abc import ABC, abstractmethod

class Action(ABC):

    @property
    @abstractmethod
    def label(self) -> str: 
        pass

    @abstractmethod
    def execute(self) -> None:
        pass

    @abstractmethod
    def undo(self) -> None: 
        pass 

class History:
    def __init__(self):
        self._undo_stack: list[Action] = []
        self._redo_stack: list[Action] = []

    def run(self, action: Action) -> None:
        action.execute()
        self._undo_stack.append(action)
        self._redo_stack.clear()

    def undo_label(self) -> str | None:
        if self._undo_stack:
            return self._undo_stack[-1].label
        return None

    def redo_label(self) -> str | None:
        if self._redo_stack:
            return self._redo_stack[-1].label
        return None

    def undo(self) -> None:
        if not self._undo_stack:
            return
        self._undo_stack[-1].undo()
        self._redo_stack.append(self._undo_stack.pop())

    def redo(self) -> None:
        if not self._redo_stack:
            return
        self._redo_stack[-1].execute()
        self._undo_stack.append(self._redo_stack.pop())


history = History()