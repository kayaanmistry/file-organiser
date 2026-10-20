from core.system import IS_MAC

if IS_MAC:
    from .mac import restore, trash
else:
    from .windows import restore, trash

__all__ = ["trash", "restore"]