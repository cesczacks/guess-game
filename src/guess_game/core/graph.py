from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.checkpoint.serde.jsonplus import JsonPlusSerializer
from guess_game.core.state import State
from guess_game.nodes import pick_figure, get_user_question, answer_question

graph = StateGraph(State)
graph.add_node("pick_figure", pick_figure)
graph.add_node("get_user_question", get_user_question)
graph.add_node("answer_question", answer_question)

graph.set_entry_point("pick_figure")

graph.add_edge("pick_figure", "get_user_question")
graph.add_conditional_edges(
    "get_user_question",
    lambda state: END if state.get("status") == "gave_up" else "answer_question",
    {
        END: END,
        "answer_question": "answer_question",
    },
)
graph.add_conditional_edges(
    "answer_question",
    lambda state: END if state.get("status") != "playing" else "get_user_question",
    {
        END: END,
        "get_user_question": "get_user_question",
    },
)

serde = JsonPlusSerializer(allowed_msgpack_modules=[("guess_game.core.state", "Turn")])
game = graph.compile(checkpointer=MemorySaver(serde=serde))
