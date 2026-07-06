export type GameId = "chess" | "carrom";

export type GameAvailability = "playable";

export interface ArenaGame {
  id: GameId;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  averageDuration: string;
  buyInLabel: string;
  availability: GameAvailability;
  accentColor: string;
  icon: "grid-outline" | "disc-outline";
}

export const arenaGames: ArenaGame[] = [
  {
    id: "chess",
    name: "Chess",
    shortName: "Chess",
    tagline: "Move pieces, protect the king, win the game.",
    description: "A quick two-player chess board for the same phone or emulator.",
    minPlayers: 2,
    maxPlayers: 2,
    averageDuration: "10 min",
    buyInLabel: "Free",
    availability: "playable",
    accentColor: "#F2A93B",
    icon: "grid-outline"
  },
  {
    id: "carrom",
    name: "Carrom",
    shortName: "Carrom",
    tagline: "Choose power, shoot, and pocket coins.",
    description: "A quick two-player carrom board for short local matches.",
    minPlayers: 2,
    maxPlayers: 2,
    averageDuration: "8 min",
    buyInLabel: "Free",
    availability: "playable",
    accentColor: "#2EC7A0",
    icon: "disc-outline"
  }
];

export function getArenaGame(gameId: GameId) {
  return arenaGames.find((game) => game.id === gameId);
}
