using Microsoft.AspNetCore.Mvc;
using SelfOrbit.BuildingBlocks.Contracts;
using SelfOrbit.ExpenseService.Application.Commands.SetBudget;
using SelfOrbit.ExpenseService.Application.DTOs;
using SelfOrbit.ExpenseService.Application.Interfaces;
using SelfOrbit.ExpenseService.Domain.Enums;

namespace SelfOrbit.ExpenseService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class BudgetsController : ControllerBase
{
    private readonly SetBudgetHandler _setBudgetHandler;
    private readonly IBudgetRepository _budgetRepository;

    public BudgetsController(SetBudgetHandler setBudgetHandler, IBudgetRepository budgetRepository)
    {
        _setBudgetHandler = setBudgetHandler;
        _budgetRepository = budgetRepository;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status201Created)]
    public async Task<IActionResult> SetBudget([FromBody] SetBudgetRequest request, CancellationToken ct)
    {
        var command = new SetBudgetCommand(request.LimitAmount, request.Currency, request.Period, request.CategoryId);
        var result = await _setBudgetHandler.HandleAsync(command, ct);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<Guid>.Fail(result.Error!));

        return CreatedAtAction(nameof(GetAll), null, ApiResponse<Guid>.Ok(result.Value!));
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<BudgetDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var budgets = await _budgetRepository.GetActiveBudgetsAsync(ct);

        var dtos = budgets.Select(b => new BudgetDto(
            b.Id, b.Limit.Amount, b.Limit.Currency, b.CurrentSpend.Amount,
            b.Period.ToString(), b.CategoryId, b.StartDate, b.EndDate,
            b.IsActive, b.RemainingAmount, b.UtilizationPercentage)).ToList();

        return Ok(ApiResponse<List<BudgetDto>>.Ok(dtos));
    }
}

public record SetBudgetRequest(decimal LimitAmount, string Currency, BudgetPeriod Period, Guid CategoryId);
