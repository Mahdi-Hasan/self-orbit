namespace SelfOrbit.BuildingBlocks.Domain;

/// <summary>
/// Interface for entities that support audit timestamps.
/// </summary>
public interface IAuditableEntity
{
    DateTime CreatedAt { get; set; }
    DateTime? UpdatedAt { get; set; }
}
