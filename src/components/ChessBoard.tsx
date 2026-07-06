import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";
import {
  ArenaChessState,
  ChessPieceView,
  getChessBoard
} from "../domain/games/chess";
import { ActionButton } from "./ActionButton";

interface ChessBoardProps {
  chess: ArenaChessState;
  onSquarePress: (square: string) => void;
  onUndo?: () => void;
}

const pieceSymbols: Record<string, string> = {
  wk: "♔",
  wq: "♕",
  wr: "♖",
  wb: "♗",
  wn: "♘",
  wp: "♙",
  bk: "♚",
  bq: "♛",
  br: "♜",
  bb: "♝",
  bn: "♞",
  bp: "♟"
};

export function ChessBoard({ chess, onSquarePress, onUndo }: ChessBoardProps) {
  const board = getChessBoard(chess.fen);
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - spacing.lg * 2, 360);
  const squareSize = boardSize / 8;

  return (
    <View style={styles.wrap}>
      <View style={[styles.board, { height: boardSize, width: boardSize }]}>
        {board.map((rank, rankIndex) => (
          <View key={`rank-${rankIndex}`} style={styles.rank}>
            {rank.map((piece, fileIndex) => {
              const square = piece?.square ?? getSquareName(rankIndex, fileIndex);
              const isDark = (rankIndex + fileIndex) % 2 === 1;
              const isSelected = chess.selectedSquare === square;
              const isLegalTarget = chess.legalTargets.includes(square);
              const isLastMove =
                chess.lastMove?.from === square || chess.lastMove?.to === square;

              return (
                <Pressable
                  key={square}
                  onPress={() => onSquarePress(square)}
                  style={[
                    styles.square,
                    {
                      backgroundColor: isDark ? colors.chessDark : colors.chessLight,
                      height: squareSize,
                      width: squareSize
                    },
                    isSelected ? styles.selectedSquare : undefined,
                    isLastMove ? styles.lastMoveSquare : undefined
                  ]}
                >
                  {isCoordinateSquare(rankIndex, fileIndex) ? (
                    <Text
                      style={[
                        styles.coordinate,
                        { color: isDark ? "rgba(255, 247, 234, 0.68)" : "rgba(17, 16, 14, 0.58)" }
                      ]}
                    >
                      {getCoordinateLabel(rankIndex, fileIndex)}
                    </Text>
                  ) : null}
                  {piece ? <Piece piece={piece} size={squareSize} /> : null}
                  {isLegalTarget ? <View style={styles.legalDot} /> : null}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <View style={styles.metaBlock}>
          <Text style={styles.turnText}>{chess.turn === "w" ? "White" : "Black"} to move</Text>
          <Text style={styles.metaText}>
            {chess.moveHistory.length === 0
              ? "First move"
              : `${chess.moveHistory.length} move${chess.moveHistory.length === 1 ? "" : "s"}`}
          </Text>
        </View>
        {onUndo ? (
          <ActionButton
            title="Undo"
            icon="arrow-undo"
            compact
            variant="secondary"
            disabled={chess.moveHistory.length === 0}
            onPress={onUndo}
          />
        ) : null}
      </View>
      {chess.lastMove ? (
        <Text style={styles.lastMove}>Last move: {chess.lastMove.san}</Text>
      ) : null}
      {chess.result ? <Text style={styles.result}>{chess.result}</Text> : null}
    </View>
  );
}

function Piece({ piece, size }: { piece: ChessPieceView; size: number }) {
  const symbol = pieceSymbols[`${piece.color}${piece.type}`];

  return (
    <Text
      style={[
        styles.piece,
        {
          color: piece.color === "w" ? "#FFF4DA" : "#15110D",
          fontSize: Math.max(26, size * 0.72)
        }
      ]}
    >
      {symbol}
    </Text>
  );
}

function getSquareName(rankIndex: number, fileIndex: number) {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return `${files[fileIndex]}${8 - rankIndex}`;
}

function isCoordinateSquare(rankIndex: number, fileIndex: number) {
  return fileIndex === 0 || rankIndex === 7;
}

function getCoordinateLabel(rankIndex: number, fileIndex: number) {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const labels = [];

  if (fileIndex === 0) {
    labels.push(String(8 - rankIndex));
  }

  if (rankIndex === 7) {
    labels.push(files[fileIndex]);
  }

  return labels.join("");
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: spacing.md
  },
  board: {
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 2,
    overflow: "hidden"
  },
  rank: {
    flexDirection: "row"
  },
  square: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  selectedSquare: {
    borderColor: colors.amber,
    borderWidth: 3
  },
  lastMoveSquare: {
    shadowColor: colors.teal,
    shadowOpacity: 0.6,
    shadowRadius: 8
  },
  legalDot: {
    backgroundColor: "rgba(17, 16, 14, 0.34)",
    borderRadius: radii.full,
    height: 14,
    position: "absolute",
    width: 14
  },
  piece: {
    fontWeight: "900",
    textShadowColor: "rgba(0, 0, 0, 0.24)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2
  },
  coordinate: {
    fontSize: 9,
    fontWeight: "900",
    left: 3,
    position: "absolute",
    top: 2
  },
  panel: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    padding: spacing.md,
    width: "100%"
  },
  metaBlock: {
    flex: 1,
    gap: spacing.xs
  },
  turnText: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "900"
  },
  metaText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "800"
  },
  lastMove: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700"
  },
  result: {
    color: colors.green,
    fontSize: typography.body,
    fontWeight: "900"
  }
});
