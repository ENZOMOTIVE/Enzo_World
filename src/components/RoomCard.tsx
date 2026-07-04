import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";
import { getArenaGame } from "../domain/games/catalog";
import { ArenaPlayer, GameRoom } from "../domain/rooms/types";
import { StatusPill } from "./StatusPill";

interface RoomCardProps {
  room: GameRoom;
  players: Record<string, ArenaPlayer>;
  onPress: () => void;
}

export function RoomCard({ room, players, onPress }: RoomCardProps) {
  const game = getArenaGame(room.gameId);
  const seatLabel = `${room.seats.length}/${room.maxPlayers}`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: pressed ? game?.accentColor ?? colors.amber : colors.border }
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{room.title}</Text>
          <Text style={styles.meta}>
            {game?.shortName ?? room.gameId} · {room.code} · {room.visibility}
          </Text>
        </View>
        <StatusPill status={room.status} />
      </View>

      <View style={styles.infoRow}>
        <Info icon="people-outline" value={seatLabel} />
        <Info icon="eye-outline" value={`${room.spectators}`} />
        <Info icon="cash-outline" value={room.buyInCoins === 0 ? "Free" : `${room.buyInCoins}`} />
      </View>

      <View style={styles.playersRow}>
        {room.seats.map((seat) => {
          const player = players[seat.playerId];
          return (
            <View key={seat.playerId} style={styles.playerChip}>
              <View
                style={[
                  styles.avatarDot,
                  { backgroundColor: player?.avatarColor ?? colors.border }
                ]}
              />
              <Text style={styles.playerName} numberOfLines={1}>
                {player?.displayName ?? "Player"}
              </Text>
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}

function Info({
  icon,
  value
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  value: string;
}) {
  return (
    <View style={styles.infoItem}>
      <Ionicons name={icon} size={15} color={colors.textMuted} />
      <Text style={styles.infoText}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.md
  },
  topRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xs
  },
  title: {
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: "800"
  },
  meta: {
    color: colors.textSubtle,
    fontSize: typography.small,
    fontWeight: "700"
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  infoItem: {
    alignItems: "center",
    backgroundColor: colors.surfaceRaised,
    borderRadius: radii.full,
    flexDirection: "row",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  infoText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "800"
  },
  playersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  playerChip: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    maxWidth: 132
  },
  avatarDot: {
    borderRadius: radii.full,
    height: 10,
    width: 10
  },
  playerName: {
    color: colors.textMuted,
    flexShrink: 1,
    fontSize: typography.small,
    fontWeight: "800"
  }
});
