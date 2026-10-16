import random

from pydantic import BaseModel, Field
from langchain.messages import HumanMessage
from guess_game.core.state import State
from guess_game.core import structured_llm


class Figure(BaseModel):
    name: str = Field(
        description="The full personal name of one specific real person, e.g. 荀彧, 李白. Never a title or role."
    )
    dynasty: str = Field(description="The dynasty of the figure")
    role: str = Field(description="The figure's role, e.g. 皇帝, 谋臣, 武将, 文人")


class Candidates(BaseModel):
    figures: list[Figure] = Field(description="Distinct candidate figures")


DYNASTIES = {
    "先秦": 1,
    "秦": 2,
    "东汉/西汉": 3,
    "三国": 100,
    "晋": 2,
    "隋": 1,
    "唐": 3,
    "宋": 2,
    "元": 1,
    "明": 8,
    "清": 2,
    "近现代": 1,
}

CANDIDATE_COUNT = 50


def pick_figure(state: State) -> State:
    chain = structured_llm(Candidates)
    dynasty = random.choices(
        list(DYNASTIES.keys()),
        weights=list(DYNASTIES.values()),
    )[0]

    prompt = (
        f"List {CANDIDATE_COUNT} different, famous, real Chinese historical people "
        f"from the {dynasty} period, covering a variety of roles."
    )

    result = chain.invoke({"messages": [HumanMessage(content=prompt)]})
    figures = list({f.name.strip(): f for f in result.figures if f.name.strip()}.values())
    figure = random.choice(figures)

    return {
        "secret_figure": figure.name.strip(),
        "secret_profile": f"{figure.dynasty} · {figure.role}",
        "status": "playing",
        "question_asked": 0,
    }
