# Enzo World

> Enzo World is a mobile arcade project for collecting multiple games inside one React Native or Expo-style app.

## The Story

Enzo World starts with a simple goal: shape a mobile experience that is easy to install, test, and hand off. Its shape tells the same story: the product interface, the mobile surface, and the documentation source live close enough together that a maintainer can see the project as a whole before diving into individual folders.

## Detailed Description

Enzo World is a mobile arcade project for collecting multiple games inside one React Native or Expo-style app. This README is meant to explain the project like a handoff note: what the idea is, why the repository exists, and how someone can start working with it without opening every file first.

The mobile workflow matters as much as the code. Device setup, emulator notes, signing expectations, and release commands should be kept visible so the app can move from local development to a real handset without guesswork.

At the top level, the most important entry points are `App.tsx`, `app.json`, `assets`, `babel.config.js`, `docs`, and `eas.json`. Together they show the current boundary of the project and make it easier to separate product code, support files, documentation, and experiments.

The declared Node surfaces include the root package (scripts: `start`, `android`, `ios`, `web`, `typecheck`). Those package files are the best starting points for understanding how the app runs, builds, or validates itself.

The visible stack currently points to `React`, `React Native / Expo`, `Node.js`, `TypeScript`, and `JavaScript`. Keep this list honest as the project changes so the README remains useful as a first technical map.

## What It Includes

- A user-facing surface for the product, demo, dashboard, or static experience.
- Mobile-ready project structure for wallet, Android, or app-focused development.
- Documentation sources that can be previewed, exported, or published.

## How It Is Put Together

| Path | Role |
| --- | --- |
| `.gitattributes` | project file or folder |
| `.gitignore` | ignored local, dependency, and build files |
| `App.tsx` | TypeScript source |
| `app.json` | project file or folder |
| `assets` | static assets and presentation files |
| `babel.config.js` | JavaScript source |
| `docs` | documentation source |
| `eas.json` | project file or folder |
| `index.js` | JavaScript source |
| `package-lock.json` | locked dependency versions |
| `package.json` | Node package scripts and dependencies |
| `src` | project file or folder |

## Local Development

```bash
git clone https://github.com/ENZOMOTIVE/Enzo_World.git
cd Enzo_World
```

```bash
npm install
npm start
```

## Command Surface

| Area | Commands |
| --- | --- |
| `package.json` | `start`, `android`, `ios`, `web`, `typecheck` |

## Configuration

- Keep signing keys, platform credentials, and build profiles outside the repository.

## Quality Checks

- From the repository root, run `npm run typecheck`.

## Where To Take It Next

- Add screenshots or a short user flow so visitors can see the interface before running it.
- Add emulator, device, signing, and release notes for the mobile workflow.
- Keep setup commands current whenever dependencies, scripts, or deployment targets change.
- Record important product decisions here so the repository keeps its story as the code evolves.

## Project Metadata

| Field | Details |
| --- | --- |
| Repository | `ENZOMOTIVE/Enzo_World` |
| Categories | `Full Stack`, `Mobile` |
| Primary stack | React, React Native / Expo, Node.js, TypeScript, JavaScript |


## License

No license file is currently committed. Add one before distributing this project publicly.
