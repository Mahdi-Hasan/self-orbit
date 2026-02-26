namespace SelfOrbit.BuildingBlocks.Application.CQRS;

/// <summary>
/// Marker interface for commands that return a result.
/// </summary>
public interface ICommand<TResult> { }

/// <summary>
/// Marker interface for commands without a return value.
/// </summary>
public interface ICommand { }

/// <summary>
/// Marker interface for queries.
/// </summary>
public interface IQuery<TResult> { }
