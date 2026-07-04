import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";
import { ArenaCarromState, CarromCoin } from "../domain/games/carrom";
import { ArenaPlayer } from "../domain/rooms/types";
import { ActionButton } from "./ActionButton";

interface CarromBoardProps {
  carrom: ArenaCarromState;
  players: Record<string, ArenaPlayer>;
  onPowerChange: (power: number) => void;
  onShoot: () => void;
}

const powerOptions = [35, 55, 75, 95];

export function CarromBoard({
  carrom,
  players,
  onPowerChange,
  onShoot
}: CarromBoardProps) {
  const { width } = useWindowDimensions();
  const boardSize = Math.min(width - spacing.lg * 2, 360);
  const activePlayer = players[carrom.activePlayerId];

  return (
    <View style={styles.wrap}>
      <View style={[styles.board, { height: boardSize, width: boardSize }]}>
        <Pocket top={10} left={10} />
        <Pocket top={10} right={10} />
        <Pocket bottom={10} left={10} />
        <Pocket bottom={10} right={10} />
        <View style={styles.centerRing} />
        <View style={styles.baseLine} />
        <View style={[styles.striker, { left: `${carrom.strikerX}%` }]} />
        {carrom.coins.map((coin) => (
          <CoinView key={coin.id} coin={coin} />
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
        <View style={styles.powerRow}>
          {powerOptions.map((power) => (
            <Pressable
              key={power}
              onPress={() => onPowerChange(power)}
              style={[
                styles.powerButton,
                carrom.power === power ? styles.powerButtonActive : undefined
              ]}
            >
              <Text
                style={[
                  styles.powerText,
                  carrom.power === power ? styles.powerTextActive : undefined
                ]}
              >
                {power}
              </Text>
            </Pressable>
          ))}
        </View>
        <ActionButton title="Shoot" icon="navigate" onPress={onShoot} />
        {carrom.lastShot ? <Text style={styles.lastShot}>{carrom.lastShot}</Text> : null}
        {carrom.result ? <Text style={styles.result}>{carrom.result}</Text> : null}
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

function CoinView({ coin }: { coin: CarromCoin }) {
  if (coin.pocketedBy) {
    return null;
  }

  const palette = {
    white: { background: "#F7E8C9", border: "#FFFFFF" },
    black: { background: "#191510", border: "#5C5142" },
    queen: { background: colors.coral, border: "#FFD4CF" }
  }[coin.color];

  return (
    <View
      style={[
        styles.coin,
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
