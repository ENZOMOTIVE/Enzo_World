import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors, radii, spacing, typography } from "../core/theme";
import { ActionButton } from "../components/ActionButton";
import { AppHeader } from "../components/AppHeader";
import { Screen } from "../components/Screen";
import { arenaGames, GameId } from "../domain/games/catalog";
import { ArenaRoute } from "../domain/rooms/roomReducer";
import { RoomVisibility } from "../domain/rooms/types";
import { useArena } from "../state/ArenaProvider";

interface CreateRoomScreenProps {
  route: Extract<ArenaRoute, { name: "create" }>;
}

const buyInOptions = [0, 50, 100, 250];

export function CreateRoomScreen({ route }: CreateRoomScreenProps) {
  const { dispatch } = useArena();
  const [gameId, setGameId] = useState<GameId>(route.gameId ?? "chess");
  const [visibility, setVisibility] = useState<RoomVisibility>("public");
  const [buyInCoins, setBuyInCoins] = useState(0);
  const [title, setTitle] = useState("");
  const selectedGame = useMemo(
    () => arenaGames.find((game) => game.id === gameId),
    [gameId]
  );

  return (
    <Screen>
      <AppHeader
        title="New Table"
        subtitle="Choose a game."
        onBack={() => dispatch({ type: "NAVIGATE", route: { name: "rooms", gameId } })}
      />

      <View style={styles.form}>
        <Field label="Game">
          <View style={styles.optionGrid}>
            {arenaGames.map((game) => (
              <Option
                key={game.id}
                label={game.shortName}
                active={gameId === game.id}
                onPress={() => setGameId(game.id)}
              />
            ))}
          </View>
        </Field>

        <Field label="Table name">
          <TextInput
            placeholder={`${selectedGame?.shortName ?? "Game"} table`}
            placeholderTextColor={colors.textSubtle}
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
        </Field>

        <Field label="Visibility">
          <View style={styles.optionGrid}>
            <Option
              label="Public"
              active={visibility === "public"}
              onPress={() => setVisibility("public")}
            />
            <Option
              label="Private"
              active={visibility === "private"}
              onPress={() => setVisibility("private")}
            />
          </View>
        </Field>

        <Field label="Buy-in">
          <View style={styles.optionGrid}>
            {buyInOptions.map((option) => (
              <Option
                key={option}
                label={option === 0 ? "Free" : `${option}`}
                active={buyInCoins === option}
                onPress={() => setBuyInCoins(option)}
              />
            ))}
          </View>
        </Field>

        <ActionButton
          title="Make table"
          icon="checkmark"
          onPress={() =>
            dispatch({
              type: "CREATE_ROOM",
              input: {
                gameId,
                title,
                visibility,
                buyInCoins
              }
            })
          }
        />
      </View>
    </Screen>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function Option({
  label,
  active,
  onPress
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.option, active ? styles.optionActive : undefined]}>
      <Text style={[styles.optionText, active ? styles.optionTextActive : undefined]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg
  },
  field: {
    gap: spacing.sm
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "900"
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: typography.body,
    minHeight: 50,
    paddingHorizontal: spacing.md
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  option: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    minHeight: 44,
    minWidth: 92,
    justifyContent: "center",
    paddingHorizontal: spacing.md
  },
  optionActive: {
    backgroundColor: colors.amber,
    borderColor: colors.amber
  },
  optionText: {
    color: colors.textMuted,
    fontSize: typography.body,
    fontWeight: "900"
  },
  optionTextActive: {
    color: colors.black
  }
});
