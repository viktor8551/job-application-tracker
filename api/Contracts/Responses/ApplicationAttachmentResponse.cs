namespace api.Contracts;

public record ApplicationAttachmentResponse(
    int Id,
    string OriginalFileName,
    string ContentType,
    long SizeBytes,
    DateTime UploadedAt
);
