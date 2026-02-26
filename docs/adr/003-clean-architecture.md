# ADR-003: Clean Architecture

## Status: Accepted

## Context
We need a layered architecture that keeps domain logic independent of frameworks and infrastructure.

## Decision
Adopt Clean Architecture with four layers: Domain, Application, Infrastructure, API.

## Consequences
- **Positive**: Framework independence, testability, clear dependency direction
- **Negative**: More projects per service, mapping overhead between layers
