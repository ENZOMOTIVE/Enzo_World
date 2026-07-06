import { StatusBar, StyleSheet, View } from "react-native";

import { colors } from "./theme";
import { ArenaTabBar } from "../components/ArenaTabBar";
import { CreateRoomScreen } from "../screens/CreateRoomScreen";
import { GamesScreen } from "../screens/GamesScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { RoomScreen } from "../screens/RoomScreen";
import { RoomsScreen } from "../screens/RoomsScreen";
import { useArena } from "../state/ArenaProvider";

export function AppNavigator() {
  const { state, dispatch } = useArena();
  const route = state.route;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      {route.name === "home" ? <HomeScreen /> : null}
      {route.name === "games" ? <GamesScreen /> : null}
      {route.name === "rooms" ? <RoomsScreen route={route} /> : null}
      {route.name === "create" ? <CreateRoomScreen route={route} /> : null}
      {route.name === "room" ? <RoomScreen route={route} /> : null}
      {route.name !== "room" ? (
        <ArenaTabBar
          route={route}
          onNavigate={(nextRoute) => dispatch({ type: "NAVIGATE", route: nextRoute })}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.background,
    flex: 1
  }
});
