from .files import FilesApi
from .history import HistoryApi


class Api(FilesApi, HistoryApi):
    pass