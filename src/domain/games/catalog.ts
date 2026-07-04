export type GameId = "chess" | "carrom";

export type GameAvailability = "playable" | "prototype";

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
    name: "Chess Blitz",
    shortName: "Chess",
    tagline: "Classic two-player arena chess with legal move validation.",
    description:
      "Ranked-ready chess rooms with readiness, turns, move history, and local multiplayer flow.",
    minPlayers: 2,
    maxPlayers: 2,
    averageDuration: "10 min",
    buyInLabel: "Free / Coins",
    availability: "playable",
    accentColor: "#F2A93B",
    icon: "grid-outline"
  },
  {
    id: "carrom",
    name: "Carrom Strike",
    shortName: "Carrom",
    tagline: "Fast local carrom prototype with pocket scoring and turn flow.",
    description:
      "A lightweight digital carrom board that models pockets, scoring, turns, and room events.",
    minPlayers: 2,
    maxPlayers: 2,
    averageDuration: "8 min",
    buyInLabel: "Free / Coins",
    availability: "prototype",
    accentColor: "#2EC7A0",
    icon: "disc-outline"
  }
];

export function getArenaGame(gameId: GameId) {
  return arenaGames.find((game) => game.id === gameId);
}
