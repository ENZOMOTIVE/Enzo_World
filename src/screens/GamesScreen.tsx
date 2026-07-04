import { StyleSheet, Text } from "react-native";

import { colors, spacing, typography } from "../core/theme";
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
        title="Games"
        subtitle="Start with proven board formats, then add more arena titles behind the same room contract."
      />
      <Text style={styles.note}>Launch set</Text>
      {arenaGames.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          onPress={() => dispatch({ type: "SELECT_GAME", gameId: game.id })}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    color: colors.textSubtle,
    fontSize: typography.small,
    fontWeight: "900",
    marginBottom: spacing.sm,
    textTransform: "uppercase"
  }
});
