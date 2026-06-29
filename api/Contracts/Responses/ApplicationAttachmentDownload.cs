namespace api.Contracts;

public record ApplicationAttachmentDownload(
    Stream Content,
    string OriginalFileName,
    string ContentType
);
