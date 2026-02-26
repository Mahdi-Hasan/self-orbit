using Microsoft.EntityFrameworkCore;
using SelfOrbit.BuildingBlocks.Domain;

namespace SelfOrbit.BuildingBlocks.Infrastructure;

/// <summary>
/// Base DbContext with domain event dispatch and audit timestamp support.
/// </summary>
public abstract class BaseDbContext : DbContext
{
    protected BaseDbContext(DbContextOptions options) : base(options) { }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAuditTimestamps();
        var result = await base.SaveChangesAsync(cancellationToken);
        await DispatchDomainEventsAsync();
        return result;
    }

    private void ApplyAuditTimestamps()
    {
        var entries = ChangeTracker.Entries<IAuditableEntity>();

        foreach (var entry in entries)
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }
    }

    private async Task DispatchDomainEventsAsync()
    {
        var aggregateRoots = ChangeTracker.Entries<AggregateRoot>()
            .Where(e => e.Entity.DomainEvents.Count != 0)
            .Select(e => e.Entity)
            .ToList();

        var domainEvents = aggregateRoots
            .SelectMany(ar => ar.DomainEvents)
            .ToList();

        aggregateRoots.ForEach(ar => ar.ClearDomainEvents());

        // TODO: Dispatch events via event bus or mediator
        await Task.CompletedTask;
    }
}
