import { ArenaProvider } from "./src/state/ArenaProvider";
import { AppNavigator } from "./src/core/AppNavigator";

export default function App() {
  return (
    <ArenaProvider>
      <AppNavigator />
    </ArenaProvider>
  );
}
