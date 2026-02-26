using System.Net;
using System.Text.Json;
using SelfOrbit.BuildingBlocks.Contracts;

namespace SelfOrbit.ExpenseService.Api.Middleware;

/// <summary>
/// Global exception handling middleware.
/// Maps domain and application exceptions to appropriate HTTP responses.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (SelfOrbit.BuildingBlocks.Application.Exceptions.ValidationException ex)
        {
            _logger.LogWarning(ex, "Validation error occurred");
            await WriteErrorResponseAsync(context, HttpStatusCode.BadRequest, "VALIDATION_ERROR", ex.Message, ex.Errors);
        }
        catch (SelfOrbit.BuildingBlocks.Application.Exceptions.NotFoundException ex)
        {
            _logger.LogWarning(ex, "Entity not found");
            await WriteErrorResponseAsync(context, HttpStatusCode.NotFound, "NOT_FOUND", ex.Message);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid argument");
            await WriteErrorResponseAsync(context, HttpStatusCode.BadRequest, "INVALID_ARGUMENT", ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Invalid operation");
            await WriteErrorResponseAsync(context, HttpStatusCode.Conflict, "INVALID_OPERATION", ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");
            await WriteErrorResponseAsync(context, HttpStatusCode.InternalServerError, "INTERNAL_ERROR", "An unexpected error occurred.");
        }
    }

    private static async Task WriteErrorResponseAsync(
        HttpContext context,
        HttpStatusCode statusCode,
        string code,
        string message,
        IDictionary<string, string[]>? details = null)
    {
        context.Response.StatusCode = (int)statusCode;
        context.Response.ContentType = "application/json";

        var error = new ErrorResponse { Code = code, Message = message, Details = details };
        await context.Response.WriteAsync(JsonSerializer.Serialize(error));
    }
}
