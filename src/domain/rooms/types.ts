import { GameId } from "../games/catalog";
import { ArenaCarromState } from "../games/carrom";
import { ArenaChessState } from "../games/chess";

export type RoomStatus = "waiting" | "ready" | "in_progress" | "finished";
export type RoomVisibility = "public" | "private";

export interface ArenaPlayer {
  id: string;
  displayName: string;
  rating: number;
  coins: number;
  avatarColor: string;
  region: string;
  isOnline: boolean;
}

export interface RoomSeat {
  playerId: string;
  isHost: boolean;
  isReady: boolean;
  label: string;
}

export interface RoomMessage {
  id: string;
  playerId: string;
  text: string;
  createdAt: string;
}

export interface RoomEvent {
  id: string;
  text: string;
  createdAt: string;
}

export type RoomGameState = ArenaChessState | ArenaCarromState;

export interface GameRoom {
  id: string;
  code: string;
  title: string;
  gameId: GameId;
  visibility: RoomVisibility;
  status: RoomStatus;
  maxPlayers: number;
  buyInCoins: number;
  createdAt: string;
  seats: RoomSeat[];
  spectators: number;
  messages: RoomMessage[];
  events: RoomEvent[];
  state: RoomGameState;
}

export interface CreateRoomInput {
  gameId: GameId;
  title: string;
  visibility: RoomVisibility;
  buyInCoins: number;
}
