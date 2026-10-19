import { useEffect, useState } from "react";

import { undo, undoLabel, redo, redoLabel } from "@/api/history";

const getState = async () => ({
  canUndo: (await undoLabel()) !== null,
  canRedo: (await redoLabel()) !== null,
});

export const useHistory = (onChange: () => Promise<void>) => {
  const [state, setState] = useState({ canUndo: false, canRedo: false });

  useEffect(() => {
    getState().then(setState);
  }, []);

  const refresh = async () => setState(await getState());

  const undoLast = async () => {
    await undo();
    await onChange();
    await refresh();
  };

  const redoLast = async () => {
    await redo();
    await onChange();
    await refresh();
  };

  return { ...state, refresh, undo: undoLast, redo: redoLast };
};

export type UseHistoryReturn = ReturnType<typeof useHistory>;
