namespace api.Models;

public enum ApplicationStatus
{
    Interested, // You found the job but have not applied
    Applied, // You have applied
    Interviewing, // You are in interview process
    Offered, // You got offered the job
    Rejected, // You got rejected
    Withdrawn, // You no longer want this job
}
