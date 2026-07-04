import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useReducer
} from "react";

import {
  ArenaAction,
  arenaReducer,
  ArenaState,
  initialArenaState
} from "../domain/rooms/roomReducer";

interface ArenaContextValue {
  state: ArenaState;
  dispatch: React.Dispatch<ArenaAction>;
}

const ArenaContext = createContext<ArenaContextValue | undefined>(undefined);

export function ArenaProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(arenaReducer, initialArenaState);
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <ArenaContext.Provider value={value}>{children}</ArenaContext.Provider>;
}

export function useArena() {
  const context = useContext(ArenaContext);

  if (!context) {
    throw new Error("useArena must be used inside ArenaProvider.");
  }

  return context;
}
