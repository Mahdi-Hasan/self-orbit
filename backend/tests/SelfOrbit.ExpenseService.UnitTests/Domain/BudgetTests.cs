using FluentAssertions;
using SelfOrbit.ExpenseService.Domain.Aggregates;
using SelfOrbit.ExpenseService.Domain.Enums;
using SelfOrbit.ExpenseService.Domain.ValueObjects;

namespace SelfOrbit.ExpenseService.UnitTests.Domain;

public class BudgetTests
{
    [Fact]
    public void Create_ShouldSetInitialValues()
    {
        var limit = new Money(1000m, "USD");
        var budget = Budget.Create(limit, BudgetPeriod.Monthly, Guid.NewGuid(), DateTime.UtcNow);

        budget.Limit.Should().Be(limit);
        budget.CurrentSpend.Amount.Should().Be(0);
        budget.IsActive.Should().BeTrue();
        budget.IsOverBudget.Should().BeFalse();
    }

    [Fact]
    public void AddSpend_ShouldIncreaseCurrentSpend()
    {
        var budget = Budget.Create(new Money(500m, "USD"), BudgetPeriod.Monthly, Guid.NewGuid(), DateTime.UtcNow);
        budget.AddSpend(new Money(200m, "USD"));

        budget.CurrentSpend.Amount.Should().Be(200m);
        budget.RemainingAmount.Should().Be(300m);
    }

    [Fact]
    public void IsOverBudget_WhenExceeded_ShouldBeTrue()
    {
        var budget = Budget.Create(new Money(100m, "USD"), BudgetPeriod.Daily, Guid.NewGuid(), DateTime.UtcNow);
        budget.AddSpend(new Money(150m, "USD"));

        budget.IsOverBudget.Should().BeTrue();
    }

    [Fact]
    public void UtilizationPercentage_ShouldCalculateCorrectly()
    {
        var budget = Budget.Create(new Money(200m, "USD"), BudgetPeriod.Weekly, Guid.NewGuid(), DateTime.UtcNow);
        budget.AddSpend(new Money(50m, "USD"));

        budget.UtilizationPercentage.Should().Be(25m);
    }

    [Fact]
    public void Deactivate_ShouldSetInactive()
    {
        var budget = Budget.Create(new Money(100m, "USD"), BudgetPeriod.Monthly, Guid.NewGuid(), DateTime.UtcNow);
        budget.Deactivate();

        budget.IsActive.Should().BeFalse();
    }
}
