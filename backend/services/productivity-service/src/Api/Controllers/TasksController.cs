using Microsoft.AspNetCore.Mvc;
using SelfOrbit.BuildingBlocks.Contracts;
using SelfOrbit.ProductivityService.Domain.Aggregates;

namespace SelfOrbit.ProductivityService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ILogger<TasksController> _logger;

    public TasksController(ILogger<TasksController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateTaskRequest request, CancellationToken ct)
    {
        _logger.LogInformation("Creating task from text: {Preview}", request.RawText[..Math.Min(50, request.RawText.Length)]);

        // TODO: Call AI service to parse, then create TaskItem
        var task = TaskItem.Create(request.RawText, priority: TaskItemPriority.Medium);

        return CreatedAtAction(nameof(GetById), new { id = task.Id }, ApiResponse<Guid>.Ok(task.Id));
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<object>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        // TODO: Implement with repository
        return Ok(ApiResponse<List<object>>.Ok([]));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        // TODO: Implement
        return Ok(ApiResponse<string>.Ok("Not implemented"));
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        _logger.LogInformation("Updating task {TaskId} status to {Status}", id, request.Status);
        // TODO: Implement state machine transition
        return Ok(ApiResponse<string>.Ok($"Status updated to {request.Status}"));
    }
}

public record CreateTaskRequest(string RawText, string? Timezone = null);
public record UpdateStatusRequest(string Status);
