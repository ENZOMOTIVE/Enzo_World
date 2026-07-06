import { AppHeader } from "../components/AppHeader";
import { GameCard } from "../components/GameCard";
import { Screen } from "../components/Screen";
import { arenaGames } from "../domain/games/catalog";
import { useArena } from "../state/ArenaProvider";

export function GamesScreen() {
  const { dispatch } = useArena();

  return (
    <Screen>
      <AppHeader
        title="Play"
        subtitle="Choose a game."
      />
      {arenaGames.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onPlay={() => dispatch({ type: "QUICK_PLAY", gameId: game.id })}
          onBrowseRooms={() => dispatch({ type: "SELECT_GAME", gameId: game.id })}
        />
      ))}
    </Screen>
  );
}
