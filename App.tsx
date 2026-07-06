import { LogBox } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ArenaProvider } from "./src/state/ArenaProvider";
import { AppNavigator } from "./src/core/AppNavigator";

LogBox.ignoreLogs(["Cannot connect to Expo CLI"]);

export default function App() {
  return (
    <SafeAreaProvider>
      <ArenaProvider>
        <AppNavigator />
      </ArenaProvider>
    </SafeAreaProvider>
  );
}
