from langgraph.types import interrupt
from guess_game.core.state import State


def get_user_question(state: State) -> State:
    question = interrupt("> (type /giveup to give up) ")
    if question.strip().casefold() == "/giveup":
        return {"status": "gave_up"}
    return {"current_question": question}
