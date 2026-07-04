# Android Release Notes

## Android-First Defaults

- Package name: `com.enzoworld.arena`
- Orientation: portrait
- UI style: dark
- Launch approach: Expo managed workflow first, with EAS Build when signing and store delivery begin.

## Before First Play Store Build

1. Add real app icons and adaptive icon foreground.
2. Add a production splash screen.
3. Configure EAS project ID.
4. Decide auth strategy.
5. Replace local room state with backend-backed matchmaking and room subscriptions.
6. Add crash reporting and analytics.
7. Add app privacy policy and data safety answers.
8. Add Android keystore management through EAS.

## Commands

```bash
npm install
npm run android
```

When EAS is added:

```bash
npx eas build --platform android
```

## Store Readiness

The current app is not Play Store-ready because multiplayer is local-only. The UI and room contract are ready for backend integration, but real launch needs:

- account identity;
- server-authoritative room state;
- anti-cheat and disconnect handling;
- payments or wallet compliance if coin buy-ins become real money or redeemable value;
- moderation for chat and usernames;
- telemetry for crashes and gameplay funnels.
