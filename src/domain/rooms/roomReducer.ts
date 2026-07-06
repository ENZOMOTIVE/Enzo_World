import { GameId } from "../games/catalog";
import {
  createCarromState,
  selectCarromCoin,
  setCarromPower,
  takeCarromShot
} from "../games/carrom";
import {
  createChessState,
  makeChessMove,
  selectChessSquare,
  undoChessMove
} from "../games/chess";
import { currentUserId, mockPlayers, mockRooms } from "./mockData";
import {
  ArenaPlayer,
  CreateRoomInput,
  GameRoom,
  RoomEvent,
  RoomMessage,
  RoomSeat
} from "./types";

export type ArenaRoute =
  | { name: "home" }
  | { name: "games" }
  | { name: "rooms"; gameId?: GameId }
  | { name: "create"; gameId?: GameId }
  | { name: "room"; roomId: string };

export interface ArenaState {
  currentUserId: string;
  players: Record<string, ArenaPlayer>;
  rooms: Record<string, GameRoom>;
  route: ArenaRoute;
}

export type ArenaAction =
  | { type: "NAVIGATE"; route: ArenaRoute }
  | { type: "SELECT_GAME"; gameId: GameId }
  | { type: "OPEN_ROOM"; roomId: string }
  | { type: "QUICK_PLAY"; gameId: GameId }
  | { type: "CREATE_ROOM"; input: CreateRoomInput }
  | { type: "JOIN_ROOM"; roomId: string }
  | { type: "ADD_LOCAL_RIVAL"; roomId: string }
  | { type: "LEAVE_ROOM"; roomId: string }
  | { type: "TOGGLE_READY"; roomId: string }
  | { type: "START_ROOM"; roomId: string }
  | { type: "SEND_MESSAGE"; roomId: string; text: string }
  | { type: "SELECT_CHESS_SQUARE"; roomId: string; square: string }
  | { type: "MAKE_CHESS_MOVE"; roomId: string; from: string; to: string }
  | { type: "UNDO_CHESS_MOVE"; roomId: string }
  | { type: "SELECT_CARROM_COIN"; roomId: string; coinId: string }
  | { type: "SET_CARROM_POWER"; roomId: string; power: number }
  | { type: "TAKE_CARROM_SHOT"; roomId: string; power: number };

export const initialArenaState: ArenaState = {
  currentUserId,
  players: mockPlayers,
  rooms: mockRooms,
  route: { name: "home" }
};

