import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";
import {
  ArenaChessState,
  ChessPieceView,
  getChessBoard
} from "../domain/games/chess";

interface ChessBoardProps {
  chess: ArenaChessState;
  onSquarePress: (square: string) => void;
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

export function ChessBoard({ chess, onSquarePress }: ChessBoardProps) {
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
                  {piece ? <Piece piece={piece} /> : null}
                  {isLegalTarget ? <View style={styles.legalDot} /> : null}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Turn: {chess.turn === "w" ? "White" : "Black"}</Text>
        <Text style={styles.metaText}>
          Moves: {chess.moveHistory.length === 0 ? "0" : chess.moveHistory.length}
        </Text>
      </View>
      {chess.lastMove ? (
        <Text style={styles.lastMove}>Last move: {chess.lastMove.san}</Text>
      ) : null}
      {chess.result ? <Text style={styles.result}>{chess.result}</Text> : null}
    </View>
  );
}

function Piece({ piece }: { piece: ChessPieceView }) {
  const symbol = pieceSymbols[`${piece.color}${piece.type}`];

  return (
    <Text style={[styles.piece, { color: piece.color === "w" ? "#FFF4DA" : "#15110D" }]}>
      {symbol}
    </Text>
  );
}

function getSquareName(rankIndex: number, fileIndex: number) {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  return `${files[fileIndex]}${8 - rankIndex}`;
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
    justifyContent: "center"
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
    fontSize: 35,
    fontWeight: "900",
    textShadowColor: "rgba(0, 0, 0, 0.24)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2
  },
  metaRow: {
    flexDirection: "row",
    gap: spacing.md
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
