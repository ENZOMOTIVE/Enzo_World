import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";
import { ActionButton } from "../components/ActionButton";
import { AppHeader } from "../components/AppHeader";
import { GameCard } from "../components/GameCard";
import { RoomCard } from "../components/RoomCard";
import { Screen } from "../components/Screen";
import { Section } from "../components/Section";
import { arenaGames } from "../domain/games/catalog";
import { useArena } from "../state/ArenaProvider";

export function HomeScreen() {
  const { state, dispatch } = useArena();
  const rooms = Object.values(state.rooms);
  const currentUser = state.players[state.currentUserId];
  const liveRooms = rooms.filter((room) => room.status === "in_progress").length;
  const openRooms = rooms.filter((room) => room.status === "waiting" || room.status === "ready");

  return (
    <Screen>
      <AppHeader
        title="Enzo Arena"
        subtitle="Board-game rooms, match flow, and local multiplayer simulation for Android-first launch."
        actionIcon="add"
        actionLabel="Create"
        onAction={() => dispatch({ type: "NAVIGATE", route: { name: "create" } })}
      />

      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.heroKicker}>Wallet</Text>
          <Text style={styles.heroTitle}>{currentUser?.coins ?? 0} coins</Text>
          <Text style={styles.heroText}>
            {currentUser?.displayName ?? "Player"} · {currentUser?.rating ?? 0} rating
          </Text>
        </View>
        <View style={styles.heroIcon}>
          <Ionicons name="trophy" size={42} color={colors.black} />
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat label="Players" value={String(Object.keys(state.players).length)} />
        <Stat label="Live" value={String(liveRooms)} />
        <Stat label="Open" value={String(openRooms.length)} />
      </View>

      <View style={styles.quickActions}>
        <ActionButton
          title="Browse games"
          icon="grid-outline"
          onPress={() => dispatch({ type: "NAVIGATE", route: { name: "games" } })}
        />
        <ActionButton
          title="Open rooms"
          icon="people-outline"
          variant="secondary"
          onPress={() => dispatch({ type: "NAVIGATE", route: { name: "rooms" } })}
        />
      </View>

      <Section title="Featured Games">
        {arenaGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onPress={() => dispatch({ type: "SELECT_GAME", gameId: game.id })}
          />
        ))}
      </Section>

      <Section title="Open Rooms">
        {openRooms.slice(0, 3).map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            players={state.players}
            onPress={() => dispatch({ type: "OPEN_ROOM", roomId: room.id })}
          />
        ))}
      </Section>
    </Screen>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    marginBottom: spacing.md,
    padding: spacing.lg
  },
  heroCopy: {
    flex: 1,
    gap: spacing.xs
  },
  heroKicker: {
    color: colors.amber,
    fontSize: typography.small,
    fontWeight: "900"
  },
  heroTitle: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900"
  },
  heroText: {
    color: colors.textMuted,
    fontSize: typography.body
  },
  heroIcon: {
    alignItems: "center",
    backgroundColor: colors.amber,
    borderRadius: radii.md,
    height: 72,
    justifyContent: "center",
    width: 72
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  stat: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md
  },
  statValue: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "900"
  },
  statLabel: {
    color: colors.textSubtle,
    fontSize: typography.small,
    fontWeight: "800"
  },
  quickActions: {
    gap: spacing.sm,
    marginBottom: spacing.xl
  }
});
