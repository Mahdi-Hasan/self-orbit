using Xunit;
using FluentAssertions;
using SelfOrbit.ExpenseService.Domain.Aggregates;
using SelfOrbit.ExpenseService.Domain.Enums;
using SelfOrbit.ExpenseService.Domain.Events;
using SelfOrbit.ExpenseService.Domain.ValueObjects;

namespace SelfOrbit.ExpenseService.UnitTests.Domain;

public class ExpenseTests
{
    [Fact]
    public void Create_ValidData_ShouldCreateExpense()
    {
        var money = new Money(25.50m, "USD");
        var expense = Expense.Create(money, "Lunch", Guid.NewGuid(), DateTime.UtcNow);

        expense.Should().NotBeNull();
        expense.Amount.Should().Be(money);
        expense.Description.Should().Be("Lunch");
        expense.Status.Should().Be(ExpenseStatus.Draft);
    }

    [Fact]
    public void Create_ShouldRaiseDomainEvent()
    {
        var money = new Money(50m, "USD");
        var expense = Expense.Create(money, "Dinner", Guid.NewGuid(), DateTime.UtcNow);

        expense.DomainEvents.Should().ContainSingle()
            .Which.Should().BeOfType<ExpenseCreatedEvent>();
    }

    [Fact]
    public void Create_EmptyDescription_ShouldThrow()
    {
        var money = new Money(10m, "USD");
        var act = () => Expense.Create(money, "", Guid.NewGuid(), DateTime.UtcNow);

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Confirm_DraftExpense_ShouldTransitionToConfirmed()
    {
        var expense = Expense.Create(new Money(10m, "USD"), "Coffee", Guid.NewGuid(), DateTime.UtcNow);
        expense.Confirm();

        expense.Status.Should().Be(ExpenseStatus.Confirmed);
    }

    [Fact]
    public void Confirm_ConfirmedExpense_ShouldThrow()
    {
        var expense = Expense.Create(new Money(10m, "USD"), "Coffee", Guid.NewGuid(), DateTime.UtcNow);
        expense.Confirm();

        var act = () => expense.Confirm();
        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void Archive_ShouldTransitionToArchived()
    {
        var expense = Expense.Create(new Money(10m, "USD"), "Coffee", Guid.NewGuid(), DateTime.UtcNow);
        expense.Archive();

        expense.Status.Should().Be(ExpenseStatus.Archived);
    }

    [Fact]
    public void UpdateAmount_ArchivedExpense_ShouldThrow()
    {
        var expense = Expense.Create(new Money(10m, "USD"), "Coffee", Guid.NewGuid(), DateTime.UtcNow);
        expense.Archive();

        var act = () => expense.UpdateAmount(new Money(20m, "USD"));
        act.Should().Throw<InvalidOperationException>();
    }
}
