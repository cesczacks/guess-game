from guess_game.core.state import State, Answer, Turn, MAX_QUESTIONS
from guess_game.core.llm import structured_llm
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage


def answer_question(state: State) -> State:
    question = state.get("current_question")
    secret_figure = state.get("secret_figure")
    secret_profile = state.get("secret_profile", "")
    question_asked = state.get("question_asked", 0)
    history = state.get("history", [])

    system_prompt = f"""
      You are the secret figure in a guessing game. The secret figure is {secret_figure} ({secret_profile}).
      If several people share this name, you are the one matching that dynasty and role.
      The player will either ASK a yes/no question, or GUESS by naming a person.

      Decide which it is and fill the fields:

      • If the input NAMES a specific person as who they think you are
      (e.g. "朱元璋", "是朱元璋吗", "你是李白吗"):
          is_guess   = true
          is_correct = true ONLY if that named person is {secret_figure}, else false
          answer     = "n/a"

      • Otherwise it is a yes/no QUESTION about era, role, attributes, or relations
      (e.g. "是皇帝吗", "朱棣的父亲吗", "是唐朝的吗"):
          is_guess   = false
          is_correct = false          # a question can NEVER win the game
          answer     = "yes" or "no", truthfully from {secret_figure}'s perspective

      Fill provenance FIRST: briefly reason (中文) about the facts, then set
      is_guess / is_correct / answer so they agree with that reasoning.
    """
    messages = [SystemMessage(content=system_prompt)]

    for turn in history:
        messages.extend(
            [
                HumanMessage(content=turn.question),
                AIMessage(content=turn.model_dump_json(exclude={"question"})),
            ]
        )

    messages.append(HumanMessage(content=question))

    result: Answer = structured_llm(Answer).invoke({"messages": messages})

    question_asked += 1
    return {
        "history": [Turn(question=question, **result.model_dump())],
        "question_asked": question_asked,
        "status": (
            "won"
            if result.is_correct
            else "lost" if question_asked >= MAX_QUESTIONS else "playing"
        ),
    }
