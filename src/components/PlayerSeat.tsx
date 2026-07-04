import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";
import { ArenaPlayer, RoomSeat } from "../domain/rooms/types";

interface PlayerSeatProps {
  seat?: RoomSeat;
  player?: ArenaPlayer;
  label: string;
}

export function PlayerSeat({ seat, player, label }: PlayerSeatProps) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.avatar,
          { backgroundColor: player?.avatarColor ?? colors.surfaceRaised }
        ]}
      >
        {player ? (
          <Text style={styles.avatarText}>{player.displayName.slice(0, 1)}</Text>
        ) : (
          <Ionicons name="add" color={colors.textMuted} size={20} />
        )}
      </View>
      <View style={styles.copy}>
        <Text style={styles.label}>{seat?.label ?? label}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {player?.displayName ?? "Open seat"}
        </Text>
        <Text style={styles.meta}>
          {player ? `${player.rating} rating · ${player.region}` : "Waiting for player"}
        </Text>
      </View>
      {seat ? (
        <View
          style={[
            styles.readyDot,
            { backgroundColor: seat.isReady ? colors.green : colors.border }
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  avatar: {
    alignItems: "center",
    borderRadius: radii.md,
    height: 46,
    justifyContent: "center",
    width: 46
  },
  avatarText: {
    color: colors.black,
    fontSize: typography.subheading,
    fontWeight: "900"
  },
  copy: {
    flex: 1,
    gap: 2
  },
  label: {
    color: colors.textSubtle,
    fontSize: typography.small,
    fontWeight: "800"
  },
  name: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800"
  },
  meta: {
    color: colors.textMuted,
    fontSize: typography.small
  },
  readyDot: {
    borderRadius: radii.full,
    height: 12,
    width: 12
  }
});
