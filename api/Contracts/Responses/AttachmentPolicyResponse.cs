namespace api.Contracts;

public record AttachmentPolicyResponse(
    int MaxFiles,
    long MaxFileSizeBytes,
    IReadOnlyList<string> AllowedExtensions
);
