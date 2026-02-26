# ADR-001: CQRS Pattern

## Status: Accepted

## Context
We need a pattern that separates read and write concerns to optimize each independently and keep business logic organized.

## Decision
Adopt Command Query Responsibility Segregation (CQRS) using LiteBus as the mediator.

## Consequences
- **Positive**: Clear separation of concerns, testable handlers, scalable read models
- **Negative**: More boilerplate per operation, learning curve for new developers
