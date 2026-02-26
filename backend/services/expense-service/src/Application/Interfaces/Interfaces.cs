using SelfOrbit.BuildingBlocks.Domain;
using SelfOrbit.ExpenseService.Domain.Aggregates;

namespace SelfOrbit.ExpenseService.Application.Interfaces;

/// <summary>
/// Expense-specific repository interface.
/// </summary>
public interface IExpenseRepository : IRepository<Expense>
{
    Task<IReadOnlyList<Expense>> GetByDateRangeAsync(DateTime from, DateTime to, CancellationToken ct = default);
    Task<IReadOnlyList<Expense>> GetByCategoryAsync(Guid categoryId, CancellationToken ct = default);
}

/// <summary>
/// Budget-specific repository interface.
/// </summary>
public interface IBudgetRepository : IRepository<Budget>
{
    Task<Budget?> GetActiveBudgetAsync(Guid categoryId, CancellationToken ct = default);
    Task<IReadOnlyList<Budget>> GetActiveBudgetsAsync(CancellationToken ct = default);
}

/// <summary>
/// AI service client interface for gRPC communication.
/// </summary>
public interface IAiServiceClient
{
    Task<AiParsedExpense> ParseExpenseAsync(string rawText, string currency, CancellationToken ct = default);
}

public record AiParsedExpense(
    decimal Amount,
    string Currency,
    string Category,
    string Description,
    string? Merchant,
    DateTime? Date,
    string Confidence);
