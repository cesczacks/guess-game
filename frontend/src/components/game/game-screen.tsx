import type { GameStatus, Summary } from "@/lib/api";
import { QuestionForm } from "./question-form";
import { TurnCard } from "./turn-card";

const RESULT_TEXT: Record<GameStatus, string> = {
  playing: "",
  won: "猜对了！",
  lost: "问题用完了",
  gave_up: "已放弃",
};

type Props = {
  game: Summary;
  pendingQuestion: string | null;
  onAsk: (question: string) => Promise<boolean>;
  onGiveUp: () => void;
  onRestart: () => void;
};

export function GameScreen({
  game,
  pendingQuestion,
  onAsk,
  onGiveUp,
  onRestart,
}: Props) {
  const ended = game.status !== "playing";
  const isEmpty = game.history.length === 0 && !pendingQuestion;

  return (
    <>
      <header className="flex items-center justify-between border-b border-ink/15 pb-4">
        <h1 className="text-xl font-bold tracking-widest">猜猜我是谁</h1>
        <ProgressDots used={game.questions_asked} max={game.max_questions} />
      </header>

      {ended && (
        <section className="mt-6 rounded-2xl border border-seal/30 bg-white/60 p-6 text-center">
          <p className="text-sm text-ink/60">{RESULT_TEXT[game.status]}</p>
          <p className="mt-2 text-sm text-ink/60">答案是</p>
          <p className="mt-1 text-4xl font-bold tracking-widest text-seal">
            {game.secret_figure}
          </p>
          <button
            type="button"
            onClick={onRestart}
            className="mt-6 rounded-full bg-seal px-8 py-2 text-white transition hover:brightness-110"
          >
            再来一局
          </button>
        </section>
      )}

      <ol className="mt-6 flex flex-1 flex-col gap-3">
        {isEmpty && (
          <li className="py-12 text-center text-ink/50">
            我已经想好了一位人物，开始提问吧。
          </li>
        )}
        {game.history
          .map((turn, i) => ({ turn, number: i + 1 }))
          .map(({ turn, number }) => (
            <TurnCard key={number} index={number} turn={turn} />
          ))}
        {pendingQuestion && (
          <TurnCard
            index={game.history.length + 1}
            turn={{ question: pendingQuestion, answer: false }}
            pending
          />
        )}
      </ol>

      {!ended && (
        <QuestionForm
          remaining={game.max_questions - game.questions_asked}
          disabled={!!pendingQuestion}
          onAsk={onAsk}
          onGiveUp={onGiveUp}
        />
      )}
    </>
  );
}

function ProgressDots({ used, max }: { used: number; max: number }) {
  const dots = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1" title={`已用 ${used} / ${max}`}>
      {dots.map((n) => (
        <span
          key={n}
          className={`size-2.5 rounded-full ${n <= used ? "bg-seal" : "bg-ink/15"}`}
        />
      ))}
    </div>
  );
}
