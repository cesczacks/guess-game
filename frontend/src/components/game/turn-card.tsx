import type { HistoryItem } from "@/lib/api";

type Props = {
  index: number;
  turn: HistoryItem;
  pending?: boolean;
};

export function TurnCard({ index, turn, pending = false }: Props) {
  return (
    <li
      ref={pending ? (el) => el?.scrollIntoView({ behavior: "smooth" }) : null}
      className="rounded-2xl bg-white/70 p-4 shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xs text-ink/40">{index}</span>
        <p className="flex-1">{turn.question}</p>
        {pending ? (
          <span className="animate-pulse text-sm text-ink/50">思考中…</span>
        ) : (
          <AnswerBadge yes={turn.answer} />
        )}
      </div>

      {turn.provenance && (
        <p className="mt-2 border-t border-ink/10 pt-2 pl-6 text-sm text-ink/60">
          依据：{turn.provenance}
        </p>
      )}
    </li>
  );
}

function AnswerBadge({ yes }: { yes: boolean }) {
  const style = yes ? "bg-jade/15 text-jade" : "bg-seal/10 text-seal";
  return (
    <span className={`rounded-md px-2.5 py-0.5 text-sm font-bold ${style}`}>
      {yes ? "是" : "否"}
    </span>
  );
}
