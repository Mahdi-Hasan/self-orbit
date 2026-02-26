using SelfOrbit.BuildingBlocks.Domain;

namespace SelfOrbit.ExpenseService.Domain.Events;

/// <summary>
/// Domain event raised when a new expense is created.
/// </summary>
public record ExpenseCreatedEvent(Guid ExpenseId, decimal Amount, string Currency) : DomainEvent;
