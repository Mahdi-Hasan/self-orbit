using FluentValidation;
using SelfOrbit.BuildingBlocks.Application.CQRS;
using SelfOrbit.BuildingBlocks.Domain;
using SelfOrbit.ExpenseService.Application.Interfaces;
using SelfOrbit.ExpenseService.Domain.Aggregates;
using SelfOrbit.ExpenseService.Domain.Enums;
using SelfOrbit.ExpenseService.Domain.ValueObjects;

namespace SelfOrbit.ExpenseService.Application.Commands.SetBudget;

// --- Command ---
public record SetBudgetCommand(
    decimal LimitAmount,
    string Currency,
    BudgetPeriod Period,
    Guid CategoryId) : ICommand<Result<Guid>>;

// --- Handler ---
public class SetBudgetHandler
{
    private readonly IBudgetRepository _budgetRepository;
    private readonly IUnitOfWork _unitOfWork;

    public SetBudgetHandler(IBudgetRepository budgetRepository, IUnitOfWork unitOfWork)
    {
        _budgetRepository = budgetRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> HandleAsync(SetBudgetCommand command, CancellationToken ct)
    {
        // Deactivate existing budget for the same category
        var existing = await _budgetRepository.GetActiveBudgetAsync(command.CategoryId, ct);
        existing?.Deactivate();

        var limit = new Money(command.LimitAmount, command.Currency);
        var budget = Budget.Create(limit, command.Period, command.CategoryId, DateTime.UtcNow);

        await _budgetRepository.AddAsync(budget, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return Result<Guid>.Success(budget.Id);
    }
}

// --- Validator ---
public class SetBudgetValidator : AbstractValidator<SetBudgetCommand>
{
    public SetBudgetValidator()
    {
        RuleFor(x => x.LimitAmount).GreaterThan(0).WithMessage("Budget limit must be positive.");
        RuleFor(x => x.Currency).NotEmpty().Length(3).WithMessage("Currency must be a 3-letter code.");
        RuleFor(x => x.CategoryId).NotEmpty().WithMessage("Category is required.");
        RuleFor(x => x.Period).IsInEnum().WithMessage("Invalid budget period.");
    }
}
