import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

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
  const [chatText, setChatText] = useState("");
  const room = state.rooms[route.roomId];

  if (!room) {
    return (
      <Screen>
        <AppHeader
          title="Room not found"
          onBack={() => dispatch({ type: "NAVIGATE", route: { name: "rooms" } })}
        />
      </Screen>
    );
  }

  const game = getArenaGame(room.gameId);
  const currentSeat = room.seats.find((seat) => seat.playerId === state.currentUserId);
  const canJoin =
    !currentSeat &&
    room.status === "waiting" &&
    room.seats.length < room.maxPlayers;
  const canAddLocalRival = room.status === "waiting" && room.seats.length < room.maxPlayers;
  const canStart = room.status === "ready" && Boolean(currentSeat?.isHost);

  return (
    <Screen>
      <AppHeader
        title={room.title}
        subtitle={`${game?.shortName ?? room.gameId} · ${room.code}`}
        onBack={() => dispatch({ type: "NAVIGATE", route: { name: "rooms", gameId: room.gameId } })}
      />

      <View style={styles.summary}>
        <View style={styles.summaryTitleRow}>
          <Text style={styles.summaryTitle}>{game?.name ?? room.gameId}</Text>
          <StatusPill status={room.status} />
        </View>
        <Text style={styles.summaryText}>
          {room.visibility} · {room.buyInCoins === 0 ? "Free" : `${room.buyInCoins} coins`} ·{" "}
          {room.spectators} watching
        </Text>
      </View>

      <View style={styles.actionGrid}>
        {canJoin ? (
          <ActionButton
            title="Join room"
            icon="log-in"
            onPress={() => dispatch({ type: "JOIN_ROOM", roomId: room.id })}
          />
        ) : null}
        {currentSeat && room.status !== "in_progress" && room.status !== "finished" ? (
          <ActionButton
            title={currentSeat.isReady ? "Mark not ready" : "Ready"}
            icon={currentSeat.isReady ? "pause" : "checkmark"}
            variant={currentSeat.isReady ? "secondary" : "primary"}
            onPress={() => dispatch({ type: "TOGGLE_READY", roomId: room.id })}
          />
        ) : null}
        {canStart ? (
          <ActionButton
            title="Start match"
            icon="play"
            onPress={() => dispatch({ type: "START_ROOM", roomId: room.id })}
          />
        ) : null}
        {canAddLocalRival ? (
          <ActionButton
            title="Add local rival"
            icon="person-add"
            variant="secondary"
            onPress={() => dispatch({ type: "ADD_LOCAL_RIVAL", roomId: room.id })}
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

      <Section title="Seats">
        {Array.from({ length: room.maxPlayers }).map((_, index) => {
          const seat = room.seats[index];
          return (
            <PlayerSeat
              key={seat?.playerId ?? `seat-${index}`}
              seat={seat}
              player={seat ? state.players[seat.playerId] : undefined}
              label={room.gameId === "chess" ? (index === 0 ? "White" : "Black") : `Striker ${index + 1}`}
            />
          );
        })}
      </Section>

      <Section title="Table">
        {room.status === "in_progress" || room.status === "finished" ? (
          room.state.kind === "chess" ? (
            <ChessBoard
              chess={room.state}
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
          )
        ) : (
          <View style={styles.waitingPanel}>
            <Text style={styles.waitingTitle}>Waiting for players</Text>
            <Text style={styles.waitingText}>
              Fill the seats, mark ready, then the host can start the match.
            </Text>
          </View>
        )}
      </Section>

      <Section title="Room Chat">
        <View style={styles.chatComposer}>
          <TextInput
            placeholder="Message room"
            placeholderTextColor={colors.textSubtle}
            value={chatText}
            onChangeText={setChatText}
            style={styles.chatInput}
          />
          <ActionButton
            title="Send"
            icon="send"
            compact
            onPress={() => {
              dispatch({ type: "SEND_MESSAGE", roomId: room.id, text: chatText });
              setChatText("");
            }}
          />
        </View>
        <View style={styles.feed}>
          {room.messages.slice(0, 4).map((message) => (
            <View key={message.id} style={styles.message}>
              <Text style={styles.messageAuthor}>
                {state.players[message.playerId]?.displayName ?? "Player"}
              </Text>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
          {room.events.slice(0, 4).map((event) => (
            <Text key={event.id} style={styles.eventText}>
              {event.text}
            </Text>
          ))}
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginBottom: spacing.md,
    padding: spacing.md
  },
  summaryTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  summaryTitle: {
    color: colors.text,
    flex: 1,
    fontSize: typography.subheading,
    fontWeight: "900"
  },
  summaryText: {
    color: colors.textMuted,
    fontSize: typography.body
  },
  actionGrid: {
    gap: spacing.sm,
    marginBottom: spacing.xl
  },
  waitingPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg
  },
  waitingTitle: {
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: "900"
  },
  waitingText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22
  },
  chatComposer: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  },
  chatInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    minHeight: 44,
    paddingHorizontal: spacing.md
  },
  feed: {
    gap: spacing.sm
  },
  message: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    gap: spacing.xs,
    padding: spacing.md
  },
  messageAuthor: {
    color: colors.amber,
    fontSize: typography.small,
    fontWeight: "900"
  },
  messageText: {
    color: colors.text,
    fontSize: typography.body
  },
  eventText: {
    color: colors.textSubtle,
    fontSize: typography.small,
    fontWeight: "700"
  }
});
