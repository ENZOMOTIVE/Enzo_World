# Enzo World Arena

Enzo World Arena is a React Native + Expo board-game arena. The app is Android-first, simple enough for kids to use, and still compatible with iOS.

## Current App Slice

- Expo SDK 57 TypeScript app.
- One-tap local play from the home screen.
- Local table state with create, join, ready, start, leave, and match events.
- Game catalog with Chess Blitz and Carrom Strike.
- Chess uses `chess.js` for legal moves, turns, undo, move history, and check/draw results.
- Carrom supports coin selection, aim line, power choice, pocket scoring, turns, and match completion.
- No database yet. The state layer is intentionally isolated so a backend adapter can replace local reducer actions later.

## Run Locally

```bash
npm install
npm run android
```

For iOS:

```bash
npm run ios
```

For type checks:

```bash
npm run typecheck
```

## Android Build Path

The emulator/dev build runs with:

```bash
npm run android
```

Preview APK and production build profiles are defined in `eas.json`:

```bash
npx eas build --platform android --profile preview
npx eas build --platform android --profile production
```

## Project Structure

```text
src/
  app/          App shell, navigator, theme tokens
  components/   Reusable UI and game board components
  domain/       Game engines, room types, room reducer, mock data
  screens/      Home, games, rooms, create-room, room detail
  state/        React context provider for arena state
docs/
  ARCHITECTURE.md
  ANDROID_RELEASE.md
  ROADMAP.md
```

## Notes

- Expo SDK 57 targets React Native 0.86 and React 19.2.3.
- The room reducer is the current source of truth. Keep network/database code outside screens when it is added.
- Use `docs/ARCHITECTURE.md` before extending room or game behavior.

Official Expo SDK reference: https://docs.expo.dev/versions/latest/
