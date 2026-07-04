import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors, spacing, typography } from "../core/theme";

interface SectionProps extends PropsWithChildren {
  title: string;
  action?: React.ReactNode;
}

export function Section({ title, action, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {action}
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  title: {
    color: colors.text,
    fontSize: typography.subheading,
    fontWeight: "800"
  },
  body: {
    gap: spacing.md
  }
});
