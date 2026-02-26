using FluentAssertions;
using SelfOrbit.ExpenseService.Domain.ValueObjects;

namespace SelfOrbit.ExpenseService.UnitTests.Domain;

public class MoneyTests
{
    [Fact]
    public void Constructor_ValidData_ShouldCreate()
    {
        var money = new Money(100m, "USD");

        money.Amount.Should().Be(100m);
        money.Currency.Should().Be("USD");
    }

    [Fact]
    public void Constructor_NegativeAmount_ShouldThrow()
    {
        var act = () => new Money(-10m, "USD");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Constructor_InvalidCurrency_ShouldThrow()
    {
        var act = () => new Money(10m, "US");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Equals_SameAmountAndCurrency_ShouldBeEqual()
    {
        var a = new Money(50m, "USD");
        var b = new Money(50m, "USD");

        a.Should().Be(b);
        (a == b).Should().BeTrue();
    }

    [Fact]
    public void Equals_DifferentAmount_ShouldNotBeEqual()
    {
        var a = new Money(50m, "USD");
        var b = new Money(100m, "USD");

        a.Should().NotBe(b);
    }

    [Fact]
    public void Add_SameCurrency_ShouldReturnSum()
    {
        var a = new Money(30m, "USD");
        var b = new Money(20m, "USD");

        var result = a.Add(b);

        result.Amount.Should().Be(50m);
    }

    [Fact]
    public void Add_DifferentCurrency_ShouldThrow()
    {
        var a = new Money(30m, "USD");
        var b = new Money(20m, "EUR");

        var act = () => a.Add(b);
        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void ToString_ShouldFormatCorrectly()
    {
        var money = new Money(99.99m, "USD");
        money.ToString().Should().Be("99.99 USD");
    }
}
