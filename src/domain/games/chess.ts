import { Chess, Square } from "chess.js";

export type ChessColor = "w" | "b";
export type ChessPieceType = "p" | "n" | "b" | "r" | "q" | "k";

export interface ChessPieceView {
  square: string;
  type: ChessPieceType;
  color: ChessColor;
}

export interface ArenaChessState {
  kind: "chess";
  fen: string;
  turn: ChessColor;
  selectedSquare?: string;
  legalTargets: string[];
  moveHistory: string[];
  lastMove?: {
    from: string;
    to: string;
    san: string;
  };
  result?: string;
}

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function createChessState(): ArenaChessState {
  const chess = new Chess();
  return stateFromChess(chess, []);
}

export function getChessBoard(fen: string): Array<Array<ChessPieceView | null>> {
  const chess = new Chess(fen);

  return chess.board().map((rank, rankIndex) =>
    rank.map((piece, fileIndex) => {
      if (!piece) {
        return null;
      }

      return {
        square: `${files[fileIndex]}${8 - rankIndex}`,
        type: piece.type as ChessPieceType,
        color: piece.color as ChessColor
      };
    })
  );
}

export function getChessLegalTargets(fen: string, square: string): string[] {
  try {
    const chess = new Chess(fen);
    return chess
      .moves({ square: square as Square, verbose: true })
      .map((move) => move.to);
  } catch {
    return [];
  }
}

export function selectChessSquare(
  state: ArenaChessState,
  square: string
): ArenaChessState {
  const legalTargets = getChessLegalTargets(state.fen, square);

  if (legalTargets.length === 0) {
    return {
      ...state,
      selectedSquare: undefined,
      legalTargets: []
    };
  }

  return {
    ...state,
    selectedSquare: square,
    legalTargets
  };
}

export function makeChessMove(
  state: ArenaChessState,
  from: string,
  to: string
): { nextState: ArenaChessState; event: string; error?: string } {
  try {
    const chess = new Chess(state.fen);
    const move = chess.move({
      from: from as Square,
      to: to as Square,
      promotion: "q"
    });

    if (!move) {
      return {
        nextState: {
          ...state,
          selectedSquare: undefined,
          legalTargets: []
        },
        event: "Illegal move rejected.",
        error: "Illegal move"
      };
    }

    const nextState = stateFromChess(chess, [...state.moveHistory, move.san]);
    nextState.lastMove = {
      from,
      to,
      san: move.san
    };

    return {
      nextState,
      event: `Chess move ${move.san} played.`
    };
  } catch {
    return {
      nextState: {
        ...state,
        selectedSquare: undefined,
        legalTargets: []
      },
      event: "Illegal move rejected.",
      error: "Illegal move"
    };
  }
}

function stateFromChess(chess: Chess, moveHistory: string[]): ArenaChessState {
  const result = getChessResult(chess);

  return {
    kind: "chess",
    fen: chess.fen(),
    turn: chess.turn() as ChessColor,
    legalTargets: [],
    moveHistory,
    result
  };
}

function getChessResult(chess: Chess) {
  if (chess.isCheckmate()) {
    return chess.turn() === "w"
      ? "Black wins by checkmate."
      : "White wins by checkmate.";
  }

  if (chess.isStalemate()) {
    return "Draw by stalemate.";
  }

  if (chess.isThreefoldRepetition()) {
    return "Draw by repetition.";
  }

  if (chess.isInsufficientMaterial()) {
    return "Draw by insufficient material.";
  }

  if (chess.isDraw()) {
    return "Draw.";
  }

  return undefined;
}
