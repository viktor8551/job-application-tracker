namespace api.Models;

public class JobApplication {
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public string CompanyName { get; set; } = string.Empty;
    public string PositionTitle { get; set; } = string.Empty;
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Interested;
    public DateOnly? AppliedDate { get; set; }
    public DateTime? InterviewDate { get; set; }
    public string? JobUrl { get; set; }
    public string? Notes { get; set; }
    public List<ApplicationAttachment> Attachments { get; set; } = [];
    public DateTime CreatedAt { get; set; }
}
