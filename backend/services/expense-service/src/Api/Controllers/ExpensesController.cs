using Microsoft.AspNetCore.Mvc;
using SelfOrbit.BuildingBlocks.Contracts;
using SelfOrbit.ExpenseService.Application.Commands.CreateExpense;
using SelfOrbit.ExpenseService.Application.DTOs;
using SelfOrbit.ExpenseService.Application.Queries.GetExpenses;

namespace SelfOrbit.ExpenseService.Api.Controllers;

/// <summary>
/// REST controller for expense operations.
/// Thin controller — all business logic in CQRS handlers.
/// </summary>
[ApiController]
[Route("api/v1/[controller]")]
public class ExpensesController : ControllerBase
{
    private readonly CreateExpenseHandler _createHandler;
    private readonly GetExpensesHandler _getHandler;
    private readonly ILogger<ExpensesController> _logger;

    public ExpensesController(
        CreateExpenseHandler createHandler,
        GetExpensesHandler getHandler,
        ILogger<ExpensesController> logger)
    {
        _createHandler = createHandler;
        _getHandler = getHandler;
        _logger = logger;
    }

    /// <summary>
    /// Create a new expense from natural language text.
    /// Triggers AI parsing via gRPC.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateExpenseRequest request, CancellationToken ct)
    {
        var command = new CreateExpenseCommand(request.RawText, request.Currency, request.CategoryId, request.Notes);
        var result = await _createHandler.HandleAsync(command, ct);

        if (!result.IsSuccess)
            return BadRequest(ApiResponse<Guid>.Fail(result.Error!));

        return CreatedAtAction(nameof(GetById), new { id = result.Value }, ApiResponse<Guid>.Ok(result.Value!));
    }

    /// <summary>
    /// Get expenses with optional filters.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<IReadOnlyList<ExpenseDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] Guid? categoryId,
        CancellationToken ct)
    {
        var query = new GetExpensesQuery(from, to, categoryId);
        var expenses = await _getHandler.HandleAsync(query, ct);

        return Ok(ApiResponse<IReadOnlyList<ExpenseDto>>.Ok(expenses));
    }

    /// <summary>
    /// Get expense by ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<ExpenseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        // TODO: Implement GetExpenseByIdQuery
        _logger.LogInformation("Getting expense {ExpenseId}", id);
        return Ok(ApiResponse<string>.Ok("Not implemented yet"));
    }
}

// --- Request DTOs ---
public record CreateExpenseRequest(
    string RawText,
    string? Currency = null,
    Guid? CategoryId = null,
    string? Notes = null);
