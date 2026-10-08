import uuid
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langgraph.types import Command

from guess_game.core.graph import game
from guess_game.core.state import State, Turn

app = FastAPI()


class TurnRequest(BaseModel):
    question: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/create")
def create():
    thread_id = str(uuid.uuid4())
    config = {"configurable": {"thread_id": thread_id}}
    game.invoke({}, config)
    return {"game_id": thread_id}


@app.post("/game/{game_id}/turns")
def turns(game_id: str, turn: TurnRequest):
    config = {"configurable": {"thread_id": game_id}}
    state = game.get_state(config).values

    if not state:
        raise HTTPException(status_code=404, detail="Game not found")
    if state.get("status") != "playing":
        raise HTTPException(status_code=409, detail="Game has already ended")

    result: State = game.invoke(Command(resume=turn.question), config)
    last_turn = result.get("history")[-1]

    return {
        "game_id": game_id,
        "status": result.get("status"),
        "answer": _format_answer(last_turn),
        "questions_asked": result.get("question_asked"),
        **(
            {"secret_figure": result.get("secret_figure")}
            if result.get("status") in ("won", "lost", "gave_up")
            else {}
        ),
    }


@app.get("/game/{game_id}/summary")
def summary(game_id: str):
    config = {"configurable": {"thread_id": game_id}}
    state = game.get_state(config).values
    if not state:
        raise HTTPException(status_code=404, detail="Game not found")

    return {
        "game_id": game_id,
        "status": state.get("status"),
        "history": [
            {
                "question": turn.question,
                "answer": _format_answer(turn),
                **(
                    {"provenance": turn.provenance}
                    if state.get("status") in ("won", "lost", "gave_up")
                    else {}
                ),
            }
            for turn in state.get("history", [])
        ],
    }


@app.post("/game/{game_id}/give_up")
def give_up(game_id: str):
    config = {"configurable": {"thread_id": game_id}}
    state = game.get_state(config).values

    if not state:
        raise HTTPException(status_code=404, detail="Game not found")
    if state.get("status") != "playing":
        raise HTTPException(status_code=409, detail="Game has already ended")

    result = game.invoke(Command(resume="/giveup"), config)

    return {
        "game_id": game_id,
        "status": result["status"],
        "secret_figure": result["secret_figure"],
    }


def _format_answer(turn: Turn) -> bool:
    if turn.is_guess:
        return turn.is_correct
    return True if turn.answer == "yes" else False