export function arenaReducer(state: ArenaState, action: ArenaAction): ArenaState {
  switch (action.type) {
    case "NAVIGATE":
      return {
        ...state,
        route: action.route
      };

    case "SELECT_GAME":
      return {
        ...state,
        route: { name: "rooms", gameId: action.gameId }
      };

    case "OPEN_ROOM":
      return {
        ...state,
        route: { name: "room", roomId: action.roomId }
      };

    case "QUICK_PLAY": {
      const room = createQuickPlayRoom(action.gameId, state);

      return {
        ...state,
        rooms: {
          ...state.rooms,
          [room.id]: room
        },
        route: { name: "room", roomId: room.id }
      };
    }

    case "CREATE_ROOM": {
      const room = createRoom(action.input, state.currentUserId);

      return {
        ...state,
        rooms: {
          ...state.rooms,
          [room.id]: room
        },
        route: { name: "room", roomId: room.id }
      };
    }

    case "JOIN_ROOM":
      return updateRoom(state, action.roomId, (room) => joinRoom(room, state.currentUserId));

    case "ADD_LOCAL_RIVAL":
      return updateRoom(state, action.roomId, (room) => addLocalRival(room, state));

    case "LEAVE_ROOM": {
      const room = state.rooms[action.roomId];
      const nextState = updateRoom(state, action.roomId, (targetRoom) =>
        refreshRoomStatus({
          ...targetRoom,
          seats: targetRoom.seats.filter((seat) => seat.playerId !== state.currentUserId),
          events: [
            createEvent(`${state.players[state.currentUserId]?.displayName ?? "Player"} left.`),
            ...targetRoom.events
          ]
        })
      );

      if (!room) {
        return nextState;
      }

      return {
        ...nextState,
        route: { name: "rooms", gameId: room.gameId }
      };
    }

    case "TOGGLE_READY":
      return updateRoom(state, action.roomId, (room) => {
        const nextRoom = {
          ...room,
          seats: room.seats.map((seat) =>
            seat.playerId === state.currentUserId
              ? {
                  ...seat,
                  isReady: !seat.isReady
                }
              : seat
          )
        };

        return refreshRoomStatus(nextRoom);
      });

    case "START_ROOM":
      return updateRoom(state, action.roomId, (room) => {
        if (!canStartRoom(room)) {
          return room;
        }

        return {
          ...room,
          status: "in_progress",
          state:
            room.gameId === "chess"
              ? createChessState()
              : createCarromState(room.seats.map((seat) => seat.playerId)),
          events: [createEvent("Match started."), ...room.events]
        };
      });

    case "SEND_MESSAGE":
      return updateRoom(state, action.roomId, (room) => ({
        ...room,
        messages: [
          createMessage(state.currentUserId, action.text.trim()),
          ...room.messages
        ].filter((message) => message.text.length > 0)
      }));

    case "SELECT_CHESS_SQUARE":
      return updateRoom(state, action.roomId, (room) => {
        if (room.state.kind !== "chess" || room.status !== "in_progress") {
          return room;
        }

        return {
          ...room,
          state: selectChessSquare(room.state, action.square)
        };
      });

    case "MAKE_CHESS_MOVE":
      return updateRoom(state, action.roomId, (room) => {
        if (room.state.kind !== "chess" || room.status !== "in_progress") {
          return room;
        }

        const result = makeChessMove(room.state, action.from, action.to);

        return {
          ...room,
          status: result.nextState.result ? "finished" : room.status,
          state: result.nextState,
          events: [createEvent(result.nextState.result ?? result.event), ...room.events]
        };
      });

    case "UNDO_CHESS_MOVE":
      return updateRoom(state, action.roomId, (room) => {
        if (room.state.kind !== "chess" || room.status === "waiting") {
          return room;
        }

        return {
          ...room,
          status: "in_progress",
          state: undoChessMove(room.state),
          events: [createEvent("Chess move undone."), ...room.events]
        };
      });

    case "SET_CARROM_POWER":
      return updateRoom(state, action.roomId, (room) => {
        if (room.state.kind !== "carrom" || room.status !== "in_progress") {
          return room;
        }

        return {
          ...room,
          state: setCarromPower(room.state, action.power)
        };
      });

    case "SELECT_CARROM_COIN":
      return updateRoom(state, action.roomId, (room) => {
        if (room.state.kind !== "carrom" || room.status !== "in_progress") {
          return room;
        }

        return {
          ...room,
          state: selectCarromCoin(room.state, action.coinId)
        };
      });

    case "TAKE_CARROM_SHOT":
      return updateRoom(state, action.roomId, (room) => {
        if (room.state.kind !== "carrom" || room.status !== "in_progress") {
          return room;
        }

        const result = takeCarromShot(room.state, action.power);

        return {
          ...room,
          status: result.nextState.result ? "finished" : room.status,
          state: result.nextState,
          events: [createEvent(result.nextState.result ?? result.event), ...room.events]
        };
      });

    default:
      return state;
  }
}

function updateRoom(
  state: ArenaState,
  roomId: string,
  updater: (room: GameRoom) => GameRoom
): ArenaState {
  const room = state.rooms[roomId];

  if (!room) {
    return state;
  }

  return {
    ...state,
    rooms: {
      ...state.rooms,
      [roomId]: updater(room)
    }
  };
}

function createRoom(input: CreateRoomInput, hostPlayerId: string): GameRoom {
  const id = `room-${Date.now().toString(36)}`;
  const hostSeat = createSeat(hostPlayerId, true, input.gameId, 0);

  return {
    id,
    code: createRoomCode(input.gameId),
    title: input.title.trim() || "New Arena Room",
    gameId: input.gameId,
    visibility: input.visibility,
    status: "waiting",
    maxPlayers: 2,
    buyInCoins: input.buyInCoins,
    createdAt: new Date().toISOString(),
    seats: [hostSeat],
    spectators: 0,
    messages: [],
    events: [createEvent("Room created.")],
    state: input.gameId === "chess" ? createChessState() : createCarromState([hostPlayerId])
  };
}

