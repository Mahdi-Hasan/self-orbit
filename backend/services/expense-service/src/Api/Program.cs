using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Serilog;
using SelfOrbit.BuildingBlocks.Domain;
using SelfOrbit.BuildingBlocks.Infrastructure;
using SelfOrbit.ExpenseService.Api.Middleware;
using SelfOrbit.ExpenseService.Application.Commands.CreateExpense;
using SelfOrbit.ExpenseService.Application.Commands.SetBudget;
using SelfOrbit.ExpenseService.Application.Interfaces;
using SelfOrbit.ExpenseService.Application.Queries.GetExpenses;
using SelfOrbit.ExpenseService.Infrastructure.GrpcClients;
using SelfOrbit.ExpenseService.Infrastructure.Persistence;
using SelfOrbit.ExpenseService.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// --- Serilog ---
builder.Host.UseSerilog((context, config) =>
{
    config
        .ReadFrom.Configuration(context.Configuration)
        .WriteTo.Console()
        .WriteTo.File("logs/expense-service-.log", rollingInterval: RollingInterval.Day)
        .Enrich.FromLogContext()
        .Enrich.WithProperty("Service", "ExpenseService");
});

// --- Database ---
builder.Services.AddDbContext<ExpenseDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("ExpenseDb"),
        npgsql => npgsql.MigrationsAssembly(typeof(ExpenseDbContext).Assembly.FullName)));

// --- Repositories ---
builder.Services.AddScoped<IExpenseRepository, ExpenseRepository>();
builder.Services.AddScoped<IBudgetRepository, BudgetRepository>();
builder.Services.AddScoped<IUnitOfWork>(sp => new UnitOfWork(sp.GetRequiredService<ExpenseDbContext>()));

// --- AI gRPC Client ---
builder.Services.AddSingleton<IAiServiceClient, AiServiceClient>();

// --- CQRS Handlers ---
builder.Services.AddScoped<CreateExpenseHandler>();
builder.Services.AddScoped<SetBudgetHandler>();
builder.Services.AddScoped<GetExpensesHandler>();

// --- Validation ---
builder.Services.AddValidatorsFromAssemblyContaining<CreateExpenseValidator>();

// --- API ---
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

// --- Middleware ---
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

// --- Health Check ---
app.MapGet("/health", () => Results.Ok(new { Status = "Healthy", Service = "ExpenseService" }));

app.Run();
