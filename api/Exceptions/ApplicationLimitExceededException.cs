namespace api.Exceptions;

public sealed class ApplicationLimitExceededException(int maximumApplications)
    : Exception($"A user cannot have more than {maximumApplications} applications.")
{
    public int MaximumApplications { get; } = maximumApplications;
}
