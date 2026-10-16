"use client";

import { GameScreen } from "./game-screen";
import { StartScreen } from "./start-screen";
import { useGame } from "./use-game";

export function GuessGame() {
  const { game, loading, pendingQuestion, error, start, ask, giveUp, reset } =
    useGame();

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col px-5 py-8">
      {game ? (
        <GameScreen
          game={game}
          pendingQuestion={pendingQuestion}
          onAsk={ask}
          onGiveUp={giveUp}
          onRestart={reset}
        />
      ) : (
        <StartScreen loading={loading} onStart={start} />
      )}
      {error && <p className="mt-2 text-center text-sm text-seal">{error}</p>}
    </main>
  );
}
