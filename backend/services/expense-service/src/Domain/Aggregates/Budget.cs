using SelfOrbit.BuildingBlocks.Domain;
using SelfOrbit.ExpenseService.Domain.Enums;
using SelfOrbit.ExpenseService.Domain.ValueObjects;

namespace SelfOrbit.ExpenseService.Domain.Aggregates;

/// <summary>
/// Budget aggregate root — defines spending limits per category and period.
/// </summary>
public class Budget : AggregateRoot
{
    public Money Limit { get; private set; } = null!;
    public Money CurrentSpend { get; private set; } = null!;
    public BudgetPeriod Period { get; private set; }
    public Guid CategoryId { get; private set; }
    public DateTime StartDate { get; private set; }
    public DateTime EndDate { get; private set; }
    public bool IsActive { get; private set; }

    private Budget() { }

    public static Budget Create(Money limit, BudgetPeriod period, Guid categoryId, DateTime startDate)
    {
        var endDate = period switch
        {
            BudgetPeriod.Daily => startDate.AddDays(1),
            BudgetPeriod.Weekly => startDate.AddDays(7),
            BudgetPeriod.Monthly => startDate.AddMonths(1),
            BudgetPeriod.Yearly => startDate.AddYears(1),
            _ => throw new ArgumentOutOfRangeException(nameof(period))
        };

        return new Budget
        {
            Limit = limit,
            CurrentSpend = new Money(0, limit.Currency),
            Period = period,
            CategoryId = categoryId,
            StartDate = startDate,
            EndDate = endDate,
            IsActive = true
        };
    }

    public void AddSpend(Money amount)
    {
        CurrentSpend = CurrentSpend.Add(amount);
    }

    public bool IsOverBudget => CurrentSpend.Amount > Limit.Amount;

    public decimal RemainingAmount => Limit.Amount - CurrentSpend.Amount;

    public decimal UtilizationPercentage =>
        Limit.Amount == 0 ? 0 : (CurrentSpend.Amount / Limit.Amount) * 100;

    public void Deactivate()
    {
        IsActive = false;
    }
}
