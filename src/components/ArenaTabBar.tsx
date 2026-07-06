import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";
import { ArenaRoute } from "../domain/rooms/roomReducer";

interface ArenaTabBarProps {
  route: ArenaRoute;
  onNavigate: (route: ArenaRoute) => void;
}

const tabs: Array<{
  label: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  route: ArenaRoute;
  isActive: (route: ArenaRoute) => boolean;
}> = [
  {
    label: "Home",
    icon: "home-outline",
    route: { name: "home" },
    isActive: (route) => route.name === "home"
  },
  {
    label: "Play",
    icon: "grid-outline",
    route: { name: "games" },
    isActive: (route) => route.name === "games"
  },
  {
    label: "Tables",
    icon: "people-outline",
    route: { name: "rooms" },
    isActive: (route) => route.name === "rooms" || route.name === "room"
  },
  {
    label: "New",
    icon: "add-circle-outline",
    route: { name: "create" },
    isActive: (route) => route.name === "create"
  }
];

export function ArenaTabBar({ route, onNavigate }: ArenaTabBarProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const active = tab.isActive(route);

          return (
            <Pressable
              key={tab.label}
              onPress={() => onNavigate(tab.route)}
              style={[styles.tab, active ? styles.activeTab : undefined]}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={active ? colors.black : colors.textMuted}
              />
              <Text style={[styles.label, { color: active ? colors.black : colors.textMuted }]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    bottom: 0,
    left: 0,
    padding: spacing.lg,
    position: "absolute",
    right: 0
  },
  bar: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    padding: spacing.xs
  },
  tab: {
    alignItems: "center",
    borderRadius: radii.sm,
    flex: 1,
    gap: 2,
    minHeight: 54,
    justifyContent: "center"
  },
  activeTab: {
    backgroundColor: colors.amber
  },
  label: {
    fontSize: typography.small,
    fontWeight: "800"
  }
});
