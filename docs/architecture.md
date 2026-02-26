# Self-Orbit: Architecture Documentation

## System Overview

Self-Orbit is a cloud-native personal intelligence platform decomposed into bounded contexts communicating via gRPC and REST.

## Bounded Contexts

### 1. Financial Context (Expense Service)
- Expense tracking, categorization, and budgeting
- Owns: `expense-db` PostgreSQL instance

### 2. Productivity Context (Productivity Service)  
- Task management with state machine lifecycle
- Audio journaling with AI transcription and summarization
- Owns: `productivity-db` PostgreSQL instance

### 3. Intelligence Context (AI Infrastructure)
- Stateless NLP processing engine
- Exposes gRPC server consumed by backend services
- No persistent state — pure compute

## Data Flow

1. User submits natural language via Frontend
2. Gateway routes to appropriate backend service
3. Backend service sends raw text to AI Engine via gRPC
4. AI Engine returns structured data (parsed expense, parsed task, transcription, summary)
5. Backend service persists structured data to its database
6. Response returned to Frontend

## Communication Patterns

| Path | Protocol | Why |
|------|----------|-----|
| Frontend → Gateway | REST/JSON | Browser compatibility |
| Gateway → Services | HTTP | Internal routing |
| Services → AI Engine | gRPC/Protobuf | Low latency, type safety, streaming capability |
