using FluentAssertions;
using SelfOrbit.ProductivityService.Domain.Aggregates;

namespace SelfOrbit.ProductivityService.UnitTests.Domain;

public class TaskItemTests
{
    [Fact]
    public void Create_ValidTitle_ShouldCreatePendingTask()
    {
        var task = TaskItem.Create("Buy groceries");

        task.Title.Should().Be("Buy groceries");
        task.Status.Should().Be(TaskItemStatus.Pending);
        task.Priority.Should().Be(TaskItemPriority.Medium);
    }

    [Fact]
    public void Create_EmptyTitle_ShouldThrow()
    {
        var act = () => TaskItem.Create("");
        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Start_PendingTask_ShouldTransitionToInProgress()
    {
        var task = TaskItem.Create("Task");
        task.Start();

        task.Status.Should().Be(TaskItemStatus.InProgress);
    }

    [Fact]
    public void Start_InProgressTask_ShouldThrow()
    {
        var task = TaskItem.Create("Task");
        task.Start();

        var act = () => task.Start();
        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void Complete_ShouldSetCompletedAtTimestamp()
    {
        var task = TaskItem.Create("Task");
        task.Start();
        task.Complete();

        task.Status.Should().Be(TaskItemStatus.Completed);
        task.CompletedAt.Should().NotBeNull();
    }

    [Fact]
    public void Cancel_CompletedTask_ShouldThrow()
    {
        var task = TaskItem.Create("Task");
        task.Complete();

        var act = () => task.Cancel();
        act.Should().Throw<InvalidOperationException>();
    }

    [Fact]
    public void Complete_CancelledTask_ShouldThrow()
    {
        var task = TaskItem.Create("Task");
        task.Cancel();

        var act = () => task.Complete();
        act.Should().Throw<InvalidOperationException>();
    }
}
