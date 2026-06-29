namespace api.Models;

public class ApplicationAttachment
{
    public int Id { get; set; }
    public int JobApplicationId { get; set; }
    public JobApplication JobApplication { get; set; } = null!;
    public string OriginalFileName { get; set; } = string.Empty;
    public string StoredFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public DateTime UploadedAt { get; set; }
}
