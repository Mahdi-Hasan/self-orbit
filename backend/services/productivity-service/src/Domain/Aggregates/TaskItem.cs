using SelfOrbit.BuildingBlocks.Domain;

namespace SelfOrbit.ProductivityService.Domain.Aggregates;

/// <summary>
/// TaskItem aggregate root with lifecycle state machine.
/// States: Pending → InProgress → Completed | Cancelled
/// </summary>
public class TaskItem : AggregateRoot
{
    public string Title { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public TaskItemStatus Status { get; private set; }
    public TaskItemPriority Priority { get; private set; }
    public DateTime? Deadline { get; private set; }
    public DateTime? CompletedAt { get; private set; }
    public List<string> Tags { get; private set; } = [];
    public string? EstimatedDuration { get; private set; }

    private TaskItem() { }

    public static TaskItem Create(
        string title,
        string? description = null,
        TaskItemPriority priority = TaskItemPriority.Medium,
        DateTime? deadline = null,
        List<string>? tags = null,
        string? estimatedDuration = null)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException("Title is required.", nameof(title));

        return new TaskItem
        {
            Title = title,
            Description = description,
            Status = TaskItemStatus.Pending,
            Priority = priority,
            Deadline = deadline,
            Tags = tags ?? [],
            EstimatedDuration = estimatedDuration
        };
    }

    public void Start()
    {
        if (Status != TaskItemStatus.Pending)
            throw new InvalidOperationException("Only pending tasks can be started.");
        Status = TaskItemStatus.InProgress;
    }

    public void Complete()
    {
        if (Status == TaskItemStatus.Completed || Status == TaskItemStatus.Cancelled)
            throw new InvalidOperationException("Task is already in a terminal state.");
        Status = TaskItemStatus.Completed;
        CompletedAt = DateTime.UtcNow;
    }

    public void Cancel()
    {
        if (Status == TaskItemStatus.Completed || Status == TaskItemStatus.Cancelled)
            throw new InvalidOperationException("Task is already in a terminal state.");
        Status = TaskItemStatus.Cancelled;
    }

    public void UpdatePriority(TaskItemPriority priority) => Priority = priority;
    public void UpdateDeadline(DateTime? deadline) => Deadline = deadline;
}

public enum TaskItemStatus { Pending = 0, InProgress = 1, Completed = 2, Cancelled = 3 }
public enum TaskItemPriority { Urgent = 0, High = 1, Medium = 2, Low = 3 }
