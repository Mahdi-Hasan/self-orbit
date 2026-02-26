# ADR-002: gRPC for Inter-Service Communication

## Status: Accepted

## Context
Backend services need to communicate with the AI infrastructure. Options: REST, gRPC, message queue.

## Decision
Use gRPC with Protocol Buffers for all inter-service communication. REST reserved for client-facing APIs only.

## Consequences
- **Positive**: Strong typing, code generation, lower latency, HTTP/2, streaming support
- **Negative**: Requires protobuf tooling, less human-readable on the wire
