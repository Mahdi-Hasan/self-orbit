"""Base pipeline — composable processing chain pattern."""

from abc import ABC, abstractmethod
from typing import Any, Generic, TypeVar

from app.core.exceptions import PipelineError
from app.core.logging import get_logger

logger = get_logger(__name__)

TInput = TypeVar("TInput")
TOutput = TypeVar("TOutput")


class PipelineStep(ABC, Generic[TInput, TOutput]):
    """Abstract base for a single pipeline step."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Step name for logging and error reporting."""
        ...

    @abstractmethod
    async def execute(self, input_data: TInput) -> TOutput:
        """Execute this pipeline step.

        Args:
            input_data: Input to this step.

        Returns:
            Processed output.

        Raises:
            PipelineError: If processing fails.
        """
        ...


class Pipeline(Generic[TInput, TOutput]):
    """Composable processing pipeline.

    Chains multiple steps together, passing the output of each
    step as the input to the next.
    """

    def __init__(self, name: str) -> None:
        self.name = name
        self._steps: list[PipelineStep[Any, Any]] = []

    def add_step(self, step: PipelineStep[Any, Any]) -> "Pipeline[TInput, TOutput]":
        """Add a step to the pipeline.

        Args:
            step: Pipeline step to add.

        Returns:
            Self for fluent chaining.
        """
        self._steps.append(step)
        return self

    async def execute(self, input_data: TInput) -> TOutput:
        """Execute the full pipeline.

        Args:
            input_data: Initial pipeline input.

        Returns:
            Final pipeline output.

        Raises:
            PipelineError: If any step fails.
        """
        logger.info("pipeline_started", pipeline=self.name, steps=len(self._steps))

        current: Any = input_data

        for step in self._steps:
            try:
                logger.debug("pipeline_step_executing", pipeline=self.name, step=step.name)
                current = await step.execute(current)
                logger.debug("pipeline_step_completed", pipeline=self.name, step=step.name)
            except PipelineError:
                raise
            except Exception as e:
                raise PipelineError(message=str(e), step=step.name) from e

        logger.info("pipeline_completed", pipeline=self.name)
        return current
