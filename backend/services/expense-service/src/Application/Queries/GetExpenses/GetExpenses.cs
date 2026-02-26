using SelfOrbit.BuildingBlocks.Application.CQRS;
using SelfOrbit.ExpenseService.Application.DTOs;
using SelfOrbit.ExpenseService.Application.Interfaces;

namespace SelfOrbit.ExpenseService.Application.Queries.GetExpenses;

// --- Query ---
public record GetExpensesQuery(
    DateTime? From,
    DateTime? To,
    Guid? CategoryId,
    int Page = 1,
    int PageSize = 20) : IQuery<IReadOnlyList<ExpenseDto>>;

// --- Handler ---
public class GetExpensesHandler
{
    private readonly IExpenseRepository _repository;

    public GetExpensesHandler(IExpenseRepository repository)
    {
        _repository = repository;
    }

    public async Task<IReadOnlyList<ExpenseDto>> HandleAsync(GetExpensesQuery query, CancellationToken ct)
    {
        var expenses = query switch
        {
            { From: not null, To: not null } =>
                await _repository.GetByDateRangeAsync(query.From.Value, query.To.Value, ct),
            { CategoryId: not null } =>
                await _repository.GetByCategoryAsync(query.CategoryId.Value, ct),
            _ =>
                await _repository.GetAllAsync(ct)
        };

        return expenses.Select(e => new ExpenseDto(
            e.Id,
            e.Amount.Amount,
            e.Amount.Currency,
            e.Description,
            e.Merchant,
            e.ExpenseDate,
            e.Status.ToString(),
            e.CategoryId,
            e.Category?.Name,
            e.Tags,
            e.Notes,
            e.CreatedAt,
            e.UpdatedAt)).ToList();
    }
}
