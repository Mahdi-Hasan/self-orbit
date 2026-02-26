namespace SelfOrbit.ExpenseService.Application.DTOs;

public record ExpenseDto(
    Guid Id,
    decimal Amount,
    string Currency,
    string Description,
    string? Merchant,
    DateTime ExpenseDate,
    string Status,
    Guid CategoryId,
    string? CategoryName,
    List<string> Tags,
    string? Notes,
    DateTime CreatedAt,
    DateTime? UpdatedAt);

public record BudgetDto(
    Guid Id,
    decimal LimitAmount,
    string Currency,
    decimal CurrentSpend,
    string Period,
    Guid CategoryId,
    DateTime StartDate,
    DateTime EndDate,
    bool IsActive,
    decimal RemainingAmount,
    decimal UtilizationPercentage);
