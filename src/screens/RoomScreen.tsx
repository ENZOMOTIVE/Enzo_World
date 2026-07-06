import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";
import { ActionButton } from "../components/ActionButton";
import { AppHeader } from "../components/AppHeader";
import { CarromBoard } from "../components/CarromBoard";
import { ChessBoard } from "../components/ChessBoard";
import { PlayerSeat } from "../components/PlayerSeat";
import { Screen } from "../components/Screen";
import { Section } from "../components/Section";
import { StatusPill } from "../components/StatusPill";
import { getArenaGame } from "../domain/games/catalog";
import { ArenaRoute } from "../domain/rooms/roomReducer";
import { useArena } from "../state/ArenaProvider";

interface RoomScreenProps {
  route: Extract<ArenaRoute, { name: "room" }>;
}

export function RoomScreen({ route }: RoomScreenProps) {
  const { state, dispatch } = useArena();
  const room = state.rooms[route.roomId];

  if (!room) {
    return (
      <Screen>
        <AppHeader
          title="Table not found"
          onBack={() => dispatch({ type: "NAVIGATE", route: { name: "rooms" } })}
        />
      </Screen>
    );
  }

  const game = getArenaGame(room.gameId);
  const currentSeat = room.seats.find((seat) => seat.playerId === state.currentUserId);
  const isPlaying = room.status === "in_progress" || room.status === "finished";
  const canJoin =
    !currentSeat && room.status === "waiting" && room.seats.length < room.maxPlayers;
  const canAddLocalRival = room.status === "waiting" && room.seats.length < room.maxPlayers;
  const canStart = room.status === "ready" && Boolean(currentSeat?.isHost);

  return (
    <Screen>
      <AppHeader
        title={room.title}
        subtitle={`${game?.shortName ?? room.gameId} · ${room.code}`}
        onBack={() => dispatch({ type: "NAVIGATE", route: { name: "rooms", gameId: room.gameId } })}
        actionIcon="refresh"
        actionLabel="New"
        onAction={() => dispatch({ type: "QUICK_PLAY", gameId: room.gameId })}
      />

      {!isPlaying ? (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>{game?.name ?? room.gameId}</Text>
          <StatusPill status={room.status} />
        </View>
      ) : null}

      {isPlaying ? (
        <Section title="Game">
          {room.state.kind === "chess" ? (
            <ChessBoard
              chess={room.state}
              onUndo={() => dispatch({ type: "UNDO_CHESS_MOVE", roomId: room.id })}
              onSquarePress={(square) => {
                if (room.state.kind !== "chess") {
                  return;
                }

                if (room.state.selectedSquare && room.state.legalTargets.includes(square)) {
                  dispatch({
                    type: "MAKE_CHESS_MOVE",
                    roomId: room.id,
                    from: room.state.selectedSquare,
                    to: square
                  });
                  return;
                }

                dispatch({ type: "SELECT_CHESS_SQUARE", roomId: room.id, square });
              }}
            />
          ) : (
            <CarromBoard
              carrom={room.state}
              players={state.players}
              onCoinPress={(coinId) =>
                dispatch({ type: "SELECT_CARROM_COIN", roomId: room.id, coinId })
              }
              onPowerChange={(power) =>
                dispatch({ type: "SET_CARROM_POWER", roomId: room.id, power })
              }
              onShoot={() =>
                room.state.kind === "carrom"
                  ? dispatch({
                      type: "TAKE_CARROM_SHOT",
                      roomId: room.id,
                      power: room.state.power
                    })
                  : undefined
              }
            />
          )}
        </Section>
      ) : (
        <>
          <View style={styles.actionGrid}>
            {canJoin ? (
              <ActionButton
                title="Join"
                icon="log-in"
                onPress={() => dispatch({ type: "JOIN_ROOM", roomId: room.id })}
              />
            ) : null}
            {currentSeat ? (
              <ActionButton
                title={currentSeat.isReady ? "Ready" : "Ready up"}
                icon={currentSeat.isReady ? "checkmark-circle" : "checkmark"}
                variant={currentSeat.isReady ? "secondary" : "primary"}
                onPress={() => dispatch({ type: "TOGGLE_READY", roomId: room.id })}
              />
            ) : null}
            {canStart ? (
              <ActionButton
                title="Start"
                icon="play"
                onPress={() => dispatch({ type: "START_ROOM", roomId: room.id })}
              />
            ) : null}
            {canAddLocalRival ? (
              <ActionButton
                title="Add player"
                icon="person-add"
                variant="secondary"
                onPress={() => dispatch({ type: "ADD_LOCAL_RIVAL", roomId: room.id })}
              />
            ) : null}
          </View>
          <View style={styles.waitingPanel}>
            <Text style={styles.waitingTitle}>Table is waiting</Text>
          </View>
        </>
      )}

      <Section title="Players">
        {Array.from({ length: room.maxPlayers }).map((_, index) => {
          const seat = room.seats[index];
          return (
            <PlayerSeat
              key={seat?.playerId ?? `seat-${index}`}
              seat={seat}
              player={seat ? state.players[seat.playerId] : undefined}
              label={
                room.gameId === "chess"
                  ? index === 0
                    ? "White"
                    : "Black"
                  : `Striker ${index + 1}`
              }
            />
          );
        })}
      </Section>

      <View style={styles.bottomActions}>
        {isPlaying ? (
          <ActionButton
            title="Play again"
            icon="refresh"
            onPress={() => dispatch({ type: "QUICK_PLAY", gameId: room.gameId })}
          />
        ) : null}
        {currentSeat ? (
          <ActionButton
            title="Leave"
            icon="exit-outline"
            variant="ghost"
            onPress={() => dispatch({ type: "LEAVE_ROOM", roomId: room.id })}
          />
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    padding: spacing.md
  },
  summaryTitle: {
    color: colors.text,
    flex: 1,
    fontSize: typography.subheading,
    fontWeight: "900"
  },
  actionGrid: {
    gap: spacing.sm,
    marginBottom: spacing.md
  },
  waitingPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    marginBottom: spacing.xl,
    padding: spacing.lg
  },
  waitingTitle: {
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: "900"
  },
  bottomActions: {
    gap: spacing.sm
  }
});
