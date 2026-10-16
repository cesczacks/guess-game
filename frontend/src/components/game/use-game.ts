import { useEffect, useState } from "react";
import { ApiError, api, type Summary } from "@/lib/api";

const STORAGE_KEY = "guess_game_id";

export function useGame() {
  const [game, setGame] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Resume the saved game after a page reload.
  useEffect(() => {
    const id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      setLoading(false);
      return;
    }
    api
      .summary(id)
      .then(setGame)
      .catch(() => localStorage.removeItem(STORAGE_KEY))
      .finally(() => setLoading(false));
  }, []);

  async function refresh(id: string) {
    setGame(await api.summary(id));
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setGame(null);
    setError(null);
  }

  /** Runs an action and turns failures into a user-facing error. Returns true on success. */
  async function run(action: () => Promise<void>) {
    setError(null);
    try {
      await action();
      return true;
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        reset();
        setError("游戏已失效（服务器可能已重启），请重新开始。");
      } else {
        setError(e instanceof Error ? e.message : "出错了，请重试。");
      }
      return false;
    }
  }

  const start = () =>
    run(async () => {
      setLoading(true);
      try {
        const { game_id } = await api.create();
        localStorage.setItem(STORAGE_KEY, game_id);
        await refresh(game_id);
      } finally {
        setLoading(false);
      }
    });

  const ask = (question: string) =>
    run(async () => {
      if (!game) return;
      setPendingQuestion(question);
      try {
        await api.ask(game.game_id, question);
        await refresh(game.game_id);
      } finally {
        setPendingQuestion(null);
      }
    });

  const giveUp = () =>
    run(async () => {
      if (!game) return;
      await api.giveUp(game.game_id);
      await refresh(game.game_id);
    });

  return { game, loading, pendingQuestion, error, start, ask, giveUp, reset };
}
