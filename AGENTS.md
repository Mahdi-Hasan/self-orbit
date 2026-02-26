# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

Self-Orbit is a cloud-native, event-driven microservices platform for personal intelligence. The system is a polyglot monorepo using .NET 10, Python 3.13, and Next.js 15, orchestrated via Nx and Docker Compose.

## Architecture

### Monorepo Structure
- `backend/` — .NET 10 microservices implementing Clean Architecture + CQRS
  - `services/expense-service/` — Financial tracking and budgeting
  - `services/productivity-service/` — Tasks and journal management
  - `gateway/` — YARP reverse proxy for API routing
  - `building-blocks/` — Shared cross-cutting concerns (domain, application, infrastructure, contracts)
  - `tests/` — xUnit test projects
- `ai-infrastructure/` — Python FastAPI + gRPC server for NLP processing
- `frontend/` — Next.js 15 with App Router and TypeScript (strict mode)
- `contracts/proto/` — Shared Protobuf definitions for gRPC communication
- `k8s/` — Kubernetes deployment manifests

### Communication Flow
1. Frontend → Gateway (REST/JSON)
2. Gateway → Services (HTTP via YARP routing)
3. Services → AI Engine (gRPC/Protobuf)
4. Services → PostgreSQL (one database per service)

### Clean Architecture Layers (.NET Services)
Each service follows Clean Architecture with strict dependency rules:
- `Domain/` — Entities, value objects, aggregate roots (no dependencies)
- `Application/` — Commands, queries, handlers, interfaces (depends on Domain only)
- `Infrastructure/` — EF Core, gRPC clients, external integrations (depends on Application)
- `Api/` — ASP.NET Core controllers, middleware (depends on Application + Infrastructure)

### Building Blocks (Shared Code)
The `building-blocks/` directory contains reusable abstractions:
- `domain/` — Base entity classes, domain event primitives
- `application/` — CQRS abstractions (ICommand<T>, IQuery<T>), validation/logging behaviors
- `infrastructure/` — EF Core base repositories, Unit of Work pattern
- `contracts/` — Shared DTOs and protobuf-generated C# classes

### Protobuf Contracts
All gRPC communication uses contracts defined in `contracts/proto/`:
- `ai_service.proto` — Service definition with RPC methods
- `expense_messages.proto`, `task_messages.proto`, `journal_messages.proto` — Request/response messages
- Compiled stubs are generated for both .NET (C#) and Python

## Development Commands

### Environment Setup
```bash
# Install all dependencies
npm install

# Start PostgreSQL only
docker-compose up -d postgres

# Full stack via Docker Compose
docker-compose up --build
```

### Running Services Locally

#### AI Infrastructure (Python)
```bash
cd ai-infrastructure
python -m venv .venv
.venv\Scripts\Activate.ps1  # Windows
pip install -e ".[dev]"
pytest                       # Run tests
ruff check .                 # Lint
mypy .                       # Type check
uvicorn app.main:app --reload --port 8000
```

#### Backend (.NET Services)
```bash
cd backend
dotnet restore SelfOrbit.sln
dotnet build SelfOrbit.sln
dotnet test                  # Run all tests
dotnet run --project services/expense-service/src/Api
dotnet run --project services/productivity-service/src/Api
dotnet run --project gateway/src/SelfOrbit.Gateway
```

#### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev                  # http://localhost:3000
npm run build
npm run lint
```

### Nx Workspace Commands
```bash
npm run build:all            # Build all projects
npm run test:all             # Test all projects
npm run lint:all             # Lint all projects
npm run affected:test        # Test only affected projects
npm run affected:build       # Build only affected projects
npm run graph                # Visualize dependencies
```

### Testing Individual Services
```bash
# .NET unit tests
dotnet test backend/tests/SelfOrbit.ExpenseService.UnitTests
dotnet test backend/tests/SelfOrbit.ProductivityService.UnitTests

# Python tests
cd ai-infrastructure && pytest tests/ -v
cd ai-infrastructure && pytest tests/test_specific.py::test_function_name

# Frontend tests (if configured)
cd frontend && npm test
```

### Database Migrations (EF Core)
```bash
# Add migration (from service directory)
cd backend/services/expense-service
dotnet ef migrations add MigrationName --startup-project src/Api --project src/Infrastructure

# Apply migrations
dotnet ef database update --startup-project src/Api --project src/Infrastructure

# Same pattern for productivity-service
cd backend/services/productivity-service
dotnet ef migrations add MigrationName --startup-project src/Api --project src/Infrastructure
```

## Code Patterns and Conventions

### CQRS Implementation
- All business logic uses the CQRS pattern via LiteBus
- Commands (writes): Implement `ICommand<TResult>` or `ICommand`
- Queries (reads): Implement `IQuery<TResult>`
- Handlers are registered automatically via DI
- Validation occurs in pipeline behaviors (FluentValidation)
- No business logic in controllers — controllers only dispatch commands/queries

### Domain-Driven Design
- Aggregate roots enforce invariants and coordinate changes
- Value objects are immutable and compared by value
- Domain events signal state changes
- Repository pattern abstracts data access (generic repository in building-blocks)
- Unit of Work pattern ensures transactional consistency

### Dependency Injection
- Service registration follows layer boundaries
- Infrastructure depends on Application (via interfaces)
- Application never references Infrastructure directly
- Use extension methods like `AddInfrastructure()`, `AddApplication()` for clean DI setup

### gRPC Communication
- .NET services use generated gRPC clients to call AI service
- Clients are configured via `appsettings.json` with retry policies
- gRPC channel management is handled in Infrastructure layer
- Always use async/await for gRPC calls

### Error Handling
- Domain exceptions for business rule violations
- Application exceptions for use case failures
- Infrastructure exceptions for external system failures
- Global exception middleware in Api layer translates exceptions to HTTP responses

### Logging
- Structured logging via Serilog (JSON format)
- Correlation IDs propagated across service boundaries
- Log at appropriate levels: Debug, Information, Warning, Error, Critical
- Avoid logging sensitive data (PII, credentials)

### Configuration
- Environment variables for all deployment-specific settings
- `appsettings.json` for defaults
- `appsettings.Development.json` for local overrides
- Never commit secrets (use user secrets or environment variables)

## Important Notes

### Database Per Service
Each microservice owns its database:
- `selforbit_expense` for Expense Service
- `selforbit_productivity` for Productivity Service
- Never access another service's database directly

### No Lazy Loading
EF Core lazy loading is disabled. Always use explicit `.Include()` for related entities.

### API Versioning
All REST endpoints are versioned: `/api/v1/...`

### Kubernetes Readiness
Services include health check endpoints and are designed for horizontal scaling.

### Testing Strategy
- Unit tests: Pure domain logic and handlers (xUnit, pytest)
- Integration tests: Database interactions, gRPC communication
- Contract tests: Protobuf schema validation

### Frontend-Backend Contract
Frontend communicates exclusively through the API Gateway. Direct service access is prohibited.
