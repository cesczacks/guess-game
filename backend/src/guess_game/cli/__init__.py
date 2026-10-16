from langgraph.types import Command
from guess_game.core.graph import game
from guess_game.core.state import Turn


def _format_answer(turn: Turn) -> str:
    if turn.is_guess:
        return "猜对了" if turn.is_correct else "猜错了"
    return turn.answer


def main() -> None:
    config = {"configurable": {"thread_id": "1"}}
    result = game.invoke({}, config)
    while "__interrupt__" in result:
        prompt = result["__interrupt__"][0].value
        answer = input(prompt)
        previous_turn_count = len(result.get("history", []))
        result = game.invoke(Command(resume=answer), config=config)
        if len(result.get("history", [])) > previous_turn_count:
            last_turn: Turn = result["history"][-1]
            print(f"→ {_format_answer(last_turn)}")

    state = game.get_state(config).values
    if state.get("status") == "won":
        print("🎉 You win!")
    elif state.get("status") == "gave_up":
        print(f"You gave up! 答案是: {state.get('secret_figure')}")
    else:
        print(f"💀 You lose! 答案是: {state.get('secret_figure')}")

    print("====== 回顾 ======")
    for turn in result.get("history", []):
        print(f"Q: {turn.question}")
        print(f"A: {_format_answer(turn)}")
        print(f"依据: {turn.provenance}")
