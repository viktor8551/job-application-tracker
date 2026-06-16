using api.Models;

namespace api.Contracts;

public record JobApplicationResponse(
    int Id,
    string CompanyName,
    string PositionTitle,
    ApplicationStatus Status,
    DateOnly? AppliedDate,
    DateOnly? InterviewDate,
    string? JobUrl,
    string? Notes,
    DateTime CreatedAt
);