function createQuickPlayRoom(gameId: GameId, state: ArenaState): GameRoom {
  const id = `room-play-${Date.now().toString(36)}`;
  const rivalId = getLocalRivalId(state);
  const playerIds = [state.currentUserId, rivalId];
  const seats = playerIds.map((playerId, index) => ({
    ...createSeat(playerId, index === 0, gameId, index),
    isReady: true
  }));
  const title = gameId === "chess" ? "Chess Game" : "Carrom Game";

  return {
    id,
    code: createRoomCode(gameId),
    title,
    gameId,
    visibility: "private",
    status: "in_progress",
    maxPlayers: 2,
    buyInCoins: 0,
    createdAt: new Date().toISOString(),
    seats,
    spectators: 0,
    messages: [],
    events: [createEvent("Game started.")],
    state: gameId === "chess" ? createChessState() : createCarromState(playerIds)
  };
}

function joinRoom(room: GameRoom, playerId: string) {
  if (
    room.status === "in_progress" ||
    room.status === "finished" ||
    room.seats.some((seat) => seat.playerId === playerId) ||
    room.seats.length >= room.maxPlayers
  ) {
    return room;
  }

  return refreshRoomStatus({
    ...room,
    seats: [...room.seats, createSeat(playerId, false, room.gameId, room.seats.length)],
    events: [createEvent("Player joined the room."), ...room.events]
  });
}

function addLocalRival(room: GameRoom, state: ArenaState) {
  if (room.status === "in_progress" || room.seats.length >= room.maxPlayers) {
    return room;
  }

  const seatedPlayerIds = new Set(room.seats.map((seat) => seat.playerId));
  const rival = Object.values(state.players).find(
    (player) => player.id !== state.currentUserId && !seatedPlayerIds.has(player.id)
  );

  if (!rival) {
    return room;
  }

  return refreshRoomStatus({
    ...room,
    seats: [
      ...room.seats,
      {
        ...createSeat(rival.id, false, room.gameId, room.seats.length),
        isReady: true
      }
    ],
    events: [createEvent(`${rival.displayName} joined as a local rival.`), ...room.events]
  });
}

function getLocalRivalId(state: ArenaState) {
  return (
    Object.values(state.players).find((player) => player.id !== state.currentUserId)?.id ??
    state.currentUserId
  );
}

function refreshRoomStatus(room: GameRoom): GameRoom {
  if (room.status === "in_progress" || room.status === "finished") {
    return room;
  }

  const isFull = room.seats.length >= room.maxPlayers;
  const allReady = room.seats.every((seat) => seat.isReady);

  return {
    ...room,
    status: isFull && allReady ? "ready" : "waiting"
  };
}

function canStartRoom(room: GameRoom) {
  return (
    room.status === "ready" &&
    room.seats.length >= room.maxPlayers &&
    room.seats.every((seat) => seat.isReady)
  );
}

function createSeat(
  playerId: string,
  isHost: boolean,
  gameId: GameId,
  seatIndex: number
): RoomSeat {
  const chessLabels = ["White", "Black"];
  const carromLabels = ["Striker 1", "Striker 2"];
  const labels = gameId === "chess" ? chessLabels : carromLabels;

  return {
    playerId,
    isHost,
    isReady: false,
    label: labels[seatIndex] ?? `Seat ${seatIndex + 1}`
  };
}

function createMessage(playerId: string, text: string): RoomMessage {
  return {
    id: `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    playerId,
    text,
    createdAt: new Date().toISOString()
  };
}

function createEvent(text: string): RoomEvent {
  return {
    id: `event-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    createdAt: new Date().toISOString()
  };
}

function createRoomCode(gameId: GameId) {
  const prefix = gameId === "chess" ? "CHS" : "CRM";
  const suffix = Math.floor(100 + Math.random() * 900);

  return `${prefix}${suffix}`;
}
