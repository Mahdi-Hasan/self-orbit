"""gRPC interceptors for logging and error mapping."""

from collections.abc import Callable
from typing import Any

import grpc

from app.core.logging import get_logger

logger = get_logger(__name__)


class LoggingInterceptor(grpc.aio.ServerInterceptor):
    """Server interceptor that logs all incoming gRPC requests."""

    async def intercept_service(
        self,
        continuation: Callable[..., Any],
        handler_call_details: grpc.HandlerCallDetails,
    ) -> Any:
        """Intercept and log gRPC calls.

        Args:
            continuation: The next handler in the chain.
            handler_call_details: Details about the incoming call.

        Returns:
            The handler response.
        """
        method = handler_call_details.method
        logger.info("grpc_request_received", method=method)

        try:
            response = await continuation(handler_call_details)
            logger.info("grpc_request_completed", method=method)
            return response
        except Exception as e:
            logger.error("grpc_request_failed", method=method, error=str(e))
            raise
