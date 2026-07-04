import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actionLabel?: string;
  actionIcon?: React.ComponentProps<typeof Ionicons>["name"];
  onAction?: () => void;
}

export function AppHeader({
  title,
  subtitle,
  onBack,
  actionLabel,
  actionIcon,
  onAction
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
        ) : null}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>

      {onAction && actionIcon ? (
        <Pressable onPress={onAction} style={styles.actionButton}>
          <Ionicons name={actionIcon} size={18} color={colors.black} />
          {actionLabel ? <Text style={styles.actionLabel}>{actionLabel}</Text> : null}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg
  },
  titleRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  backButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  titleBlock: {
    flex: 1,
    gap: spacing.xs
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: "800"
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21
  },
  actionButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: colors.amber,
    borderRadius: radii.md,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 42,
    paddingHorizontal: spacing.md
  },
  actionLabel: {
    color: colors.black,
    fontSize: typography.body,
    fontWeight: "800"
  }
});
