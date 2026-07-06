import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors, radii, shadows, spacing, typography } from "../core/theme";
import { ArenaGame } from "../domain/games/catalog";
import { ActionButton } from "./ActionButton";

interface GameCardProps {
  game: ArenaGame;
  onPlay: () => void;
  onBrowseRooms?: () => void;
}

export function GameCard({ game, onPlay, onBrowseRooms }: GameCardProps) {
  return (
    <View style={[styles.card, { borderColor: game.accentColor }]}>
      <View style={styles.topRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${game.accentColor}24` }]}>
          <Ionicons name={game.icon} color={game.accentColor} size={30} />
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>{game.name}</Text>
          <Text style={styles.tagline}>{game.tagline}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <ActionButton title="Play" icon="play" onPress={onPlay} style={styles.playButton} />
        {onBrowseRooms ? (
          <ActionButton
            title="Tables"
            icon="people-outline"
            variant="secondary"
            onPress={onBrowseRooms}
            style={styles.tablesButton}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.raised,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: radii.md,
    height: 62,
    justifyContent: "center",
    width: 62
  },
  body: {
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.heading,
    fontWeight: "900"
  },
  tagline: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm
  },
  playButton: {
    flex: 1
  },
  tablesButton: {
    flex: 1
  }
});
