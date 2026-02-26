using SelfOrbit.BuildingBlocks.Domain;
using SelfOrbit.ExpenseService.Domain.Entities;
using SelfOrbit.ExpenseService.Domain.Enums;
using SelfOrbit.ExpenseService.Domain.Events;
using SelfOrbit.ExpenseService.Domain.ValueObjects;

namespace SelfOrbit.ExpenseService.Domain.Aggregates;

/// <summary>
/// Expense aggregate root — the core domain entity for financial tracking.
/// Encapsulates all expense-related business rules and invariants.
/// </summary>
public class Expense : AggregateRoot
{
    public Money Amount { get; private set; } = null!;
    public string Description { get; private set; } = string.Empty;
    public string? Merchant { get; private set; }
    public DateTime ExpenseDate { get; private set; }
    public ExpenseStatus Status { get; private set; }
    public Guid CategoryId { get; private set; }
    public Category? Category { get; private set; }
    public List<string> Tags { get; private set; } = [];
    public string? Notes { get; private set; }

    private Expense() { }

    /// <summary>
    /// Factory method for creating a new expense.
    /// Enforces all creation invariants.
    /// </summary>
    public static Expense Create(
        Money amount,
        string description,
        Guid categoryId,
        DateTime expenseDate,
        string? merchant = null,
        List<string>? tags = null,
        string? notes = null)
    {
        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException("Description is required.", nameof(description));

        var expense = new Expense
        {
            Amount = amount,
            Description = description,
            CategoryId = categoryId,
            ExpenseDate = expenseDate,
            Merchant = merchant,
            Status = ExpenseStatus.Draft,
            Tags = tags ?? [],
            Notes = notes
        };

        expense.AddDomainEvent(new ExpenseCreatedEvent(expense.Id, amount.Amount, amount.Currency));

        return expense;
    }

    public void Confirm()
    {
        if (Status != ExpenseStatus.Draft)
            throw new InvalidOperationException("Only draft expenses can be confirmed.");
        Status = ExpenseStatus.Confirmed;
    }

    public void Archive()
    {
        if (Status == ExpenseStatus.Archived)
            throw new InvalidOperationException("Expense is already archived.");
        Status = ExpenseStatus.Archived;
    }

    public void UpdateAmount(Money newAmount)
    {
        if (Status == ExpenseStatus.Archived)
            throw new InvalidOperationException("Cannot modify archived expenses.");
        Amount = newAmount;
    }
}
