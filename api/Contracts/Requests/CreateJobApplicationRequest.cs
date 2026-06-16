using System.ComponentModel.DataAnnotations;
using api.Models;

namespace api.Contracts;

public record CreateJobApplicationRequest(
    [Required]
    [MaxLength(150)]
    string CompanyName,

    [Required]
    [MaxLength(150)]
    string PositionTitle,

    ApplicationStatus Status = ApplicationStatus.Interested,

    DateOnly? AppliedDate = null,

    DateOnly? InterviewDate = null,

    [MaxLength(2048)]
    string? JobUrl = null,

    [MaxLength(3000)]
    string? Notes = null
);
