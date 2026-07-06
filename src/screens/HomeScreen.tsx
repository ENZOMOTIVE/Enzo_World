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
  const openRooms = rooms.filter((room) => room.status === "waiting" || room.status === "ready");

  return (
    <Screen>
      <AppHeader
        title="Enzo Arena"
        subtitle="Pick a game and start playing."
      />

      <View style={styles.playList}>
        {arenaGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onPlay={() => dispatch({ type: "QUICK_PLAY", gameId: game.id })}
            onBrowseRooms={() => dispatch({ type: "SELECT_GAME", gameId: game.id })}
          />
        ))}
      </View>

      <Section
        title="Tables"
        action={
          <ActionButton
            title="See all"
            icon="people-outline"
            compact
            variant="secondary"
            onPress={() => dispatch({ type: "NAVIGATE", route: { name: "rooms" } })}
          />
        }
      >
        {openRooms.slice(0, 2).map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            players={state.players}
            onPress={() => dispatch({ type: "OPEN_ROOM", roomId: room.id })}
          />
        ))}
        {openRooms.length === 0 ? (
          <View style={styles.emptyTables}>
            <Text style={styles.emptyTitle}>No tables yet</Text>
            <ActionButton
              title="New table"
              icon="add"
              onPress={() => dispatch({ type: "NAVIGATE", route: { name: "create" } })}
            />
          </View>
        ) : null}
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  playList: {
    gap: spacing.md,
    marginBottom: spacing.xl
  },
  emptyTables: {
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg
  },
  emptyTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "900"
  }
});
