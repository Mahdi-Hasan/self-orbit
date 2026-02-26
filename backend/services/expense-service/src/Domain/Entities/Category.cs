using SelfOrbit.BuildingBlocks.Domain;

namespace SelfOrbit.ExpenseService.Domain.Entities;

/// <summary>
/// Category entity for expense classification.
/// </summary>
public class Category : Entity
{
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public string? Icon { get; private set; }
    public bool IsDefault { get; private set; }

    private Category() { }

    public static Category Create(string name, string? description = null, string? icon = null, bool isDefault = false)
    {
        return new Category
        {
            Name = name,
            Description = description,
            Icon = icon,
            IsDefault = isDefault
        };
    }

    public void UpdateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) throw new ArgumentException("Name is required.", nameof(name));
        Name = name;
    }
}
