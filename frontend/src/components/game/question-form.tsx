import { type SubmitEvent, useEffect, useRef, useState } from 'react';

type Props = {
	remaining: number;
	disabled: boolean;
	onAsk: (question: string) => Promise<boolean>;
	onGiveUp: () => void;
};

export function QuestionForm({ remaining, disabled, onAsk, onGiveUp }: Props) {
	const [input, setInput] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const question = input.trim();

	// Disabling the input while waiting drops focus, so restore it once enabled.
	useEffect(() => {
		if (!disabled) inputRef.current?.focus();
	}, [disabled]);

	async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!question || disabled) return;
		if (await onAsk(question)) setInput('');
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="sticky bottom-0 mt-6 flex gap-2 bg-paper/90 py-4 backdrop-blur"
		>
			<input
				ref={inputRef}
				value={input}
				onChange={(e) => setInput(e.target.value)}
				maxLength={100}
				placeholder={`提问或猜名字（还剩 ${remaining} 次）`}
				disabled={disabled}
				className="flex-1 rounded-full border border-ink/20 bg-white px-5 py-3 outline-none focus:border-seal"
			/>
			<button
				type="submit"
				disabled={disabled || !question}
				className="rounded-full bg-seal px-6 text-white transition hover:brightness-110 disabled:opacity-50"
			>
				提问
			</button>
			<button
				type="button"
				onClick={onGiveUp}
				disabled={disabled}
				className="rounded-full border border-ink/20 px-4 text-ink/70 transition hover:bg-ink/5 disabled:opacity-50"
			>
				放弃
			</button>
		</form>
	);
}
