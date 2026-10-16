from pydantic import BaseModel, Field
from typing import Literal, TypedDict, Annotated
from operator import add

MAX_QUESTIONS = 10


class Answer(BaseModel):
    """What the LLM returns for one player input."""

    # Declared first so the model identifies supporting facts before answering.
    provenance: str = Field(
        description=(
            "Only brief factual evidence (中文) supporting the answer or guess match, "
            "No reasoning steps, question classification, "
            "answer conclusion, or win/loss judgment."
        )
    )
    is_guess: bool = Field(
        description="True if the player named a figure instead of asking a yes/no question"
    )
    is_correct: bool = Field(
        description="True only when is_guess is True and it matches the secret figure"
    )
    answer: Literal["yes", "no", "n/a"] = Field(
        description="Yes/no reply to the question; 'n/a' when the input was a guess"
    )


class Turn(Answer):
    question: str


class State(TypedDict):
    secret_figure: str
    secret_profile: str
    history: Annotated[list[Turn], add]
    current_question: str
    question_asked: int
    status: Literal["playing", "won", "lost", "gave_up"]
