using Microsoft.EntityFrameworkCore;
using SelfOrbit.BuildingBlocks.Infrastructure;
using SelfOrbit.ExpenseService.Application.Interfaces;
using SelfOrbit.ExpenseService.Domain.Aggregates;
using SelfOrbit.ExpenseService.Infrastructure.Persistence;

namespace SelfOrbit.ExpenseService.Infrastructure.Repositories;

public class ExpenseRepository : Repository<Expense>, IExpenseRepository
{
    public ExpenseRepository(ExpenseDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Expense>> GetByDateRangeAsync(DateTime from, DateTime to, CancellationToken ct = default)
    {
        return await DbSet
            .Include(e => e.Category)
            .Where(e => e.ExpenseDate >= from && e.ExpenseDate <= to)
            .OrderByDescending(e => e.ExpenseDate)
            .ToListAsync(ct);
    }

    public async Task<IReadOnlyList<Expense>> GetByCategoryAsync(Guid categoryId, CancellationToken ct = default)
    {
        return await DbSet
            .Include(e => e.Category)
            .Where(e => e.CategoryId == categoryId)
            .OrderByDescending(e => e.ExpenseDate)
            .ToListAsync(ct);
    }

    public override async Task<Expense?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        return await DbSet
            .Include(e => e.Category)
            .FirstOrDefaultAsync(e => e.Id == id, ct);
    }
}

public class BudgetRepository : Repository<Budget>, IBudgetRepository
{
    public BudgetRepository(ExpenseDbContext context) : base(context) { }

    public async Task<Budget?> GetActiveBudgetAsync(Guid categoryId, CancellationToken ct = default)
    {
        return await DbSet
            .FirstOrDefaultAsync(b => b.CategoryId == categoryId && b.IsActive, ct);
    }

    public async Task<IReadOnlyList<Budget>> GetActiveBudgetsAsync(CancellationToken ct = default)
    {
        return await DbSet
            .Where(b => b.IsActive)
            .ToListAsync(ct);
    }
}
