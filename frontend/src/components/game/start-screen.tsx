const RULES = [
  "系统会秘密选定一位中国历史人物",
  "用是 / 否问题缩小范围，例如「是皇帝吗」",
  "直接猜名字，例如「是李白吗」",
  "最多 10 次机会",
];

type Props = {
  loading: boolean;
  onStart: () => void;
};

export function StartScreen({ loading, onStart }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
      <div className="flex size-20 -rotate-6 items-center justify-center rounded-lg border-4 border-seal text-3xl font-bold text-seal">
        谁
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-widest">猜猜我是谁</h1>
        <p className="text-ink/70">中国历史人物 · 十问</p>
      </div>

      <ul className="max-w-sm space-y-1 text-left text-sm text-ink/70">
        {RULES.map((rule) => (
          <li key={rule}>· {rule}</li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onStart}
        disabled={loading}
        className="rounded-full bg-seal px-10 py-3 text-lg text-white shadow-md transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "请稍候…" : "开始游戏"}
      </button>
    </div>
  );
}
