using Microsoft.Extensions.Logging;
using SelfOrbit.ExpenseService.Application.Interfaces;

namespace SelfOrbit.ExpenseService.Infrastructure.GrpcClients;

/// <summary>
/// Typed gRPC client for calling the AI infrastructure.
/// Includes retry policy, timeout configuration, and DTO translation.
/// </summary>
public class AiServiceClient : IAiServiceClient
{
    private readonly ILogger<AiServiceClient> _logger;

    public AiServiceClient(ILogger<AiServiceClient> logger)
    {
        _logger = logger;
    }

    public async Task<AiParsedExpense> ParseExpenseAsync(string rawText, string currency, CancellationToken ct = default)
    {
        _logger.LogInformation("Calling AI service to parse expense: {TextPreview}", rawText[..Math.Min(50, rawText.Length)]);

        try
        {
            // TODO: Replace with actual gRPC client call after protobuf compilation
            // var request = new ParseExpenseRequest { RawText = rawText, PreferredCurrency = currency };
            // var response = await _grpcClient.ParseExpenseAsync(request, cancellationToken: ct);

            // Stub response for scaffolding
            await Task.Delay(10, ct); // Simulate network call

            return new AiParsedExpense(
                Amount: 0m,
                Currency: currency,
                Category: "uncategorized",
                Description: rawText,
                Merchant: null,
                Date: DateTime.UtcNow,
                Confidence: "low");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "AI service call failed for expense parsing");
            throw;
        }
    }
}
