import { colors } from "../../core/theme";
import { createCarromState } from "../games/carrom";
import { createChessState } from "../games/chess";
import { ArenaPlayer, GameRoom } from "./types";

export const currentUserId = "player-you";

export const mockPlayers: Record<string, ArenaPlayer> = {
  "player-you": {
    id: "player-you",
    displayName: "Enzo",
    rating: 1240,
    coins: 2400,
    avatarColor: colors.amber,
    region: "IN",
    isOnline: true
  },
  "player-mira": {
    id: "player-mira",
    displayName: "Mira",
    rating: 1325,
    coins: 1840,
    avatarColor: colors.teal,
    region: "DE",
    isOnline: true
  },
  "player-kai": {
    id: "player-kai",
    displayName: "Kai",
    rating: 1180,
    coins: 920,
    avatarColor: colors.coral,
    region: "US",
    isOnline: true
  },
  "player-sana": {
    id: "player-sana",
    displayName: "Sana",
    rating: 1410,
    coins: 3210,
    avatarColor: colors.violet,
    region: "AE",
    isOnline: false
  }
};

export const mockRooms: Record<string, GameRoom> = {
  "room-royal-chess": {
    id: "room-royal-chess",
    code: "CHS742",
    title: "Royal Blitz Table",
    gameId: "chess",
    visibility: "public",
    status: "waiting",
    maxPlayers: 2,
    buyInCoins: 0,
    createdAt: new Date().toISOString(),
    seats: [
      {
        playerId: "player-mira",
        isHost: true,
        isReady: true,
        label: "White"
      }
    ],
    spectators: 8,
    messages: [
      {
        id: "msg-1",
        playerId: "player-mira",
        text: "Open for a clean blitz game.",
        createdAt: new Date().toISOString()
      }
    ],
    events: [
      {
        id: "event-1",
        text: "Mira created the room.",
        createdAt: new Date().toISOString()
      }
    ],
    state: createChessState()
  },
  "room-carrom-night": {
    id: "room-carrom-night",
    code: "CRM118",
    title: "Friday Carrom Clash",
    gameId: "carrom",
    visibility: "public",
    status: "waiting",
    maxPlayers: 2,
    buyInCoins: 50,
    createdAt: new Date().toISOString(),
    seats: [
      {
        playerId: "player-kai",
        isHost: true,
        isReady: true,
        label: "Striker 1"
      }
    ],
    spectators: 4,
    messages: [],
    events: [
      {
        id: "event-2",
        text: "Kai is waiting for a carrom opponent.",
        createdAt: new Date().toISOString()
      }
    ],
    state: createCarromState(["player-kai"])
  },
  "room-training": {
    id: "room-training",
    code: "TRN204",
    title: "Your Practice Table",
    gameId: "chess",
    visibility: "private",
    status: "waiting",
    maxPlayers: 2,
    buyInCoins: 0,
    createdAt: new Date().toISOString(),
    seats: [
      {
        playerId: "player-you",
        isHost: true,
        isReady: false,
        label: "White"
      }
    ],
    spectators: 0,
    messages: [],
    events: [
      {
        id: "event-3",
        text: "Practice room prepared.",
        createdAt: new Date().toISOString()
      }
    ],
    state: createChessState()
  }
};
