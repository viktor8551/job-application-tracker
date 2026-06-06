namespace api.Models;

public class User
{
    public int Id { get; set; }
    public string? DisplayName { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<JobApplication> JobApplications { get; set; } = [];
}
