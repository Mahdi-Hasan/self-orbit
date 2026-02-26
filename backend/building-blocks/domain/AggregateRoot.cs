namespace SelfOrbit.BuildingBlocks.Domain;

/// <summary>
/// Base class for aggregate roots.
/// Aggregates are the consistency boundaries and domain event publishers.
/// </summary>
public abstract class AggregateRoot : Entity, IAuditableEntity
{
    private readonly List<IDomainEvent> _domainEvents = [];

    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    protected void AddDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}
