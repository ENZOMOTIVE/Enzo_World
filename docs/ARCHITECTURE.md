# Architecture

## Goals

The app is structured as a commercial-ready starting point, not a one-screen prototype. The current implementation is local-first because there is no database yet, but the code is divided so the future backend does not leak into screens.

## Layers

### App

`src/core` owns the app shell, route selection, and theme tokens.

The current navigator is intentionally small and dependency-light. When deep links, native stacks, or auth gates are needed, replace `AppNavigator` with React Navigation or Expo Router while keeping the screen contracts intact.

### State

`src/state/ArenaProvider.tsx` exposes the arena reducer through React context.

The reducer in `src/domain/rooms/roomReducer.ts` owns:

- navigation route state;
- room creation and lifecycle;
- joining/leaving seats;
- readiness and match start;
- chat and event feed;
- game actions routed to the correct game engine.

### Domain

`src/domain/games` owns game-specific logic.

- `chess.ts` wraps `chess.js` so UI code does not handle chess rules directly.
- `carrom.ts` contains the current deterministic carrom prototype engine.
- `catalog.ts` is the public game list used by screens.

`src/domain/rooms` owns room contracts and mock seed data.

### Screens

Screens compose domain state and reusable components. They should stay thin:

- read current state;
- dispatch user actions;
- render UI states.

Avoid putting room lifecycle rules, scoring, legal moves, or backend transport code inside screens.

## Backend Migration Path

When adding networking, keep the reducer action names and introduce a room service boundary:

1. `RoomService.createRoom(input)`
2. `RoomService.joinRoom(roomId)`
3. `RoomService.setReady(roomId, ready)`
4. `RoomService.startRoom(roomId)`
5. `RoomService.sendGameAction(roomId, action)`
6. `RoomService.subscribeRoom(roomId, listener)`

The provider can then dispatch server snapshots into the reducer, or the reducer can be replaced by a normalized client cache.

## Room State Contract

A room has:

- `status`: `waiting`, `ready`, `in_progress`, or `finished`;
- `seats`: player occupancy and readiness;
- `state`: discriminated game state, either `chess` or `carrom`;
- `messages`: room chat;
- `events`: system/match timeline.

This contract should remain stable across local, WebSocket, and database-backed implementations.
