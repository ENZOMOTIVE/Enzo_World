import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  variant?: ButtonVariant;
  disabled?: boolean;
  compact?: boolean;
  style?: ViewStyle;
}

export function ActionButton({
  title,
  onPress,
  icon,
  variant = "primary",
  disabled = false,
  compact = false,
  style
}: ActionButtonProps) {
  const palette = getPalette(variant);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compact ? styles.compact : styles.regular,
        {
          backgroundColor: palette.background,
          borderColor: palette.border,
          opacity: disabled ? 0.45 : pressed ? 0.82 : 1
        },
        style
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={palette.text} /> : null}
      <Text style={[styles.label, { color: palette.text }]} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}

function getPalette(variant: ButtonVariant) {
  switch (variant) {
    case "secondary":
      return {
        background: colors.surfaceRaised,
        border: colors.border,
        text: colors.text
      };
    case "danger":
      return {
        background: colors.red,
        border: colors.red,
        text: colors.white
      };
    case "ghost":
      return {
        background: "transparent",
        border: colors.border,
        text: colors.textMuted
      };
    case "primary":
    default:
      return {
        background: colors.amber,
        border: colors.amber,
        text: colors.black
      };
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center"
  },
  regular: {
    minHeight: 48,
    paddingHorizontal: spacing.lg
  },
  compact: {
    minHeight: 38,
    paddingHorizontal: spacing.md
  },
  label: {
    flexShrink: 1,
    fontSize: typography.body,
    fontWeight: "800"
  }
});
