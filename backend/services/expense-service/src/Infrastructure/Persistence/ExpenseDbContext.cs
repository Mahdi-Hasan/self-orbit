using Microsoft.EntityFrameworkCore;
using SelfOrbit.BuildingBlocks.Infrastructure;
using SelfOrbit.ExpenseService.Domain.Aggregates;
using SelfOrbit.ExpenseService.Domain.Entities;

namespace SelfOrbit.ExpenseService.Infrastructure.Persistence;

/// <summary>
/// EF Core DbContext for the Expense Service.
/// No lazy loading. Explicit includes only.
/// </summary>
public class ExpenseDbContext : BaseDbContext
{
    public DbSet<Expense> Expenses => Set<Expense>();
    public DbSet<Budget> Budgets => Set<Budget>();
    public DbSet<Category> Categories => Set<Category>();

    public ExpenseDbContext(DbContextOptions<ExpenseDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Expense configuration
        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).HasMaxLength(500).IsRequired();
            entity.Property(e => e.Merchant).HasMaxLength(200);
            entity.Property(e => e.Status).HasConversion<string>();
            entity.Property(e => e.Notes).HasMaxLength(2000);

            // Money value object mapping
            entity.OwnsOne(e => e.Amount, money =>
            {
                money.Property(m => m.Amount).HasColumnName("Amount").HasPrecision(18, 2);
                money.Property(m => m.Currency).HasColumnName("Currency").HasMaxLength(3);
            });

            // Tags as JSON column
            entity.Property(e => e.Tags).HasColumnType("jsonb");

            entity.HasOne(e => e.Category)
                .WithMany()
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.ExpenseDate);
            entity.HasIndex(e => e.CategoryId);
        });

        // Budget configuration
        modelBuilder.Entity<Budget>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Period).HasConversion<string>();

            entity.OwnsOne(e => e.Limit, money =>
            {
                money.Property(m => m.Amount).HasColumnName("LimitAmount").HasPrecision(18, 2);
                money.Property(m => m.Currency).HasColumnName("LimitCurrency").HasMaxLength(3);
            });

            entity.OwnsOne(e => e.CurrentSpend, money =>
            {
                money.Property(m => m.Amount).HasColumnName("CurrentSpendAmount").HasPrecision(18, 2);
                money.Property(m => m.Currency).HasColumnName("CurrentSpendCurrency").HasMaxLength(3);
            });

            entity.HasIndex(e => new { e.CategoryId, e.IsActive });
        });

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasIndex(e => e.Name).IsUnique();
        });
    }
}
