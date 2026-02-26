using FluentValidation;
using SelfOrbit.BuildingBlocks.Application.CQRS;
using SelfOrbit.BuildingBlocks.Domain;
using SelfOrbit.ExpenseService.Application.Interfaces;
using SelfOrbit.ExpenseService.Domain.Aggregates;
using SelfOrbit.ExpenseService.Domain.ValueObjects;

namespace SelfOrbit.ExpenseService.Application.Commands.CreateExpense;

// --- Command ---
public record CreateExpenseCommand(
    string RawText,
    string? Currency,
    Guid? CategoryId,
    string? Notes) : ICommand<Result<Guid>>;

// --- Handler ---
public class CreateExpenseHandler
{
    private readonly IExpenseRepository _expenseRepository;
    private readonly IAiServiceClient _aiClient;
    private readonly IUnitOfWork _unitOfWork;

    public CreateExpenseHandler(
        IExpenseRepository expenseRepository,
        IAiServiceClient aiClient,
        IUnitOfWork unitOfWork)
    {
        _expenseRepository = expenseRepository;
        _aiClient = aiClient;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> HandleAsync(CreateExpenseCommand command, CancellationToken ct)
    {
        // Call AI service to parse the raw text
        var parsed = await _aiClient.ParseExpenseAsync(
            command.RawText,
            command.Currency ?? "USD",
            ct);

        // Create domain entity
        var money = new Money(parsed.Amount, parsed.Currency);
        var categoryId = command.CategoryId ?? Guid.NewGuid(); // TODO: resolve from parsed.Category
        var expenseDate = parsed.Date ?? DateTime.UtcNow;

        var expense = Expense.Create(
            money,
            parsed.Description,
            categoryId,
            expenseDate,
            parsed.Merchant,
            notes: command.Notes);

        await _expenseRepository.AddAsync(expense, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return Result<Guid>.Success(expense.Id);
    }
}

// --- Validator ---
public class CreateExpenseValidator : AbstractValidator<CreateExpenseCommand>
{
    public CreateExpenseValidator()
    {
        RuleFor(x => x.RawText)
            .NotEmpty().WithMessage("Expense text is required.")
            .MaximumLength(2000).WithMessage("Text cannot exceed 2000 characters.");

        RuleFor(x => x.Currency)
            .Length(3).When(x => x.Currency is not null)
            .WithMessage("Currency must be a 3-letter ISO 4217 code.");
    }
}
