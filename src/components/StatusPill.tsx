import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";
import { RoomStatus } from "../domain/rooms/types";

interface StatusPillProps {
  status: RoomStatus | "playable" | "prototype";
}

export function StatusPill({ status }: StatusPillProps) {
  const palette = getStatusPalette(status);

  return (
    <View style={[styles.pill, { backgroundColor: palette.background }]}>
      <Text style={[styles.text, { color: palette.text }]}>{formatStatus(status)}</Text>
    </View>
  );
}

function formatStatus(status: StatusPillProps["status"]) {
  return status
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function getStatusPalette(status: StatusPillProps["status"]) {
  switch (status) {
    case "ready":
    case "playable":
      return { background: "rgba(128, 217, 111, 0.16)", text: colors.green };
    case "in_progress":
      return { background: "rgba(46, 199, 160, 0.16)", text: colors.teal };
    case "prototype":
      return { background: "rgba(155, 123, 255, 0.16)", text: colors.violet };
    case "finished":
      return { background: "rgba(255, 90, 95, 0.16)", text: colors.red };
    case "waiting":
    default:
      return { background: "rgba(242, 169, 59, 0.16)", text: colors.amber };
  }
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    borderRadius: radii.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  text: {
    fontSize: typography.small,
    fontWeight: "800"
  }
});
