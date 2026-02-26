using Microsoft.AspNetCore.Mvc;
using SelfOrbit.BuildingBlocks.Contracts;
using SelfOrbit.ProductivityService.Domain.Aggregates;

namespace SelfOrbit.ProductivityService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class JournalController : ControllerBase
{
    private readonly ILogger<JournalController> _logger;

    public JournalController(ILogger<JournalController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateJournalRequest request, CancellationToken ct)
    {
        _logger.LogInformation("Creating journal entry");

        var entry = JournalEntry.CreateText(request.Text);
        // TODO: Call AI for summarization

        return CreatedAtAction(nameof(GetById), new { id = entry.Id }, ApiResponse<Guid>.Ok(entry.Id));
    }

    [HttpPost("audio")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status201Created)]
    public async Task<IActionResult> UploadAudio(IFormFile file, CancellationToken ct)
    {
        _logger.LogInformation("Uploading audio journal entry, size: {Size}", file.Length);

        // TODO: Store audio, call AI for transcription + summarization
        var entry = JournalEntry.CreateAudio("placeholder-url", 0);

        return CreatedAtAction(nameof(GetById), new { id = entry.Id }, ApiResponse<Guid>.Ok(entry.Id));
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<object>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        return Ok(ApiResponse<List<object>>.Ok([]));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        return Ok(ApiResponse<string>.Ok("Not implemented"));
    }
}

public record CreateJournalRequest(string Text);
