from typing import TypeVar

from langchain_aws import ChatBedrockConverse
from pydantic import BaseModel
from langchain_core.runnables import Runnable
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import SystemMessage
from langchain_core.language_models import LanguageModelInput

SYSTEM_PROMPT = """
You are a Chinese history quiz assistant.
Always respond in Chinese (中文), including all names, dynasty labels, and explanations.
"""

model = ChatBedrockConverse(
    model_id="global.anthropic.claude-haiku-5-5",
    credentials_profile_name="dev004",
    region_name="eu-west-1",
    disable_streaming=False,
)

prompt = ChatPromptTemplate.from_messages(
    [
        SystemMessage(content=SYSTEM_PROMPT),
        MessagesPlaceholder("messages"),
    ]
)

llm = prompt | model

T = TypeVar("T", bound=BaseModel)


def structured_llm(schema: type[T]) -> Runnable[LanguageModelInput, T]:
    return prompt | model.with_structured_output(schema)
