import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, shadows, spacing, typography } from "../core/theme";
import { ArenaGame } from "../domain/games/catalog";
import { StatusPill } from "./StatusPill";

interface GameCardProps {
  game: ArenaGame;
  onPress: () => void;
}

export function GameCard({ game, onPress }: GameCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { borderColor: pressed ? game.accentColor : colors.border }
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${game.accentColor}24` }]}>
        <Ionicons name={game.icon} color={game.accentColor} size={28} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{game.name}</Text>
          <StatusPill status={game.availability} />
        </View>
        <Text style={styles.tagline}>{game.tagline}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{game.minPlayers}-{game.maxPlayers} players</Text>
          <Text style={styles.meta}>{game.averageDuration}</Text>
          <Text style={styles.meta}>{game.buyInLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...shadows.raised,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md
  },
  iconWrap: {
    alignItems: "center",
    borderRadius: radii.md,
    height: 54,
    justifyContent: "center",
    width: 54
  },
  body: {
    flex: 1,
    gap: spacing.sm
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  title: {
    color: colors.text,
    flexShrink: 1,
    fontSize: typography.subheading,
    fontWeight: "800"
  },
  tagline: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  meta: {
    color: colors.textSubtle,
    fontSize: typography.small,
    fontWeight: "700"
  }
});
