namespace api.Options;

public sealed class AttachmentOptions
{
    public int MaxFiles { get; init; }
    public long MaxFileSizeMiB { get; init; }
    public long MaxFileSizeBytes => MaxFileSizeMiB * 1024 * 1024;
    public string[] AllowedExtensions { get; init; } = [];
}
