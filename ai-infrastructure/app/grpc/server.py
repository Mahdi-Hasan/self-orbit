"""Async gRPC server bootstrap with graceful shutdown."""

import asyncio
from concurrent import futures

import grpc

from app.core.config import get_settings
from app.core.logging import get_logger
from app.grpc.handlers.expense_handler import ExpenseServiceHandler
from app.grpc.handlers.journal_handler import JournalServiceHandler
from app.grpc.handlers.task_handler import TaskServiceHandler
from app.grpc.interceptors import LoggingInterceptor

logger = get_logger(__name__)


class GrpcServer:
    """Async gRPC server with graceful shutdown support."""

    def __init__(self) -> None:
        self._settings = get_settings()
        self._server: grpc.aio.Server | None = None

    async def start(self) -> None:
        """Start the gRPC server."""
        self._server = grpc.aio.server(
            futures.ThreadPoolExecutor(max_workers=self._settings.grpc_max_workers),
            interceptors=[LoggingInterceptor()],
            options=[
                ("grpc.max_receive_message_length", self._settings.grpc_max_message_length),
                ("grpc.max_send_message_length", self._settings.grpc_max_message_length),
            ],
        )

        # Register service handlers
        # NOTE: In production, register generated servicer classes here.
        # These handlers implement the AIService proto contract.
        self._register_services()

        listen_addr = f"[::]:{self._settings.grpc_port}"
        self._server.add_insecure_port(listen_addr)

        await self._server.start()
        logger.info("grpc_server_started", port=self._settings.grpc_port)

    async def stop(self) -> None:
        """Gracefully stop the gRPC server."""
        if self._server:
            await self._server.stop(grace=5)
            logger.info("grpc_server_stopped")

    async def wait_for_termination(self) -> None:
        """Wait for the server to terminate."""
        if self._server:
            await self._server.wait_for_termination()

    def _register_services(self) -> None:
        """Register all gRPC service handlers.

        After generating protobuf Python stubs, register servicers here:
            ai_service_pb2_grpc.add_AIServiceServicer_to_server(
                AIServiceServicer(), self._server
            )
        """
        # TODO: Register auto-generated servicers after protobuf compilation
        _ = ExpenseServiceHandler()
        _ = TaskServiceHandler()
        _ = JournalServiceHandler()
        logger.info("grpc_services_registered")


async def serve() -> None:
    """Entry point for standalone gRPC server."""
    server = GrpcServer()
    await server.start()

    try:
        await server.wait_for_termination()
    except asyncio.CancelledError:
        await server.stop()
