import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";
import { ArenaCarromState, CarromCoin } from "../domain/games/carrom";
import { ArenaPlayer } from "../domain/rooms/types";
import { ActionButton } from "./ActionButton";

interface CarromBoardProps {
  carrom: ArenaCarromState;
  players: Record<string, ArenaPlayer>;
  onCoinPress: (coinId: string) => void;
  onPowerChange: (power: number) => void;
  onShoot: () => void;
}

const powerOptions = [
  { label: "Soft", value: 35 },
  { label: "Good", value: 60 },
  { label: "Hard", value: 82 },
  { label: "Smash", value: 100 }
];

export function CarromBoard({
  carrom,
  players,
  onCoinPress,
  onPowerChange,
  onShoot
}: CarromBoardProps) {
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - spacing.lg * 2, 324);
  const activePlayer = players[carrom.activePlayerId];
  const selectedCoin = carrom.coins.find(
    (coin) => coin.id === carrom.selectedCoinId && !coin.pocketedBy
  );
  const aimLine = selectedCoin ? getAimLine(boardSize, carrom.strikerX, selectedCoin) : undefined;
  const winner = carrom.winnerId ? players[carrom.winnerId] : undefined;

  return (
    <View style={styles.wrap}>
      <View style={[styles.board, { height: boardSize, width: boardSize }]}>
        <Pocket top={10} left={10} />
        <Pocket top={10} right={10} />
        <Pocket bottom={10} left={10} />
        <Pocket bottom={10} right={10} />
        <View style={styles.centerRing} />
        <View style={styles.baseLine} />
        {aimLine ? (
          <View
            style={[
              styles.aimLine,
              {
                left: aimLine.left,
                top: aimLine.top,
                transform: [{ rotate: `${aimLine.angle}rad` }],
                width: aimLine.length
              }
            ]}
          />
        ) : null}
        <View style={[styles.striker, { left: `${carrom.strikerX}%` }]} />
        {carrom.coins.map((coin) => (
          <CoinView
            key={coin.id}
            coin={coin}
            selected={coin.id === selectedCoin?.id}
            onPress={() => onCoinPress(coin.id)}
          />
        ))}
      </View>

      <View style={styles.scoreRow}>
        {carrom.turnOrder.map((playerId) => (
          <View
            key={playerId}
            style={[
              styles.scoreCard,
              playerId === carrom.activePlayerId ? styles.activeScoreCard : undefined
            ]}
          >
            <Text style={styles.scoreName} numberOfLines={1}>
              {players[playerId]?.displayName ?? "Player"}
            </Text>
            <Text style={styles.scoreValue}>{carrom.scores[playerId] ?? 0}</Text>
          </View>
        ))}
      </View>

      <View style={styles.controlPanel}>
        <Text style={styles.activePlayer}>
          Turn: {activePlayer?.displayName ?? "Waiting"}
        </Text>
        <Text style={styles.targetText}>
          Target: {selectedCoin ? coinLabel(selectedCoin.color) : carrom.result ? "Board clear" : "Pick coin"}
        </Text>
        <View style={styles.powerRow}>
          {powerOptions.map((power) => (
            <Pressable
              key={power.value}
              onPress={() => onPowerChange(power.value)}
              style={[
                styles.powerButton,
                carrom.power === power.value ? styles.powerButtonActive : undefined
              ]}
            >
              <Text
                style={[
                  styles.powerText,
                  carrom.power === power.value ? styles.powerTextActive : undefined
                ]}
              >
                {power.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <ActionButton
          title="Shoot"
          icon="navigate"
          disabled={!selectedCoin || Boolean(carrom.result)}
          onPress={onShoot}
        />
        {carrom.lastShot ? <Text style={styles.lastShot}>{carrom.lastShot}</Text> : null}
        {carrom.result ? (
          <Text style={styles.result}>
            {winner ? `${winner.displayName} wins.` : carrom.result}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function Pocket({
  top,
  right,
  bottom,
  left
}: {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}) {
  return <View style={[styles.pocket, { top, right, bottom, left }]} />;
}

function CoinView({
  coin,
  selected,
  onPress
}: {
  coin: CarromCoin;
  selected: boolean;
  onPress: () => void;
}) {
  if (coin.pocketedBy) {
    return null;
  }

  const palette = {
    white: { background: "#F7E8C9", border: "#FFFFFF" },
    black: { background: "#191510", border: "#5C5142" },
    queen: { background: colors.coral, border: "#FFD4CF" }
  }[coin.color];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.coin,
        selected ? styles.selectedCoin : undefined,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          left: `${coin.x}%`,
          top: `${coin.y}%`
        }
      ]}
    />
  );
}

function getAimLine(boardSize: number, strikerX: number, coin: CarromCoin) {
  const startX = (strikerX / 100) * boardSize;
  const startY = boardSize * 0.86;
  const endX = (coin.x / 100) * boardSize;
  const endY = (coin.y / 100) * boardSize;
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.max(24, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx);

  return {
    angle,
    left: startX - length / 2,
    length,
    top: startY - 1
  };
}

function coinLabel(color: CarromCoin["color"]) {
  if (color === "queen") {
    return "Queen";
  }

  return color === "white" ? "White" : "Black";
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: spacing.md
  },
  board: {
    backgroundColor: "#C9985B",
    borderColor: "#6F4422",
    borderRadius: radii.md,
    borderWidth: 8,
    overflow: "hidden"
  },
  pocket: {
    backgroundColor: colors.black,
    borderColor: "#E6B979",
    borderRadius: radii.full,
    borderWidth: 2,
    height: 36,
    position: "absolute",
    width: 36,
    zIndex: 2
  },
  centerRing: {
    alignSelf: "center",
    borderColor: "rgba(78, 45, 19, 0.45)",
    borderRadius: radii.full,
    borderWidth: 2,
    height: 92,
    position: "absolute",
    top: "36%",
    width: 92
  },
  baseLine: {
    alignSelf: "center",
    backgroundColor: "rgba(78, 45, 19, 0.5)",
    bottom: "17%",
    height: 4,
    position: "absolute",
    width: "70%"
  },
  striker: {
    backgroundColor: colors.teal,
    borderColor: colors.white,
    borderRadius: radii.full,
    borderWidth: 2,
    bottom: "14%",
    height: 28,
    marginLeft: -14,
    position: "absolute",
    width: 28,
    zIndex: 3
  },
  aimLine: {
    backgroundColor: "rgba(255, 247, 234, 0.55)",
    height: 3,
    position: "absolute",
    zIndex: 2
  },
  coin: {
    borderRadius: radii.full,
    borderWidth: 2,
    height: 24,
    marginLeft: -12,
    marginTop: -12,
    position: "absolute",
    width: 24,
    zIndex: 4
  },
  selectedCoin: {
    borderColor: colors.amber,
    borderWidth: 4,
    transform: [{ scale: 1.16 }]
  },
  scoreRow: {
    flexDirection: "row",
    gap: spacing.sm,
    width: "100%"
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md
  },
  activeScoreCard: {
    borderColor: colors.teal
  },
  scoreName: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "800"
  },
  scoreValue: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "900"
  },
  controlPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md,
    width: "100%"
  },
  activePlayer: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800"
  },
  targetText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: "700"
  },
  powerRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  powerButton: {
    alignItems: "center",
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    minHeight: 42,
    justifyContent: "center"
  },
  powerButtonActive: {
    backgroundColor: colors.teal,
    borderColor: colors.teal
  },
  powerText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: "900"
  },
  powerTextActive: {
    color: colors.black
  },
  lastShot: {
    color: colors.textMuted,
    fontSize: typography.body
  },
  result: {
    color: colors.green,
    fontSize: typography.body,
    fontWeight: "900"
  }
});
