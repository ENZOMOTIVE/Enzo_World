import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";
import { ActionButton } from "../components/ActionButton";
import { AppHeader } from "../components/AppHeader";
import { RoomCard } from "../components/RoomCard";
import { Screen } from "../components/Screen";
import { arenaGames, GameId, getArenaGame } from "../domain/games/catalog";
import { ArenaRoute } from "../domain/rooms/roomReducer";
import { useArena } from "../state/ArenaProvider";

interface RoomsScreenProps {
  route: Extract<ArenaRoute, { name: "rooms" }>;
}

export function RoomsScreen({ route }: RoomsScreenProps) {
  const { state, dispatch } = useArena();
  const selectedGameId = route.gameId;
  const rooms = Object.values(state.rooms).filter((room) =>
    selectedGameId ? room.gameId === selectedGameId : true
  );
  const game = selectedGameId ? getArenaGame(selectedGameId) : undefined;

  return (
    <Screen>
      <AppHeader
        title={game ? `${game.shortName} Rooms` : "Rooms"}
        subtitle="Join an open table, spectate active matches, or create a new room."
        actionIcon="add"
        actionLabel="Create"
        onAction={() =>
          dispatch({ type: "NAVIGATE", route: { name: "create", gameId: selectedGameId } })
        }
      />

      <View style={styles.filters}>
        <FilterChip
          label="All"
          active={!selectedGameId}
          onPress={() => dispatch({ type: "NAVIGATE", route: { name: "rooms" } })}
        />
        {arenaGames.map((arenaGame) => (
          <FilterChip
            key={arenaGame.id}
            label={arenaGame.shortName}
            active={selectedGameId === arenaGame.id}
            onPress={() => dispatch({ type: "SELECT_GAME", gameId: arenaGame.id })}
          />
        ))}
      </View>

      <View style={styles.roomList}>
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            players={state.players}
            onPress={() => dispatch({ type: "OPEN_ROOM", roomId: room.id })}
          />
        ))}
      </View>

      {rooms.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No rooms yet</Text>
          <Text style={styles.emptyText}>Create the first table for this game.</Text>
          <ActionButton
            title="Create room"
            icon="add"
            onPress={() =>
              dispatch({
                type: "NAVIGATE",
                route: { name: "create", gameId: selectedGameId as GameId | undefined }
              })
            }
          />
        </View>
      ) : null}
    </Screen>
  );
}

function FilterChip({
  label,
  active,
  onPress
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.filterChip, active ? styles.filterChipActive : undefined]}
    >
      <Text style={[styles.filterText, active ? styles.filterTextActive : undefined]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg
  },
  filterChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  filterChipActive: {
    backgroundColor: colors.amber,
    borderColor: colors.amber
  },
  filterText: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: "900"
  },
  filterTextActive: {
    color: colors.black
  },
  roomList: {
    gap: spacing.md
  },
  emptyState: {
    alignItems: "flex-start",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.lg
  },
  emptyTitle: {
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: "900"
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.body
  }
});
