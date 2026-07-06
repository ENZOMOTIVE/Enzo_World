export type CarromCoinColor = "white" | "black" | "queen";

export interface CarromCoin {
  id: string;
  color: CarromCoinColor;
  x: number;
  y: number;
  pocketedBy?: string;
}

export interface ArenaCarromState {
  kind: "carrom";
  activePlayerId: string;
  turnOrder: string[];
  strikerX: number;
  power: number;
  selectedCoinId?: string;
  coins: CarromCoin[];
  scores: Record<string, number>;
  turnCount: number;
  queenCovered: boolean;
  lastShot?: string;
  winnerId?: string;
  result?: string;
}

const initialCoinLayout: CarromCoin[] = [
  { id: "queen", color: "queen", x: 50, y: 50 },
  { id: "white-1", color: "white", x: 44, y: 45 },
  { id: "black-1", color: "black", x: 56, y: 45 },
  { id: "white-2", color: "white", x: 44, y: 55 },
  { id: "black-2", color: "black", x: 56, y: 55 },
  { id: "white-3", color: "white", x: 50, y: 40 },
  { id: "black-3", color: "black", x: 50, y: 60 },
  { id: "white-4", color: "white", x: 38, y: 50 },
  { id: "black-4", color: "black", x: 62, y: 50 }
];

export function createCarromState(playerIds: string[]): ArenaCarromState {
  const scores = playerIds.reduce<Record<string, number>>((scoreMap, playerId) => {
    scoreMap[playerId] = 0;
    return scoreMap;
  }, {});

  return {
    kind: "carrom",
    activePlayerId: playerIds[0] ?? "",
    turnOrder: playerIds,
    strikerX: 50,
    power: 60,
    selectedCoinId: "white-1",
    coins: initialCoinLayout.map((coin) => ({ ...coin })),
    scores,
    turnCount: 0,
    queenCovered: false
  };
}

export function selectCarromCoin(
  state: ArenaCarromState,
  coinId: string
): ArenaCarromState {
  const coin = state.coins.find((item) => item.id === coinId && !item.pocketedBy);

  if (!coin) {
    return state;
  }

  return {
    ...state,
    selectedCoinId: coin.id
  };
}

export function setCarromPower(
  state: ArenaCarromState,
  power: number
): ArenaCarromState {
  return {
    ...state,
    power: Math.max(20, Math.min(100, power))
  };
}

export function takeCarromShot(
  state: ArenaCarromState,
  power: number
): { nextState: ArenaCarromState; event: string } {
  const availableCoins = state.coins.filter((coin) => !coin.pocketedBy);

  if (availableCoins.length === 0) {
    return {
      nextState: {
        ...state,
        winnerId: getWinnerId(state.scores),
        result: "Game over."
      },
      event: "Board already cleared."
    };
  }

  const normalizedPower = Math.max(20, Math.min(100, power));
  const activePlayerId = state.activePlayerId || state.turnOrder[0] || "";
  const targetCoin = state.selectedCoinId
    ? availableCoins.find((coin) => coin.id === state.selectedCoinId)
    : undefined;

  if (!targetCoin) {
    return {
      nextState: state,
      event: "Pick a coin before shooting."
    };
  }

  const distanceFromCenter = Math.hypot(targetCoin.x - 50, targetCoin.y - 50);
  const needsPower = targetCoin.color === "queen" ? 60 : 42 + Math.round(distanceFromCenter);
  const pocketsCoin = normalizedPower >= needsPower;

  if (!pocketsCoin) {
    const nextPlayerId = getNextPlayerId(state);

    return {
      nextState: {
        ...state,
        activePlayerId: nextPlayerId,
        power: normalizedPower,
        selectedCoinId: undefined,
        turnCount: state.turnCount + 1,
        lastShot: `${coinLabel(targetCoin.color)} missed.`
      },
      event: "Carrom shot missed."
    };
  }

  const points = targetCoin.color === "queen" ? 3 : 1;
  const coins = state.coins.map((coin) =>
    coin.id === targetCoin.id
      ? {
          ...coin,
          pocketedBy: activePlayerId
        }
      : coin
  );
  const scores = {
    ...state.scores,
    [activePlayerId]: (state.scores[activePlayerId] ?? 0) + points
  };
  const boardCleared = coins.every((coin) => coin.pocketedBy);
  const winnerId = boardCleared ? getWinnerId(scores) : undefined;

  return {
    nextState: {
      ...state,
      coins,
      scores,
      power: normalizedPower,
      selectedCoinId: undefined,
      turnCount: state.turnCount + 1,
      queenCovered: state.queenCovered || targetCoin.color === "queen",
      winnerId,
      lastShot: `${coinLabel(targetCoin.color)} pocketed for ${points} point${
        points === 1 ? "" : "s"
      }.`,
      result: boardCleared ? "Game over." : undefined
    },
    event: `Carrom ${coinLabel(targetCoin.color).toLowerCase()} pocketed.`
  };
}

function getNextPlayerId(state: ArenaCarromState) {
  const firstPlayerId = state.turnOrder[0];

  if (!firstPlayerId) {
    return "";
  }

  const currentIndex = state.turnOrder.indexOf(state.activePlayerId);
  const nextIndex = (currentIndex + 1) % state.turnOrder.length;
  return state.turnOrder[nextIndex] ?? firstPlayerId;
}

function coinLabel(color: CarromCoinColor) {
  if (color === "queen") {
    return "Queen";
  }

  return color === "white" ? "White coin" : "Black coin";
}

function getWinnerId(scores: Record<string, number>) {
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sortedScores[0]?.[0];
}
