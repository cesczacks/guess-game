export type GameStatus = "playing" | "won" | "lost" | "gave_up";

export type HistoryItem = {
  question: string;
  answer: boolean;
  provenance?: string;
};

export type TurnResponse = {
  game_id: string;
  status: GameStatus;
  answer: boolean;
  questions_asked: number;
  max_questions: number;
  secret_figure?: string;
};

export type Summary = {
  game_id: string;
  status: GameStatus;
  questions_asked: number;
  max_questions: number;
  secret_figure?: string;
  history: HistoryItem[];
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail = body?.detail;
    // FastAPI validation errors return a list of { msg } objects.
    const message = Array.isArray(detail)
      ? detail.map((d: { msg: string }) => d.msg).join("; ")
      : (detail ?? res.statusText);
    throw new ApiError(res.status, message);
  }
  return res.json();
}

export const api = {
  create: () => request<{ game_id: string }>("/create", { method: "POST" }),
  ask: (gameId: string, question: string) =>
    request<TurnResponse>(`/game/${encodeURIComponent(gameId)}/turns`, {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
  summary: (gameId: string) =>
    request<Summary>(`/game/${encodeURIComponent(gameId)}/summary`),
  giveUp: (gameId: string) =>
    request<{ status: GameStatus; secret_figure: string }>(
      `/game/${encodeURIComponent(gameId)}/give_up`,
      { method: "POST" },
    ),
};
